"""Shared CLI helpers."""

from __future__ import annotations

import importlib.resources
import pathlib

from rich.console import Console

_CONSOLE: Console | None = None
_SCHEMA_FILENAME = "schema.json"


def console() -> Console:
    """Return the shared rich Console instance (cached, NO_COLOR-aware)."""
    global _CONSOLE
    if _CONSOLE is None:
        instance = Console()
        _CONSOLE = instance
        return instance
    return _CONSOLE


def find_schema_path() -> pathlib.Path:
    """Return the filesystem path to the bundled v2.14 schema.json.

    Wheel installs find the schema at ``grok_install/schema.json`` via
    ``importlib.resources`` (placed there by hatch's ``force-include`` at
    wheel-build time). Editable / dev installs fall back to the canonical
    source location under ``spec/v2.14/``.
    """
    resource = importlib.resources.files("grok_install") / _SCHEMA_FILENAME
    if resource.is_file():
        return pathlib.Path(str(resource))
    src_root = pathlib.Path(__file__).resolve().parent.parent.parent
    candidate = src_root / "spec" / "v2.14" / _SCHEMA_FILENAME
    if candidate.is_file():
        return candidate
    raise FileNotFoundError(
        f"{_SCHEMA_FILENAME} not found in package resources or source tree",
    )


def find_agent_manifests(root: pathlib.Path) -> list[pathlib.Path]:
    """Return manifests to validate for the given root.

    If ``root`` is a file, returns ``[root]`` regardless of name.
    If ``root`` is a directory, returns every ``*.yaml`` and ``*.yml`` found
    recursively beneath it, sorted for deterministic output.
    """
    if root.is_file():
        return [root]
    yaml_files = list(root.glob("**/*.yaml")) + list(root.glob("**/*.yml"))
    return sorted(set(yaml_files))
