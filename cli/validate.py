"""Schema validation for grok-install manifests."""

from __future__ import annotations

import json
import pathlib
from dataclasses import dataclass
from typing import Any, Literal, cast

import yaml
from jsonschema import Draft202012Validator
from rich.table import Table

from cli._utils import console, find_agent_manifests, find_schema_path

Severity = Literal["error", "warning"]


@dataclass
class ValidationError:
    """A single schema-violation report for one manifest."""

    path: str
    message: str
    severity: Severity = "error"


@dataclass
class ValidationResult:
    """Aggregate validation outcome for one manifest."""

    ok: bool
    errors: list[ValidationError]
    manifest_path: pathlib.Path


def _load_yaml(path: pathlib.Path) -> object:
    with path.open("r", encoding="utf-8") as handle:
        return cast(object, yaml.safe_load(handle))


def _load_schema(path: pathlib.Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        data = json.load(handle)
    if not isinstance(data, dict):
        raise ValueError(f"Schema at {path} did not parse to a JSON object")
    return cast("dict[str, Any]", data)


def _to_pointer(absolute_path: tuple[object, ...]) -> str:
    """Render a jsonschema ``absolute_path`` as an RFC-6901 JSON Pointer."""
    if not absolute_path:
        return "/"
    parts: list[str] = []
    for segment in absolute_path:
        # RFC 6901 escapes: ~ -> ~0, / -> ~1.
        parts.append(str(segment).replace("~", "~0").replace("/", "~1"))
    return "/" + "/".join(parts)


def validate_manifest(
    manifest_path: pathlib.Path,
    schema_path: pathlib.Path | None = None,
) -> ValidationResult:
    """Validate a single manifest file against the v2.14 schema."""
    if schema_path is None:
        schema_path = find_schema_path()
    schema = _load_schema(schema_path)
    manifest = _load_yaml(manifest_path)
    validator = Draft202012Validator(schema)
    raw_errors = sorted(
        validator.iter_errors(manifest),
        key=lambda err: _to_pointer(tuple(err.absolute_path)),
    )
    errors = [
        ValidationError(
            path=_to_pointer(tuple(err.absolute_path)),
            message=err.message,
        )
        for err in raw_errors
    ]
    return ValidationResult(
        ok=not errors,
        errors=errors,
        manifest_path=manifest_path,
    )


def print_result(result: ValidationResult) -> None:
    """Print a single manifest's result with rich markup."""
    if result.ok:
        console().print(f"[green]✓[/green] {result.manifest_path}")
        return
    console().print(f"[red]✗[/red] {result.manifest_path}")
    for err in result.errors:
        style = "red" if err.severity == "error" else "yellow"
        console().print(
            f"  [cyan]{err.path}[/cyan] [{style}]{err.message}[/{style}]",
        )


def print_summary(results: list[ValidationResult]) -> None:
    """Print a rich table summarising directory-mode validation."""
    table = Table(title="Validation summary")
    table.add_column("Manifest", style="cyan")
    table.add_column("Result", style="bold")
    table.add_column("Errors", justify="right")
    for result in results:
        verdict = "[green]ok[/green]" if result.ok else "[red]fail[/red]"
        table.add_row(str(result.manifest_path), verdict, str(len(result.errors)))
    console().print(table)


def run_validate(target: pathlib.Path) -> int:
    """Validate a file or directory of manifests; return a shell exit code.

    Exit codes: 0 on success, 1 if any manifest fails validation,
    2 if the target path can't be read.
    """
    if not target.exists():
        console().print(f"[red]Path not found:[/red] {target}")
        return 2
    manifests = find_agent_manifests(target)
    if not manifests:
        if target.is_dir():
            console().print(
                f"[yellow]No manifest files found under[/yellow] {target}",
            )
            return 0
        manifests = [target]
    results: list[ValidationResult] = []
    for manifest in manifests:
        try:
            results.append(validate_manifest(manifest))
        except OSError as exc:
            console().print(f"[red]Error reading {manifest}:[/red] {exc}")
            return 2
    for result in results:
        print_result(result)
    if len(results) > 1:
        print_summary(results)
    return 0 if all(result.ok for result in results) else 1
