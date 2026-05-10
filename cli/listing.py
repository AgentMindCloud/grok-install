"""list-agents command implementation.

Output contract is locked because the marketplace front-end consumes it:
- Default table mode columns: slug, name, version, targets, updated_at (in order).
- ``--json`` emits an array of full manifest objects, key order matching schema.
- ``--target <name>`` filters by ``deploy.targets`` membership.
- Exit 0 on empty result; exit 2 if any schema-invalid manifest is found.
"""

from __future__ import annotations

import json
import pathlib
from typing import Any, cast

import yaml
from rich.table import Table

from cli._utils import console
from cli.validate import validate_manifest


def find_agent_manifests_recursive(root: pathlib.Path) -> list[pathlib.Path]:
    """Find every ``grok-install.yaml`` under ``root``, recursively, sorted."""
    if not root.exists() or not root.is_dir():
        return []
    return sorted(root.glob("**/grok-install.yaml"))


def load_manifest(path: pathlib.Path) -> dict[str, Any]:
    """Load a manifest YAML and return its parsed dict."""
    with path.open("r", encoding="utf-8") as handle:
        data = yaml.safe_load(handle)
    if not isinstance(data, dict):
        raise ValueError(f"Manifest at {path} did not parse to a YAML object")
    return cast("dict[str, Any]", data)


def _display_name(manifest: dict[str, Any]) -> str:
    """Pick a display name: prefer visuals.preview_card.title, fall back to slug."""
    visuals = manifest.get("visuals")
    if isinstance(visuals, dict):
        card = visuals.get("preview_card")
        if isinstance(card, dict):
            title = card.get("title")
            if isinstance(title, str) and title:
                return title
    name = manifest.get("name")
    return name if isinstance(name, str) else ""


def _format_targets(manifest: dict[str, Any]) -> str:
    deploy = manifest.get("deploy")
    if not isinstance(deploy, dict):
        return ""
    targets = deploy.get("targets")
    if not isinstance(targets, list):
        return ""
    return ",".join(str(t) for t in targets)


def _matches_target(manifest: dict[str, Any], target: str) -> bool:
    deploy = manifest.get("deploy")
    if not isinstance(deploy, dict):
        return False
    targets = deploy.get("targets")
    if not isinstance(targets, list):
        return False
    return target in targets


def run_list_agents(
    root: pathlib.Path,
    *,
    output_json: bool = False,
    target_filter: str | None = None,
) -> int:
    """List agents under ``root``. Returns shell exit code per the contract."""
    manifest_paths = find_agent_manifests_recursive(root)
    manifests: list[dict[str, Any]] = []
    invalid_found = False

    for path in manifest_paths:
        try:
            result = validate_manifest(path)
        except (OSError, ValueError) as exc:
            console().print(f"[red]Error reading {path}:[/red] {exc}")
            invalid_found = True
            continue
        if not result.ok:
            console().print(f"[red]Schema-invalid manifest:[/red] {path}")
            for err in result.errors:
                console().print(f"  [cyan]{err.path}[/cyan] {err.message}")
            invalid_found = True
            continue
        manifest = load_manifest(path)
        if target_filter is not None and not _matches_target(manifest, target_filter):
            continue
        manifests.append(manifest)

    if invalid_found:
        return 2

    if output_json:
        # Use raw print so the output is consumable by downstream tools.
        # rich's print_json reformats; we want the canonical JSON the schema
        # produces, key-order-preserved.
        print(json.dumps(manifests, indent=2, ensure_ascii=False))
        return 0

    table = Table()
    table.add_column("slug", style="cyan")
    table.add_column("name")
    table.add_column("version")
    table.add_column("targets")
    table.add_column("updated_at")

    for manifest in manifests:
        slug = str(manifest.get("name", ""))
        table.add_row(
            slug,
            _display_name(manifest),
            str(manifest.get("version", "")),
            _format_targets(manifest),
            str(manifest.get("updated_at", "")),
        )

    console().print(table)
    return 0
