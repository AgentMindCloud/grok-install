"""Tests for cli.validate."""

import pathlib
import shutil

from cli._utils import find_schema_path
from cli.validate import run_validate, validate_manifest


def test_find_schema_path() -> None:
    path = find_schema_path()
    assert path.exists()
    assert path.name == "bridge.schema.json"


def test_valid_minimal(fixtures_dir: pathlib.Path) -> None:
    result = validate_manifest(fixtures_dir / "valid_minimal.yaml")
    assert result.ok, f"Expected ok, got errors: {result.errors}"


def test_valid_full(fixtures_dir: pathlib.Path) -> None:
    result = validate_manifest(fixtures_dir / "valid_full.yaml")
    assert result.ok, f"Expected ok, got errors: {result.errors}"


def test_unknown_extension_block_ok(fixtures_dir: pathlib.Path) -> None:
    """Forward-compat: unknown extensions sub-keys must validate per D5."""
    result = validate_manifest(fixtures_dir / "valid_unknown_extension.yaml")
    assert result.ok, f"Expected ok per D5 forward-compat, got: {result.errors}"


def test_missing_version(fixtures_dir: pathlib.Path) -> None:
    result = validate_manifest(fixtures_dir / "invalid_missing_version.yaml")
    assert not result.ok
    paths = [e.path for e in result.errors]
    messages = [e.message for e in result.errors]
    assert any("version" in p or "version" in m for p, m in zip(paths, messages, strict=False))


def test_wrong_version(fixtures_dir: pathlib.Path) -> None:
    result = validate_manifest(fixtures_dir / "invalid_wrong_version.yaml")
    assert not result.ok
    paths = [e.path for e in result.errors]
    assert any("/version" in p for p in paths)


def test_invalid_slug(fixtures_dir: pathlib.Path) -> None:
    result = validate_manifest(fixtures_dir / "invalid_bad_slug.yaml")
    assert not result.ok
    assert any("/name" in e.path for e in result.errors)


def test_invalid_deploy_target(fixtures_dir: pathlib.Path) -> None:
    result = validate_manifest(fixtures_dir / "invalid_bad_target.yaml")
    assert not result.ok
    paths = [e.path for e in result.errors]
    assert any("/deploy/targets" in p for p in paths)


def test_validate_with_explicit_schema_path(fixtures_dir: pathlib.Path) -> None:
    """validate_manifest accepts an explicit schema_path override."""
    schema_path = find_schema_path()
    result = validate_manifest(fixtures_dir / "valid_minimal.yaml", schema_path)
    assert result.ok


def test_run_validate_directory_mixed(tmp_path: pathlib.Path, fixtures_dir: pathlib.Path) -> None:
    """Directory mode: 3 valid + 1 invalid → exit code 1."""
    sources = [
        "valid_minimal.yaml",
        "valid_full.yaml",
        "valid_unknown_extension.yaml",
        "invalid_missing_version.yaml",
    ]
    for i, src in enumerate(sources):
        agent_dir = tmp_path / f"agent{i}"
        agent_dir.mkdir()
        shutil.copy(fixtures_dir / src, agent_dir / "grok-install.yaml")
    assert run_validate(tmp_path) == 1


def test_run_validate_empty_directory(tmp_path: pathlib.Path) -> None:
    """Empty input is success."""
    assert run_validate(tmp_path) == 0


def test_run_validate_nonexistent(tmp_path: pathlib.Path) -> None:
    """Missing path returns exit code 2."""
    assert run_validate(tmp_path / "does-not-exist") == 2


def test_run_validate_single_file(fixtures_dir: pathlib.Path) -> None:
    """Validating a single file with non-default name still works."""
    assert run_validate(fixtures_dir / "valid_minimal.yaml") == 0
