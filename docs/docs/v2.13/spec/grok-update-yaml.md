<!-- docs/v2.13/spec/grok-update-yaml.md -->
---
title: grok-update.yaml (v2.13)
description: Scheduled smart update jobs that keep documentation, dependencies, and knowledge bases fresh.
---

# `grok-update.yaml` — v2.13

Scheduled, AI-assisted maintenance jobs. Each job has a trigger
frequency, a list of sources it refreshes, and an ordered list of
actions. By default, changes open a PR for human review —
`auto_commit: true` is opt-in and noisy.

## Minimal example

```yaml
version: 1.0.0
author: "@JanSol0s"
compatibility:
  - grok-install.yaml@1.0+
  - grok@2026.4+

updates:
  refresh-links:
    description: Weekly link rot sweep across the docs.
    sources: ["docs/**/*.md"]
    frequency: weekly
    actions: [refresh_links, notify_maintainers]
```

## Full example

```yaml
version: 1.2.0
author: "@JanSol0s"
compatibility:
  - grok-install.yaml@1.0+
  - grok@2026.4+

updates:
  refresh-links:
    description: Weekly link rot sweep.
    sources: ["docs/**/*.md", "README.md"]
    frequency: weekly
    schedule_cron: "0 9 * * 1"
    actions: [refresh_links, notify_maintainers]
    require_approval: true
    notify_on_change: true
    branch: chore/link-rot

  security-patch:
    description: Bump vulnerable dependencies.
    sources: ["package.json", "pyproject.toml", "requirements.txt"]
    frequency: daily
    actions: [security_patch, update_dependencies]
    auto_commit: false
    require_approval: true
    notify_on_change: true

  regen-readme:
    description: Re-generate README when the spec changes.
    sources: ["docs/spec/**/*.md"]
    frequency: on_commit
    actions: [regenerate_docs]
    require_approval: true
```

## Field reference

Top-level:

| Field     | Type   | Required | Notes                         |
| --------- | ------ | :------: | ----------------------------- |
| `updates` | object |    ✓     | ≥ 1 named job.                |

Per-job:

| Field               | Type    | Required | Notes                                          |
| ------------------- | ------- | :------: | ---------------------------------------------- |
| `description`       | string  |    ✓     | 5 – 500 chars.                                 |
| `sources`           | list    |    ✓     | ≥ 1 path / glob / URL.                         |
| `frequency`         | enum    |    ✓     | `hourly / daily / weekly / monthly / on_commit / on_pr / manual`. Default `weekly`. |
| `auto_commit`       | boolean |          | Default `false`. Use with caution.             |
| `require_approval`  | boolean |          | Default `true`. Takes precedence over auto-commit. |
| `actions`           | list    |          | See enum below.                                |
| `notify_on_change`  | boolean |          | Default `false`.                               |
| `branch`            | string  |          | Target branch; defaults to repo default.       |
| `schedule_cron`     | string  |          | Cron expression. Overrides `frequency`.        |
| `enabled`           | boolean |          | Default `true`.                                |

### `actions` enum

`refresh_links`, `update_stats`, `pull_latest_research`,
`update_dependencies`, `security_patch`, `regenerate_docs`,
`sync_translations`, `archive_stale`, `notify_maintainers`.

## Schema

[`grok-update.json` →](../../assets/schemas/latest/grok-update.json)
