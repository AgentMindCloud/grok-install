"""run command implementation.

Streamlit passthrough per architecture Q4 finance-agent ruling: when an
agent's ``deploy.targets`` includes ``streamlit``, ``grok-install run <agent>``
shells out to ``streamlit run`` against the resolved entrypoint. Non-streamlit
targets remain stubbed pending later sub-PRs.
"""

from __future__ import annotations

import pathlib
import subprocess
from typing import Any

from cli._utils import console, phase_stub
from cli.listing import find_agent_manifests_recursive, load_manifest


def find_agent(root: pathlib.Path, agent_slug: str) -> pathlib.Path | None:
    """Locate the manifest for ``agent_slug`` under ``root`` (recursive)."""
    for manifest_path in find_agent_manifests_recursive(root):
        try:
            manifest = load_manifest(manifest_path)
        except (OSError, ValueError):
            continue
        if manifest.get("name") == agent_slug:
            return manifest_path
    return None


def _streamlit_targeted(manifest: dict[str, Any]) -> bool:
    deploy = manifest.get("deploy")
    if not isinstance(deploy, dict):
        return False
    targets = deploy.get("targets")
    if not isinstance(targets, list):
        return False
    return "streamlit" in targets


def _dispatch_streamlit(manifest_path: pathlib.Path, manifest: dict[str, Any]) -> int:
    """Shell out to ``streamlit run <entrypoint>`` and propagate exit code."""
    entrypoint = manifest.get("entrypoint")
    if not isinstance(entrypoint, str) or not entrypoint:
        console().print(
            f"[red]Cannot dispatch via streamlit:[/red] manifest at "
            f"{manifest_path} has no 'entrypoint' field."
        )
        return 2
    resolved = (manifest_path.parent / entrypoint).resolve()
    command = ["streamlit", "run", str(resolved)]
    console().print(f"[cyan]Running:[/cyan] {' '.join(command)}")
    completed = subprocess.run(command, check=False)
    return completed.returncode


def run_agent(root: pathlib.Path, agent_slug: str) -> int:
    """Run an installed agent by slug. Returns shell exit code."""
    manifest_path = find_agent(root, agent_slug)
    if manifest_path is None:
        console().print(f"[red]Agent not found:[/red] {agent_slug}")
        return 2
    manifest = load_manifest(manifest_path)
    if _streamlit_targeted(manifest):
        return _dispatch_streamlit(manifest_path, manifest)
    # Other runtimes (cli, action, ide, worker, web) ship later.
    phase_stub(
        f"run {agent_slug}",
        "a later release",
        extra=(
            "Only the streamlit dispatch path is implemented in this release. "
            f"Agent '{agent_slug}' has non-streamlit targets; full runtime "
            "support lands with the per-target executors."
        ),
    )
    return 0
