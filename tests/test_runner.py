"""Tests for cli.runner — the run command with Streamlit dispatch.

Per architecture Q4: when deploy.targets includes 'streamlit', run shells
out to ``streamlit run <resolved-entrypoint>``. Other targets stub.
"""

import pathlib

from click.testing import CliRunner

from cli import runner as runner_module
from cli.main import cli
from cli.runner import run_agent


def _write_manifest(
    path: pathlib.Path,
    slug: str,
    *,
    targets: list[str],
    entrypoint: str | None = None,
) -> None:
    targets_yaml = "\n".join(f"    - {t}" for t in targets)
    body = (
        f'version: "2.14"\n'
        f"name: {slug}\n"
        f"description: Test agent for runner.\n"
        f"runtime:\n"
        f"  engine: grok\n"
        f"  model: grok-4\n"
        f"deploy:\n"
        f"  targets:\n"
        f"{targets_yaml}\n"
        f'updated_at: "2026-05-10"\n'
    )
    if entrypoint:
        body += f"entrypoint: {entrypoint}\n"
    path.write_text(body)


def test_run_missing_agent_returns_2(tmp_path: pathlib.Path) -> None:
    """Agent slug not found in path → exit 2."""
    code = run_agent(tmp_path, "definitely-not-an-agent")
    assert code == 2


def test_run_non_streamlit_agent_stubs(tmp_path: pathlib.Path, capsys) -> None:
    """Non-streamlit target → phase_stub printed, exit 0."""
    agent_dir = tmp_path / "test-agent"
    agent_dir.mkdir()
    _write_manifest(
        agent_dir / "grok-install.yaml",
        "test-agent",
        targets=["cli"],
    )
    code = run_agent(tmp_path, "test-agent")
    assert code == 0
    captured = capsys.readouterr()
    combined = captured.out + captured.err
    assert "Not yet implemented" in combined or "later release" in combined


def test_run_streamlit_dispatch_invokes_streamlit(
    tmp_path: pathlib.Path,
    monkeypatch,
) -> None:
    """Streamlit-targeted agent → subprocess.run called with streamlit cmd."""
    agent_dir = tmp_path / "stream-agent"
    agent_dir.mkdir()
    _write_manifest(
        agent_dir / "grok-install.yaml",
        "stream-agent",
        targets=["streamlit"],
        entrypoint="app.py",
    )
    (agent_dir / "app.py").write_text("# streamlit entrypoint\n")

    calls: list[list[str]] = []

    class FakeCompleted:
        returncode = 0

    def fake_run(cmd, check=False, **kwargs):  # type: ignore[no-untyped-def]
        calls.append(list(cmd))
        return FakeCompleted()

    monkeypatch.setattr(runner_module.subprocess, "run", fake_run)

    code = run_agent(tmp_path, "stream-agent")
    assert code == 0
    assert len(calls) == 1
    cmd = calls[0]
    assert cmd[0] == "streamlit"
    assert cmd[1] == "run"
    assert cmd[2].endswith("app.py")


def test_run_streamlit_dispatch_propagates_exit_code(
    tmp_path: pathlib.Path,
    monkeypatch,
) -> None:
    """Streamlit subprocess exit code is propagated."""
    agent_dir = tmp_path / "stream-agent"
    agent_dir.mkdir()
    _write_manifest(
        agent_dir / "grok-install.yaml",
        "stream-agent",
        targets=["streamlit"],
        entrypoint="app.py",
    )
    (agent_dir / "app.py").write_text("# entrypoint\n")

    class FakeCompleted:
        returncode = 42

    def fake_run(cmd, check=False, **kwargs):  # type: ignore[no-untyped-def]
        return FakeCompleted()

    monkeypatch.setattr(runner_module.subprocess, "run", fake_run)

    code = run_agent(tmp_path, "stream-agent")
    assert code == 42


def test_run_streamlit_missing_entrypoint_exits_2(
    tmp_path: pathlib.Path,
    monkeypatch,
) -> None:
    """Streamlit target without entrypoint field → exit 2."""
    agent_dir = tmp_path / "stream-agent"
    agent_dir.mkdir()
    _write_manifest(
        agent_dir / "grok-install.yaml",
        "stream-agent",
        targets=["streamlit"],
    )

    monkeypatch.setattr(
        runner_module.subprocess,
        "run",
        lambda *a, **k: None,  # type: ignore[misc]
    )

    code = run_agent(tmp_path, "stream-agent")
    assert code == 2


def test_run_cli_command_finds_agent_via_path_flag(tmp_path: pathlib.Path) -> None:
    """`grok-install run <agent> --path <dir>` finds and dispatches."""
    agent_dir = tmp_path / "cli-agent"
    agent_dir.mkdir()
    _write_manifest(
        agent_dir / "grok-install.yaml",
        "cli-agent",
        targets=["cli"],
    )
    cli_runner = CliRunner()
    result = cli_runner.invoke(cli, ["run", "cli-agent", "--path", str(tmp_path)])
    assert result.exit_code == 0
    assert "Not yet implemented" in result.output or "later release" in result.output


def test_run_cli_command_missing_agent_exits_2(tmp_path: pathlib.Path) -> None:
    cli_runner = CliRunner()
    result = cli_runner.invoke(cli, ["run", "ghost", "--path", str(tmp_path)])
    assert result.exit_code == 2
