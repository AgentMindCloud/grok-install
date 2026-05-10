"""Dedup logic for agent migration.

Locked rule per Phase 2b.2 specification:
- exact slug match OR identical content hash = same agent, keep newer updated_at
- slug collision with different content hash = FAIL LOUD (SlugCollisionError)
- different slug + different content hash = separate agents
"""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from typing import Any


class SlugCollisionError(RuntimeError):
    """Raised when two manifests share a slug but have different content hashes."""


@dataclass
class CanonicalAgent:
    """An agent identified by slug + content hash + updated_at."""

    slug: str
    content_hash: str
    updated_at: str
    manifest: dict[str, Any]


def content_hash(manifest: dict[str, Any]) -> str:
    """Compute a stable sha256 of the manifest's canonical content.

    Both ``updated_at`` and ``name`` (the slug) are excluded from the hash:
    - ``updated_at`` so two snapshots of the same agent hash identically.
    - ``name`` so the OR rule (slug-match OR hash-match) catches renames where
      the underlying behaviour is unchanged.
    """
    excluded = {"updated_at", "name"}
    canonical = {k: v for k, v in manifest.items() if k not in excluded}
    serialized = json.dumps(canonical, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()


def dedup_manifests(manifests: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Return the deduped list of manifests per the locked rule.

    Raises ``SlugCollisionError`` if two manifests share a slug but have
    different content hashes (manual disambiguation required).
    """
    result: list[CanonicalAgent] = []

    for manifest in manifests:
        slug = manifest.get("name")
        if not isinstance(slug, str):
            raise ValueError("Manifest missing required 'name' (slug) field")
        h = content_hash(manifest)
        updated_at = str(manifest.get("updated_at", ""))
        new_agent = CanonicalAgent(slug, h, updated_at, manifest)

        match_idx: int | None = None
        for i, existing in enumerate(result):
            if existing.slug == slug:
                if existing.content_hash != h:
                    raise SlugCollisionError(
                        f"Slug '{slug}' has conflicting content hashes "
                        f"({existing.content_hash[:16]}... vs {h[:16]}...). "
                        "Manual resolution required."
                    )
                match_idx = i
                break
            if existing.content_hash == h:
                # Same content, different slug — still considered the same
                # agent under the OR rule.
                match_idx = i
                break

        if match_idx is None:
            result.append(new_agent)
        elif updated_at > result[match_idx].updated_at:
            result[match_idx] = new_agent
        # else: existing is at least as recent; skip the new one.

    return [agent.manifest for agent in result]
