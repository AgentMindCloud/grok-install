<!-- docs/v2.13/spec/index.md -->
---
title: v2.13 spec overview
description: The 12 YAML standards of grok-install v2.13.
---

# v2.13 spec overview

v2.13 is twelve focused files. A repo has `.grok/grok-config.yaml` at
minimum; everything else lives under `.grok/` and is picked up by the
runtime on validate.

```
my-agent/
└── .grok/
    ├── grok-config.yaml       # (required) model defaults, context, privacy
    ├── grok-agent.yaml        # agent definitions
    ├── grok-analytics.yaml    # event streams, KPIs
    ├── grok-deploy.yaml       # targets, release gates, runtime, entrypoint
    ├── grok-docs.yaml         # user-facing docs bundle
    ├── grok-prompts.yaml      # named system prompts
    ├── grok-security.yaml     # safety profile, permissions, limits
    ├── grok-test.yaml         # golden conversations, CI thresholds
    ├── grok-tools.yaml        # tool catalog, schemas, cost hints
    ├── grok-ui.yaml           # install-card copy, empty-state hints
    ├── grok-update.yaml       # channel, auto-migrate, deprecation
    └── grok-workflow.yaml     # multi-agent orchestration
```

## The 12 files

### Carried from v2.12 (unchanged)

- [`grok-agent.yaml`](grok-agent-yaml.md)
- [`grok-prompts.yaml`](grok-prompts-yaml.md)
- [`grok-security.yaml`](grok-security-yaml.md)
- [`grok-workflow.yaml`](grok-workflow-yaml.md)

### New in v2.13

- [`grok-config.yaml`](grok-config-yaml.md) — the new manifest, replaces `grok-install.yaml`
- [`grok-analytics.yaml`](grok-analytics-yaml.md)
- [`grok-deploy.yaml`](grok-deploy-yaml.md)
- [`grok-docs.yaml`](grok-docs-yaml.md)
- [`grok-test.yaml`](grok-test-yaml.md)
- [`grok-tools.yaml`](grok-tools-yaml.md)
- [`grok-ui.yaml`](grok-ui-yaml.md)
- [`grok-update.yaml`](grok-update-yaml.md)

## Common header

Every v2.13 file shares a three-field header:

```yaml
version: 2.13.0
author: "@YourHandle"
compatibility:
  - grok-install.yaml@1.0+
  - grok@2026.4+
```

## JSON schemas

Schemas live at `assets/schemas/v2.13/` and are also exposed as `latest`
while v2.13 is the current release:

- [`assets/schemas/latest/` →](../../assets/schemas/latest/grok-config.json)

A CI job syncs them nightly from
[`agentmindcloud/grok-yaml-standards`](https://github.com/agentmindcloud/grok-yaml-standards).

## Validation

```bash
grok-install validate .
```

Or in the browser: [playground →](../../playground/index.md). The
playground auto-detects spec version from the file's `compatibility:`
header.
