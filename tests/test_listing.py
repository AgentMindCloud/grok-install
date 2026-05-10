"""Tests for cli.listing — the list-agents output contract.

Locked contract:
- Default table columns: slug, name, version, targets, updated_at (in order).
- ``--json`` emits array of full manifest dicts.
- ``--target <name>`` filters by deploy.targets membership.
- Exit 0 on empty result; exit 2 on any schema-invalid manifest.
"""

import json
import pathlib

from click.testing import CliRunner

from cli.listing import run_list_agents
from cli.main import cli

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent
AGENTS_DIR = REPO_ROOT / "agents"


def _write_manifest(path: pathlib.Path, slug: str, *, targets: list[str]) -> None:
    """Helper: write a minimal-but-valid manifest at path."""
    targets_yaml = "\n".join(f"    - {t}" for t in targets)
    path.write_text(f"""version: "2.14"
name: {slug}
description: Test agent for listing.
runtime:
  engine: grok
  model: grok-4
deploy:
  targets:
{targets_yaml}
updated_at: "2026-05-10"
""")


def test_table_has_all_locked_columns() -> None:
    """Default table mode renders the 5 locked column headers in order."""
    runner = CliRunner()
    result = runner.invoke(cli, ["list-agents", str(AGENTS_DIR)])
    assert result.exit_code == 0, result.output
    # Each header appears (rich may wrap chars; ascii table headers are stable)
    for col in ["slug", "name", "version", "targets", "updated_at"]:
        assert col in result.output, f"Column {col!r} missing from table"


def test_table_lists_migrated_agents() -> None:
    """The migrated awesome-grok agents show up by slug."""
    runner = CliRunner()
    result = runner.invoke(cli, ["list-agents", str(AGENTS_DIR)])
    assert result.exit_code == 0
    # spot-check a couple of known slugs
    for slug in ["hello-grok", "code-reviewer", "voice-agent-x"]:
        assert slug in result.output, f"{slug} missing from list output"


def test_json_mode_returns_array(tmp_path: pathlib.Path) -> None:
    """--json emits a parseable array."""
    for slug in ["agent-a", "agent-b"]:
        agent_dir = tmp_path / slug
        agent_dir.mkdir()
        _write_manifest(agent_dir / "grok-install.yaml", slug, targets=["cli"])

    runner = CliRunner()
    result = runner.invoke(cli, ["list-agents", "--json", str(tmp_path)])
    assert result.exit_code == 0
    data = json.loads(result.output)
    assert isinstance(data, list)
    assert len(data) == 2
    slugs = {m["name"] for m in data}
    assert slugs == {"agent-a", "agent-b"}


def test_json_mode_returns_full_manifests() -> None:
    """--json emits full manifest dicts, not just the table columns."""
    runner = CliRunner()
    result = runner.invoke(cli, ["list-agents", "--json", str(AGENTS_DIR)])
    assert result.exit_code == 0
    data = json.loads(result.output)
    assert len(data) == 10
    # Each migrated manifest carries the extra fields beyond the table columns
    sample = data[0]
    assert "runtime" in sample
    assert "deploy" in sample
    assert "entrypoint" in sample  # extra top-level we kept during migration


def test_target_filter_matches_membership(tmp_path: pathlib.Path) -> None:
    """--target <name> keeps only agents with that target in deploy.targets."""
    a = tmp_path / "cli-only"
    a.mkdir()
    _write_manifest(a / "grok-install.yaml", "cli-only", targets=["cli"])
    b = tmp_path / "stream-only"
    b.mkdir()
    _write_manifest(b / "grok-install.yaml", "stream-only", targets=["streamlit"])
    c = tmp_path / "both"
    c.mkdir()
    _write_manifest(c / "grok-install.yaml", "both", targets=["cli", "streamlit"])

    runner = CliRunner()

    res_cli = runner.invoke(cli, ["list-agents", "--target", "cli", "--json", str(tmp_path)])
    assert res_cli.exit_code == 0
    slugs_cli = {m["name"] for m in json.loads(res_cli.output)}
    assert slugs_cli == {"cli-only", "both"}

    res_stream = runner.invoke(
        cli, ["list-agents", "--target", "streamlit", "--json", str(tmp_path)]
    )
    assert res_stream.exit_code == 0
    slugs_stream = {m["name"] for m in json.loads(res_stream.output)}
    assert slugs_stream == {"stream-only", "both"}


def test_empty_directory_exits_zero(tmp_path: pathlib.Path) -> None:
    """No manifests found → still exit 0 (empty result is valid)."""
    runner = CliRunner()
    result = runner.invoke(cli, ["list-agents", str(tmp_path)])
    assert result.exit_code == 0


def test_empty_directory_json_returns_empty_array(tmp_path: pathlib.Path) -> None:
    runner = CliRunner()
    result = runner.invoke(cli, ["list-agents", "--json", str(tmp_path)])
    assert result.exit_code == 0
    assert json.loads(result.output) == []


def test_schema_invalid_manifest_exits_2(tmp_path: pathlib.Path) -> None:
    """Schema-invalid manifest in the tree → exit 2."""
    bad_dir = tmp_path / "broken"
    bad_dir.mkdir()
    (bad_dir / "grok-install.yaml").write_text("""version: "2.13"
name: broken
description: Wrong version constant.
runtime:
  engine: grok
  model: grok-4
deploy:
  targets:
    - cli
""")
    runner = CliRunner()
    result = runner.invoke(cli, ["list-agents", str(tmp_path)])
    assert result.exit_code == 2


def test_run_list_agents_direct_default_target_match(tmp_path: pathlib.Path) -> None:
    """Direct module call with target filter returns 0 even with no match."""
    a = tmp_path / "agent-x"
    a.mkdir()
    _write_manifest(a / "grok-install.yaml", "agent-x", targets=["cli"])
    code = run_list_agents(tmp_path, target_filter="streamlit")
    assert code == 0
