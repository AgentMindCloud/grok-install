---
title: grok-install.yaml
description: Root manifest for an installable Grok agent. Full field reference for v2.12.
---

# `grok-install.yaml`

The root manifest. Every installable agent has exactly one at the repo root.

## Minimal example

```yaml
spec: grok-install/v2.12
name: hello-grok
description: The simplest possible Grok agent. Single agent, single tool.
entrypoint: .grok/grok-agent.yaml
model: grok-4
runtime:
  python: ">=3.11"
env:
  - XAI_API_KEY
```

This is the real content of the `hello-grok` template. Three required
fields, four optional — enough to boot.

## Full example (scheduled reply bot)

```yaml
spec: grok-install/v2.12
name: reply-engagement-bot
description: Watches X mentions and drafts thoughtful replies behind an approval gate.
entrypoint: .grok/grok-workflow.yaml
model: grok-4

runtime:
  python: ">=3.11"

env:
  - XAI_API_KEY
  - X_BEARER_TOKEN
  - X_API_KEY
  - X_API_SECRET
  - X_ACCESS_TOKEN
  - X_ACCESS_SECRET

schedule:
  interval: 5m

category: social
tags: ["reply-bot", "x", "approval-gated"]
featured: true
```

## Field reference

| Field          | Type           | Required | Default | Notes                                                                 |
| -------------- | -------------- | :------: | ------- | --------------------------------------------------------------------- |
| `spec`         | string         |    ✓     | —       | Must match `grok-install/v<MAJOR>.<MINOR>`. Pin it.                   |
| `name`         | string         |    ✓     | —       | Agent display name. kebab-case. 1–60 chars.                           |
| `description`  | string         |    ✓     | —       | 10–200 chars. Shown in the install card.                              |
| `entrypoint`   | string (path)  |          | —       | `.grok/grok-agent.yaml` or `.grok/grok-workflow.yaml`.                |
| `model`        | string         |          | —       | Default LLM for all agents. Overridable per-agent.                    |
| `runtime`      | object         |          | —       | Runtime constraints. See [below](#runtime).                           |
| `env`          | list of string |          | `[]`    | Env var names the agent reads. Runtime prompts for each on install.   |
| `schedule`     | object         |          | —       | Cron-like triggers for non-interactive agents.                        |
| `category`     | string         |          | —       | `social`, `research`, `code`, `voice`, `utility`, etc.                |
| `tags`         | list of string |          | `[]`    | Searchable keywords in the agent marketplace.                         |
| `featured`     | boolean        |          | `false` | Set by maintainers of curated galleries; not user-writable.           |

### `runtime`

| Key      | Type   | Notes                                  |
| -------- | ------ | -------------------------------------- |
| `python` | string | [PEP 440](https://peps.python.org/pep-0440/) specifier, e.g. `">=3.11"` |
| `node`   | string | semver range for Node-based agents     |

### `schedule`

| Key        | Type   | Notes                                                                  |
| ---------- | ------ | ---------------------------------------------------------------------- |
| `interval` | string | Duration literal: `30s`, `5m`, `2h`, `1d`.                             |
| `cron`     | string | Standard 5-field cron expression. Mutually exclusive with `interval`.  |

## Common mistakes

!!! failure "Quoting the spec version"
    ```yaml
    spec: grok-install/v2.12     # ✓
    spec: "grok-install/v2.12"   # ✓ (YAML strings accept either)
    spec: grok-install/2.12      # ✗ missing the `v` prefix
    ```

!!! failure "Env vars with lowercase"
    Env var names must be `UPPER_SNAKE_CASE`. The validator rejects
    `xai_api_key`.

!!! failure "Entrypoint outside `.grok/`"
    The entrypoint must live under `.grok/`. Putting it at the repo root
    pollutes the namespace that tools like `grok-agent` reserve.

## Validation

Client-side: use the [playground](../../playground/index.md).

CLI:

```bash
grok-install validate .
```

Schema: [`grok-install.schema.json`](../../assets/schemas/v2.12/grok-install.schema.json)
