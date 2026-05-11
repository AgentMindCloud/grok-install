<!-- docs/v2.13/spec/grok-config-yaml.md -->
---
title: grok-config.yaml (v2.13)
description: Global Grok model settings, context injection, privacy controls, and keyboard shortcuts. Replaces the old grok-install.yaml.
---

# `grok-config.yaml` — v2.13

The new root manifest. Centralises Grok model defaults, the context that
is injected into every conversation, privacy policy, and `@grok`
keyword shortcuts. Replaces `grok-install.yaml` from v2.12.

## Minimal example

```yaml
version: 2.13.0
author: "@JanSol0s"
compatibility:
  - grok-install.yaml@1.0+
  - grok@2026.4+

grok:
  default_model: grok-4
```

## Full example

```yaml
version: 2.13.0
author: "@JanSol0s"
compatibility:
  - grok-install.yaml@1.0+
  - grok@2026.4+
  - grok-yaml-standards@1.2+

grok:
  default_model: grok-4
  temperature: 0.7
  max_tokens: 16384
  response_language: en
  personality: helpful-maximalist
  reasoning_depth: high
  stream_responses: true
  fallback_model: grok-3-fast

context:
  company: AgentMindCloud
  audience: X power users & developers
  tone: clear, witty, actionable
  key_constraints:
    - Never fabricate citations.
    - Always surface the tool used to answer.
  domain_knowledge:
    - docs/SPEC.md
    - https://github.com/AgentMindCloud/grok-docs/blob/main/README.md

privacy:
  allow_telemetry: false
  share_anonymous_usage: false
  never_share: [api_keys, secrets, tokens, env_vars, credentials]
  data_retention_days: 30

shortcuts:
  fix: "Rewrite the highlighted code to fix the error in the terminal."
  explain: "Explain this function at the level of a mid-level engineer."
```

## Field reference

| Field           | Type   | Required | Notes                                                    |
| --------------- | ------ | :------: | -------------------------------------------------------- |
| `version`       | string |    ✓     | SemVer. `2.13.0` or newer.                               |
| `author`        | string |    ✓     | X handle, `^@[A-Za-z0-9_]{1,50}$`.                       |
| `compatibility` | list   |    ✓     | At least one `spec@version+` entry.                      |
| `grok`          | object |          | Model defaults applied to every interaction.             |
| `context`       | object |          | Static context prepended to every Grok conversation.     |
| `privacy`       | object |          | Data-handling, retention, telemetry. Defaults strict.    |
| `shortcuts`     | object |          | `@grok <keyword>` → expansion prompt map.                |

### `grok`

| Key                 | Type    | Default             | Notes                                  |
| ------------------- | ------- | ------------------- | -------------------------------------- |
| `default_model`     | enum    | `grok-4`            | `grok-4/3/3-mini/3-fast/2/1`           |
| `temperature`       | number  | `0.7`               | 0 – 2                                  |
| `max_tokens`        | integer | `16384`             | 1 – 131072                             |
| `response_language` | string  | `en`                | BCP-47                                 |
| `personality`       | enum    | `helpful-maximalist`| See schema for the 7 presets           |
| `reasoning_depth`   | enum    | `high`              | `low / medium / high / ultra`          |
| `stream_responses`  | boolean | `true`              |                                        |
| `fallback_model`    | enum    | —                   | Used when primary is unavailable       |

### `privacy.never_share` (enum)

`api_keys`, `secrets`, `personal_data`, `passwords`, `tokens`, `env_vars`,
`credentials`, `private_keys`.

## Schema

[`grok-config.json` →](../../assets/schemas/latest/grok-config.json)
