"""Per-file YAML parse-check for the 14 magic standards.

Standards are NOT agent manifests and use a different schema family. This test
only confirms each file is well-formed YAML; it does not validate against
spec/v2.14/schema.json.
"""

from __future__ import annotations

import pathlib

import pytest
import yaml

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent
STANDARDS_DIR = REPO_ROOT / "standards"
STANDARDS = sorted(STANDARDS_DIR.glob("*.yaml"))


@pytest.mark.parametrize("standard_path", STANDARDS, ids=lambda p: p.name)
def test_standard_parses(standard_path: pathlib.Path) -> None:
    with standard_path.open("r", encoding="utf-8") as handle:
        data = yaml.safe_load(handle)
    assert data is not None, f"{standard_path.name} parsed to None"
