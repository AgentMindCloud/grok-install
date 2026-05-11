"""Per-file validation of the 8 core templates against the v2.14 schema."""

from __future__ import annotations

import pathlib

import pytest

from grok_install.validate import validate_manifest

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent
CORE_DIR = REPO_ROOT / "templates" / "core"
CORE_TEMPLATES = sorted(CORE_DIR.glob("*.yaml"))


@pytest.mark.parametrize("manifest_path", CORE_TEMPLATES, ids=lambda p: p.name)
def test_core_template_validates(manifest_path: pathlib.Path) -> None:
    result = validate_manifest(manifest_path)
    assert result.ok, f"{manifest_path.name} failed: {[e.message for e in result.errors]}"
