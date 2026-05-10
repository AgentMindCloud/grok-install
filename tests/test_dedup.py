"""Tests for cli.dedup — the locked migration dedup rule.

Rule (from Phase 2b.2 spec):
- exact slug match OR identical content hash = same agent, keep newer updated_at
- same slug + different content hash = SlugCollisionError
- different slug + different hash = separate agents
"""

import pytest

from cli.dedup import (
    SlugCollisionError,
    content_hash,
    dedup_manifests,
)


def _manifest(slug: str, model: str = "grok-4", updated_at: str = "2026-05-10") -> dict:
    return {
        "version": "2.14",
        "name": slug,
        "description": f"Test agent {slug}.",
        "runtime": {"engine": "grok", "model": model},
        "deploy": {"targets": ["cli"]},
        "updated_at": updated_at,
    }


def test_content_hash_excludes_updated_at() -> None:
    """Same content at different timestamps must produce the same hash."""
    a = _manifest("foo", updated_at="2026-05-10")
    b = _manifest("foo", updated_at="2026-12-01")
    assert content_hash(a) == content_hash(b)


def test_content_hash_differs_on_content_change() -> None:
    a = _manifest("foo", model="grok-4")
    b = _manifest("foo", model="grok-3")
    assert content_hash(a) != content_hash(b)


def test_dedup_no_duplicates_returns_all() -> None:
    """Three unique slugs with unique content → all three preserved."""
    inputs = [_manifest("foo"), _manifest("bar"), _manifest("baz")]
    out = dedup_manifests(inputs)
    assert len(out) == 3
    slugs = {m["name"] for m in out}
    assert slugs == {"foo", "bar", "baz"}


def test_dedup_same_slug_same_hash_keeps_newer() -> None:
    """Same slug + same content → keep the one with newer updated_at."""
    older = _manifest("foo", updated_at="2026-01-01")
    newer = _manifest("foo", updated_at="2026-12-31")
    out = dedup_manifests([older, newer])
    assert len(out) == 1
    assert out[0]["updated_at"] == "2026-12-31"


def test_dedup_same_slug_same_hash_keeps_newer_reverse_order() -> None:
    """Order independence: newer-first input also keeps newer."""
    older = _manifest("foo", updated_at="2026-01-01")
    newer = _manifest("foo", updated_at="2026-12-31")
    out = dedup_manifests([newer, older])
    assert len(out) == 1
    assert out[0]["updated_at"] == "2026-12-31"


def test_dedup_slug_collision_different_content_raises() -> None:
    """Same slug + different content → SlugCollisionError (fail loud)."""
    a = _manifest("foo", model="grok-4")
    b = _manifest("foo", model="grok-3")
    with pytest.raises(SlugCollisionError) as exc_info:
        dedup_manifests([a, b])
    assert "foo" in str(exc_info.value)


def test_dedup_same_hash_different_slug_dedups() -> None:
    """Same content hash, different slug → still treated as same agent (OR rule)."""
    a = _manifest("foo", updated_at="2026-01-01")
    b = dict(a, name="bar")  # same content except slug
    b["updated_at"] = "2026-12-31"
    out = dedup_manifests([a, b])
    # The later-updated copy wins, but both share content
    assert len(out) == 1
    assert out[0]["updated_at"] == "2026-12-31"


def test_dedup_missing_name_raises_value_error() -> None:
    bad = {"version": "2.14", "description": "No name field"}
    with pytest.raises(ValueError, match="name"):
        dedup_manifests([bad])
