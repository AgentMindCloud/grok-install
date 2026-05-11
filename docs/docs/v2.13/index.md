<!-- docs/v2.13/index.md -->
---
title: v2.13 — 12-standard expansion
description: grok-install v2.13 splits the monolith into 12 focused YAML standards. Configuration, analytics, deploy, docs, test, tools, UI, and update move into their own files.
---

# grok-install v2.13

v2.13 is the first release of the **12-standard expansion**. The
monolithic `grok-install.yaml` is replaced by `grok-config.yaml`, and
seven new file types isolate concerns that previously lived in ad-hoc
places (or not at all).

!!! note "Current release"
    Looking for the live version? [**v2.14 →**](../v2.14/index.md) is
    fully v2.13-compatible and adds a `visuals:` block for install cards.
    Still on v2.12? [Migrate to v2.13 →](migration-from-v2.12.md).

## The 12 standards

<div class="grok-features" markdown>

<div class="grok-feature" markdown>
### [grok-agent.yaml →](spec/grok-agent-yaml.md)
One or more agents: id, model, prompt reference, tools, turn limits.
</div>

<div class="grok-feature" markdown>
### [grok-analytics.yaml →](spec/grok-analytics-yaml.md)
Event streams, KPIs, and cohort rules surfaced to the Grok observability panel.
</div>

<div class="grok-feature" markdown>
### [grok-config.yaml →](spec/grok-config-yaml.md)
Global Grok model settings, context injection, privacy controls, and keyboard shortcuts. Replaces the old `grok-install.yaml`.
</div>

<div class="grok-feature" markdown>
### [grok-deploy.yaml →](spec/grok-deploy-yaml.md)
Targets, environments, release gates, and rollback policy.
</div>

<div class="grok-feature" markdown>
### [grok-docs.yaml →](spec/grok-docs-yaml.md)
User-facing docs bundle: README slot, screencast URL, FAQ map.
</div>

<div class="grok-feature" markdown>
### [grok-prompts.yaml →](spec/grok-prompts-yaml.md)
System prompt library, keyed by name. Carried forward from v2.12.
</div>

<div class="grok-feature" markdown>
### [grok-security.yaml →](spec/grok-security-yaml.md)
Safety profile, permissions, approval gates, rate limits. Carried from v2.12.
</div>

<div class="grok-feature" markdown>
### [grok-test.yaml →](spec/grok-test-yaml.md)
Golden conversations, smoke tests, CI gate thresholds.
</div>

<div class="grok-feature" markdown>
### [grok-tools.yaml →](spec/grok-tools-yaml.md)
Tool catalog: schemas, side-effect class, cost hints.
</div>

<div class="grok-feature" markdown>
### [grok-ui.yaml →](spec/grok-ui-yaml.md)
Install-card copy, empty-state hints, tone presets.
</div>

<div class="grok-feature" markdown>
### [grok-update.yaml →](spec/grok-update-yaml.md)
Update channel, auto-migrate flags, deprecation schedule.
</div>

<div class="grok-feature" markdown>
### [grok-workflow.yaml →](spec/grok-workflow-yaml.md)
Multi-agent orchestration. Typed steps, conditionals. Carried from v2.12.
</div>

</div>

## What changed from v2.12

| Change   | Detail |
| -------- | ------ |
| Replaced | `grok-install.yaml` → `grok-config.yaml` |
| Added    | `grok-analytics`, `grok-deploy`, `grok-docs`, `grok-test`, `grok-tools`, `grok-ui`, `grok-update` |
| Carried  | `grok-agent`, `grok-prompts`, `grok-security`, `grok-workflow` (no field changes) |
| Runtime  | `grok@2026.4+`                                                  |

See the [release notes](release-notes.md) and
[migration from v2.12](migration-from-v2.12.md).

## Pin v2.13

At the top of every v2.13 file:

```yaml
version: 2.13.0
compatibility:
  - grok-install.yaml@1.0+
  - grok@2026.4+
  - grok-yaml-standards@1.2+
```
