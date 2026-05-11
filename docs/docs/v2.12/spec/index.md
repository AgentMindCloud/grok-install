---
title: Spec overview
description: The grok-install YAML specification — five file types, one standard, v2.12.
---

# Spec overview

The `grok-install` standard is five YAML files working together. A repo only
needs `grok-install.yaml` at the root; everything else lives under `.grok/`.

```
my-agent/
├── grok-install.yaml          # (required) root manifest
└── .grok/
    ├── grok-agent.yaml        # agent definitions
    ├── grok-workflow.yaml     # (optional) multi-agent orchestration
    ├── grok-prompts.yaml      # named system prompts
    └── grok-security.yaml     # safety profile, permissions, limits
```

## The five files

<div class="grok-features" markdown>

<div class="grok-feature" markdown>
### [grok-install.yaml →](grok-install-yaml.md)
The one required file. Declares the spec version, name, entrypoint,
runtime, and environment variables.
</div>

<div class="grok-feature" markdown>
### [grok-agent.yaml →](grok-agent-yaml.md)
Defines one or more agents: id, model, prompt reference, available
tools, turn limits.
</div>

<div class="grok-feature" markdown>
### [grok-workflow.yaml →](grok-workflow-yaml.md)
For swarms. A sequence of typed steps that chain agents together with
inputs, outputs, and conditions.
</div>

<div class="grok-feature" markdown>
### [grok-prompts.yaml →](grok-prompts-yaml.md)
System prompts lookup table. Agents reference prompts by key via
`prompt_ref`.
</div>

<div class="grok-feature" markdown>
### [grok-security.yaml →](grok-security-yaml.md)
Safety profile, explicit permissions, approval gates, and rate limits
enforced by the runtime.
</div>

</div>

## Version matrix

| Spec version | Released    | Notable changes                              |
| ------------ | ----------- | -------------------------------------------- |
| **v2.12**    | Apr 2026    | Passive Growth Engine, voice controls        |
| v2.10        | Mar 2026    | Verified-by-Grok badge, minimum-keys-only    |
| v2.4         | Feb 2026    | Orchestration + triggers                     |
| v2.0         | Jan 2026    | Multi-LLM providers                          |
| v1.0         | Dec 2025    | Initial standard                             |

!!! tip "Pin your spec version"
    Declare it explicitly at the top of `grok-install.yaml`:
    ```yaml
    spec: grok-install/v2.12
    ```
    This locks the validator and runtime behavior, so upstream changes
    can't silently break your agent.

## JSON schemas

Every file has a published JSON Schema for editor integration and the
[live playground](../../playground/index.md):

- [`grok-install.schema.json`](../../assets/schemas/v2.12/grok-install.schema.json)
- [`grok-agent.schema.json`](../../assets/schemas/v2.12/grok-agent.schema.json)
- [`grok-workflow.schema.json`](../../assets/schemas/v2.12/grok-workflow.schema.json)
- [`grok-security.schema.json`](../../assets/schemas/v2.12/grok-security.schema.json)
- [`grok-prompts.schema.json`](../../assets/schemas/v2.12/grok-prompts.schema.json)

Versioned copies live at `assets/schemas/v<VERSION>/`. A CI job syncs them
nightly from [`agentmindcloud/grok-yaml-standards`](https://github.com/agentmindcloud/grok-yaml-standards).
