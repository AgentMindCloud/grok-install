<!-- docs/v2.13/release-notes.md -->
---
title: v2.13 release notes
description: What shipped in grok-install v2.13 — the 12-standard expansion.
---

# v2.13 release notes

**Released:** May 2026
**Runtime:** `grok@2026.4+`
**Breaking:** yes — `grok-install.yaml` is replaced by `grok-config.yaml`.
See the [migration guide](migration-from-v2.12.md).

## TL;DR

v2.13 splits the v2.12 monolith into **12 focused YAML standards**, each
owning exactly one concern. The four files whose semantics did not change
(`grok-agent`, `grok-prompts`, `grok-security`, `grok-workflow`) carry
forward unchanged — you can copy them over byte-for-byte.

## New files

| File                   | Purpose                                                                |
| ---------------------- | ---------------------------------------------------------------------- |
| `grok-config.yaml`     | Model defaults, context injection, privacy, keyboard shortcuts.        |
| `grok-analytics.yaml`  | Event streams, KPIs, cohort rules.                                     |
| `grok-deploy.yaml`     | Targets, release gates, rollback policy.                               |
| `grok-docs.yaml`       | User-facing docs bundle (README slot, screencast, FAQ).                |
| `grok-test.yaml`       | Golden conversations, smoke tests, CI thresholds.                      |
| `grok-tools.yaml`      | Tool catalog with schemas and cost hints.                              |
| `grok-ui.yaml`         | Install-card copy, empty-state hints, tone presets.                    |
| `grok-update.yaml`     | Update channel, auto-migrate flags, deprecation schedule.              |

## Removed / replaced

- `grok-install.yaml` is **removed**. Its fields are absorbed by
  `grok-config.yaml` (model defaults, env vars, runtime) and
  `grok-deploy.yaml` (schedule, entrypoint).

## Unchanged

- `grok-agent.yaml` — same fields, same validation.
- `grok-prompts.yaml` — same fields.
- `grok-security.yaml` — same fields.
- `grok-workflow.yaml` — same fields.

## Tooling

- `grok-install validate .` now auto-detects the spec version from
  `grok-config.yaml:compatibility`. Mixed-version repos (e.g. v2.12
  `grok-install.yaml` + v2.13 `grok-docs.yaml`) are rejected.
- `grok-install migrate --from 2.12 --to 2.13` converts the monolith
  automatically. The rename from `grok-install.yaml` to `grok-config.yaml`
  is handled by the migration.

## Compatibility matrix

| Spec  | Runtime         | SDK            | CLI            |
| ----- | --------------- | -------------- | -------------- |
| v2.13 | grok@2026.4+    | grok-sdk@1.3+  | grok-install@3.0+ |

## Next

- [v2.13 → v2.14 migration](../v2.14/migration.md) — adds a `visuals:`
  block, fully additive.
