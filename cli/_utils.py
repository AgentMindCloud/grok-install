"""Shared CLI helpers."""

from __future__ import annotations

import importlib.resources
import pathlib

from rich.console import Console
from rich.panel import Panel

_CONSOLE: Console | None = None
_ISSUES_URL = "https://github.com/AgentMindCloud/grok-install-v2/issues"
_SCHEMA_FILENAME = "bridge.schema.json"


def console() -> Console:
    """Return the shared rich Console instance (cached, NO_COLOR-aware)."""
    global _CONSOLE
    if _CONSOLE is None:
        instance = Console()
        _CONSOLE = instance
        return instance
    return _CONSOLE


def phase_stub(
    command: str,
    target_milestone: str,
    *,
    extra: str | None = None,
) -> None:
    """Render a 'not yet implemented' panel for a stub command.

    The ``target_milestone`` string is rendered verbatim; callers pass human
    descriptors ("a later release", "the safety scanner milestone") rather
    than internal phase numbers per DECISIONS.md D9 (no phase-talk in
    user-facing output).
    """
    lines = [
        f"[bold]{command}[/bold] ships in {target_milestone}.",
        f"Track progress: {_ISSUES_URL}",
    ]
    if extra:
        lines.append("")
        lines.append(extra)
    console().print(
        Panel(
            "\n".join(lines),
            title="Not yet implemented",
            border_style="yellow",
        ),
    )


def find_schema_path() -> pathlib.Path:
    """Return the filesystem path to the bundled v2.14 bridge.schema.json.

    Wheel installs find the schema at ``cli/bridge.schema.json`` via
    ``importlib.resources`` (placed there by hatch's ``force-include`` at
    wheel-build time). Editable / dev installs fall back to the canonical
    source location under ``spec/v2.14/schemas/`` per DECISIONS.md Q6.
    """
    resource = importlib.resources.files("cli") / _SCHEMA_FILENAME
    if resource.is_file():
        # str() works for the regular filesystem backend used by both wheel
        # and editable installs. Zip-import edge cases would require
        # importlib.resources.as_file(...); out of scope for v1.0.
        return pathlib.Path(str(resource))
    src_root = pathlib.Path(__file__).resolve().parent.parent
    candidate = src_root / "spec" / "v2.14" / "schemas" / _SCHEMA_FILENAME
    if candidate.is_file():
        return candidate
    raise FileNotFoundError(
        f"{_SCHEMA_FILENAME} not found in package resources or source tree",
    )


def find_agent_manifests(root: pathlib.Path) -> list[pathlib.Path]:
    """Return manifests to validate for the given root.

    If ``root`` is a file, returns ``[root]`` regardless of name.
    If ``root`` is a directory, returns every ``grok-install.yaml`` found
    recursively beneath it, sorted for deterministic output.
    """
    if root.is_file():
        return [root]
    return sorted(root.glob("**/grok-install.yaml"))
