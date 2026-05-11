"""Verify every bundled community template validates against the v2.14 schema."""

import pathlib

from cli._utils import find_agent_manifests
from cli.validate import validate_manifest

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent
TEMPLATES_DIR = REPO_ROOT / "templates"


def test_all_bundled_templates_validate() -> None:
    paths = [p for p in find_agent_manifests(TEMPLATES_DIR) if p.name != "README.md"]
    assert paths, "No template manifests found under templates/"
    failures: list[str] = []
    for path in paths:
        result = validate_manifest(path)
        if not result.ok:
            failures.append(f"{path}: {[e.message for e in result.errors]}")
    assert not failures, "Some templates fail validation:\n" + "\n".join(failures)
