"""CLI smoke tests via click.testing.CliRunner."""

import pathlib

from click.testing import CliRunner

from grok_install.main import cli


def test_version() -> None:
    runner = CliRunner()
    result = runner.invoke(cli, ["--version"])
    assert result.exit_code == 0
    assert "grok-install" in result.output
    assert "1.0.0a2" in result.output


def test_validate_valid_file(fixtures_dir: pathlib.Path) -> None:
    runner = CliRunner()
    result = runner.invoke(cli, ["validate", str(fixtures_dir / "valid_minimal.yaml")])
    assert result.exit_code == 0, f"Output: {result.output}"


def test_validate_invalid_file(fixtures_dir: pathlib.Path) -> None:
    runner = CliRunner()
    result = runner.invoke(cli, ["validate", str(fixtures_dir / "invalid_missing_version.yaml")])
    assert result.exit_code == 1
