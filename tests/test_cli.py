"""CLI smoke tests via click.testing.CliRunner."""

import pathlib

from click.testing import CliRunner

from cli.main import cli


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


def test_init_stub() -> None:
    runner = CliRunner()
    result = runner.invoke(cli, ["init"])
    assert result.exit_code == 0
    assert "Not yet implemented" in result.output


def test_run_stub() -> None:
    runner = CliRunner()
    result = runner.invoke(cli, ["run", "some-agent"])
    assert result.exit_code == 0
    assert "Not yet implemented" in result.output


def test_scan_stub() -> None:
    runner = CliRunner()
    result = runner.invoke(cli, ["scan"])
    assert result.exit_code == 0
    assert "Not yet implemented" in result.output


def test_scan_with_lucas_flag() -> None:
    runner = CliRunner()
    result = runner.invoke(cli, ["scan", "--lucas-via", "xlos"])
    assert result.exit_code == 0
    assert "Not yet implemented" in result.output
    assert "xlos" in result.output.lower() or "lucas" in result.output.lower()


def test_list_agents_stub() -> None:
    runner = CliRunner()
    result = runner.invoke(cli, ["list-agents"])
    assert result.exit_code == 0
    assert "Not yet implemented" in result.output
