<!-- docs/v2.13/spec/grok-security-yaml.md -->
---
title: grok-security.yaml (v2.13)
description: Safety profile, permissions, approval gates, rate limits. Carried forward unchanged from v2.12.
---

# `grok-security.yaml` — v2.13

!!! note "Carried from v2.12"
    No field changes. The only difference is the v2.13 header. The tool
    catalog now lives in [`grok-tools.yaml`](grok-tools-yaml.md), and
    permissions are cross-validated against it.

Declarative security. If a tool or network host isn't listed here, the
runtime refuses to invoke it — even if the agent asks.

## Minimal (standard profile)

```yaml
version: 2.13.0
author: "@JanSol0s"
compatibility:
  - grok-install.yaml@1.0+
  - grok@2026.4+

safety_profile: standard
permissions:
  - tool:now
requires_approval: []
rate_limits:
  tool_calls_per_minute: 30
```

## Full example (strict, approval-gated)

```yaml
version: 2.13.0
author: "@JanSol0s"
compatibility:
  - grok-install.yaml@1.0+
  - grok@2026.4+

safety_profile: strict
permissions:
  - tool:fetch_mentions
  - tool:classify_mention
  - tool:draft_reply
  - tool:post_reply
  - network:api.twitter.com
requires_approval:
  - post_reply
rate_limits:
  tool_calls_per_minute: 15
  web_fetches_per_run: 20
```

## Field reference

| Field               | Type           | Required | Notes                                                             |
| ------------------- | -------------- | :------: | ----------------------------------------------------------------- |
| `safety_profile`    | enum           |    ✓     | `standard` or `strict`.                                           |
| `permissions`       | list of string |    ✓     | `<scope>:<target>`. See scopes below.                             |
| `requires_approval` | list of string |          | Tool names that pause for human confirmation.                     |
| `rate_limits`       | object         |          | Soft caps. Agent sees a rate-limit error when exceeded.           |

### Permission scopes

| Scope        | Target form                  | Example                     |
| ------------ | ---------------------------- | --------------------------- |
| `tool`       | tool name (snake_case)       | `tool:web_search`           |
| `network`    | hostname or glob pattern     | `network:api.tavily.com`, `network:*` |
| `filesystem` | absolute path or glob        | `filesystem:/tmp/cache/*`   |
| `env`        | env var name                 | `env:TAVILY_API_KEY`        |

### `rate_limits` keys

| Key                     | Type    | Typical range | Notes                                      |
| ----------------------- | ------- | ------------- | ------------------------------------------ |
| `tool_calls_per_minute` | integer | 10–60         | Hard ceiling across all tools.             |
| `web_fetches_per_run`   | integer | 10–200        | Only meaningful if `network:*` is granted. |
| `total_tokens_per_run`  | integer | 10k–500k      | Abort if LLM token budget exceeds.         |

## Safety profiles

| Profile    | What changes                                                                        |
| ---------- | ----------------------------------------------------------------------------------- |
| `standard` | Read-heavy. Side-effect tools are logged but not blocked by default.                |
| `strict`   | Every destructive or outbound action must appear in `requires_approval`. Rate limits are enforced more tightly. |

Deeper guide: [Safety profiles →](../../guides/safety-profiles.md)

## Validation notes

- Every tool in `grok-agent.yaml:tools` must appear in `permissions`.
- Every permission `tool:X` must also appear in `grok-tools.yaml:tools[].id`.
- `requires_approval` entries must also appear in `permissions`.
- `network:*` triggers a warning in the X-side pre-install scan that
  runs when a user replies `@grok install this`.

## Schema

[`grok-security.json` →](../../assets/schemas/latest/grok-security.json)
