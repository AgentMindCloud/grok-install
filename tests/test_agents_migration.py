"""Verify every migrated agent under agents/ validates against the v2.14 schema.

This is the integration point between Phase 2b.2 migration and Phase 2b.1
schema. If any agent stops validating, this test fails.
"""

import pathlib

from cli.listing import find_agent_manifests_recursive, load_manifest
from cli.validate import validate_manifest

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent
AGENTS_DIR = REPO_ROOT / "agents"

EXPECTED_SIMPLE_SLUGS = {
    "hello-grok",
    "reply-engagement-bot",
    "trend-to-thread",
    "research-swarm",
    "code-reviewer",
    "thread-ghostwriter",
    "personal-knowledge",
    "scientific-discovery",
    "voice-agent-x",
    "live-event-commentator",
}


def test_all_migrated_agents_validate() -> None:
    """Every grok-install.yaml under agents/ must validate cleanly."""
    paths = find_agent_manifests_recursive(AGENTS_DIR)
    assert paths, "No agent manifests found under agents/"
    failures: list[str] = []
    for path in paths:
        result = validate_manifest(path)
        if not result.ok:
            failures.append(f"{path}: {[e.message for e in result.errors]}")
    assert not failures, "Some agents fail validation:\n" + "\n".join(failures)


def test_all_expected_simple_slugs_present() -> None:
    """The 10 awesome-grok-agents slugs are migrated under agents/simple/."""
    simple_dir = AGENTS_DIR / "simple"
    found = {p.parent.name for p in simple_dir.glob("*/grok-install.yaml")}
    assert found == EXPECTED_SIMPLE_SLUGS, (
        f"Slug mismatch.\n"
        f"  missing: {EXPECTED_SIMPLE_SLUGS - found}\n"
        f"  unexpected: {found - EXPECTED_SIMPLE_SLUGS}"
    )


def test_all_migrated_agents_have_required_metadata() -> None:
    """Each migrated manifest carries name, version, runtime, deploy, updated_at."""
    for path in find_agent_manifests_recursive(AGENTS_DIR):
        manifest = load_manifest(path)
        for field in ("name", "version", "runtime", "deploy", "updated_at"):
            assert field in manifest, f"{path} missing {field}"
        assert manifest["version"] == "2.14"
        assert manifest["runtime"]["engine"] == "grok"
        assert "cli" in manifest["deploy"]["targets"]
