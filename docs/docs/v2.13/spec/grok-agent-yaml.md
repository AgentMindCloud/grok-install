<!-- docs/v2.13/spec/grok-agent-yaml.md -->
---
title: grok-agent.yaml (v2.13)
description: Declare one or more Grok agents — id, model, prompt, tools, turn limits. Carried forward from v2.12.
---

# `grok-agent.yaml` — v2.13

!!! note "Carried from v2.12"
    No field changes. If you have a working v2.12 `grok-agent.yaml`, copy
    it over and add the v2.13 header.

Defines the agents that do the work. Lives at `.grok/grok-agent.yaml`.

## Minimal example

```yaml
version: 2.13.0
author: "@JanSol0s"
compatibility:
  - grok-install.yaml@1.0+
  - grok@2026.4+

agents:
  - id: greeter
    model: grok-4
    prompt_ref: greeter_system
    tools:
      - now
    max_turns: 4
```

## Full example (three-agent pipeline)

```yaml
version: 2.13.0
author: "@JanSol0s"
compatibility:
  - grok-install.yaml@1.0+
  - grok@2026.4+

agents:
  - id: triage
    model: grok-4
    prompt_ref: triage_system
    tools: [fetch_mentions, classify_mention]
    max_turns: 6

  - id: drafter
    model: grok-4
    prompt_ref: drafter_system
    tools: [draft_reply]
    max_turns: 4

  - id: publisher
    model: grok-4
    prompt_ref: publisher_system
    tools: [post_reply]
    max_turns: 2
```

Agents don't execute in a defined order on their own — that is the job
of [`grok-workflow.yaml`](grok-workflow-yaml.md).

## Field reference

| Field    | Type | Required | Notes                             |
| -------- | ---- | :------: | --------------------------------- |
| `agents` | list |    ✓     | Must contain at least one agent.  |

Each entry:

| Field         | Type    | Required | Default | Notes                                                               |
| ------------- | ------- | :------: | ------- | ------------------------------------------------------------------- |
| `id`          | string  |    ✓     | —       | `snake_case`. Unique within the file. Referenced by workflow steps. |
| `model`       | string  |    ✓     | —       | e.g. `grok-4`. Overrides `grok-config.yaml:grok.default_model`.     |
| `prompt_ref`  | string  |    ✓     | —       | Key in `grok-prompts.yaml:prompts`.                                 |
| `tools`       | list    |          | `[]`    | Tool names. Must appear in both `grok-tools.yaml` and `grok-security.yaml:permissions`. |
| `max_turns`   | integer |          | 6       | 1–100.                                                              |
| `temperature` | number  |          | default | 0.0–2.0.                                                            |

## Cross-validation

- `prompt_ref` resolves against `grok-prompts.yaml`.
- `tools` are checked against **both** the new `grok-tools.yaml` catalog
  and `grok-security.yaml:permissions`.

## Schema

[`grok-agent.json` →](../../assets/schemas/latest/grok-agent.json)
