---
title: grok-agent.yaml
description: Declare one or more Grok agents — id, model, prompt, tools, turn limits.
---

# `grok-agent.yaml`

Defines the agents that do the work. Lives at `.grok/grok-agent.yaml`.

## Minimal example

```yaml
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
agents:
  - id: triage
    model: grok-4
    prompt_ref: triage_system
    tools:
      - fetch_mentions
      - classify_mention
    max_turns: 6

  - id: drafter
    model: grok-4
    prompt_ref: drafter_system
    tools:
      - draft_reply
    max_turns: 4

  - id: publisher
    model: grok-4
    prompt_ref: publisher_system
    tools:
      - post_reply
    max_turns: 2
```

Agents don't execute in a defined order on their own — ordering is the
job of [`grok-workflow.yaml`](grok-workflow-yaml.md).

## Field reference

Top-level key:

| Field    | Type       | Required | Notes                            |
| -------- | ---------- | :------: | -------------------------------- |
| `agents` | list       |    ✓     | Must contain at least one agent. |

Each entry in `agents`:

| Field         | Type       | Required | Default | Notes                                                        |
| ------------- | ---------- | :------: | ------- | ------------------------------------------------------------ |
| `id`          | string     |    ✓     | —       | `snake_case`. Unique within the file. Referenced by workflow steps. |
| `model`       | string     |    ✓     | —       | e.g. `grok-4`, `grok-4-mini`. Overrides the root `model`.    |
| `prompt_ref`  | string     |    ✓     | —       | Key in `grok-prompts.yaml` → `prompts:`.                     |
| `tools`       | list       |          | `[]`    | Tool names. Must appear in `grok-security.yaml` → `permissions`. |
| `max_turns`   | integer    |          | 6       | Hard upper bound on agent↔tool round-trips. 1–100.           |
| `temperature` | number     |          | model default | 0.0–2.0. Usually leave unset.                          |

## Patterns

### Single-agent

One agent, `entrypoint: .grok/grok-agent.yaml`, no workflow file needed.
The runtime invokes the first `agents[]` entry with the user input.

### Multi-step (sequential)

Multiple agents, each with a narrow job. You need a
[`grok-workflow.yaml`](grok-workflow-yaml.md) to chain them in order.

### Swarm

Multiple agents, dynamic routing (e.g. conditional loops for critique →
refine). Same structure; the workflow file carries the control flow.

## Validation notes

- `prompt_ref` is cross-validated against `grok-prompts.yaml` at
  `grok-install validate` time.
- `tools` are cross-validated against `grok-security.yaml`. Listing a
  tool here that isn't permitted there is a hard error.

Schema: [`grok-agent.schema.json`](../../assets/schemas/v2.12/grok-agent.schema.json)
