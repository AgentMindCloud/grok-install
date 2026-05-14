---
title: grok-security.yaml
description: Safety profile, explicit permissions, approval gates, and rate limits enforced by the runtime.
---

# `grok-security.yaml`

Declarative security. If a tool or network host isn't listed here, the
runtime refuses to invoke it — even if the agent asks.

## Minimal (standard profile)

```yaml
safety_profile: standard
permissions:
  - tool:now
requires_approval: []
rate_limits:
  tool_calls_per_minute: 30
```

## Full example (research swarm)

```yaml
safety_profile: standard
permissions:
  - tool:web_search
  - tool:fetch_page
  - tool:add_source
  - tool:challenge_claim
  - tool:score_evidence
  - tool:compile_brief
  - network:api.tavily.com
  - network:*.arxiv.org
  - network:*          # research must browse the open web
requires_approval: []
rate_limits:
  tool_calls_per_minute: 40
  web_fetches_per_run: 60
```

## Full example (strict, approval-gated)

```yaml
safety_profile: strict
permissions:
  - tool:fetch_mentions
  - tool:classify_mention
  - tool:draft_reply
  - tool:post_reply
  - network:api.twitter.com
requires_approval:
  - post_reply        # human must confirm every outbound post
rate_limits:
  tool_calls_per_minute: 15
  web_fetches_per_run: 20
```

## Field reference

| Field               | Type           | Required | Notes                                                                                   |
| ------------------- | -------------- | :------: | --------------------------------------------------------------------------------------- |
| `safety_profile`    | enum           |    ✓     | `standard` or `strict`.                                                                 |
| `permissions`       | list of string |    ✓     | Scoped grants. Format: `<scope>:<target>`. Supported scopes below.                      |
| `requires_approval` | list of string |          | Tool names. Each invocation pauses for human confirmation before running.               |
| `rate_limits`       | object         |          | Soft caps enforced by the runtime. Agent sees a rate-limit error when exceeded.         |

### Permission scopes

| Scope        | Target form                           | Example                          |
| ------------ | ------------------------------------- | -------------------------------- |
| `tool`       | tool name (snake_case)                | `tool:web_search`                |
| `network`    | hostname or glob pattern              | `network:api.tavily.com`, `network:*.arxiv.org`, `network:*` |
| `filesystem` | absolute path or glob                 | `filesystem:/tmp/cache/*`        |
| `env`        | env var name                          | `env:TAVILY_API_KEY`             |

### `rate_limits` keys

| Key                     | Type    | Typical range | Notes                                      |
| ----------------------- | ------- | ------------- | ------------------------------------------ |
| `tool_calls_per_minute` | integer | 10–60         | Hard ceiling across all tools.             |
| `web_fetches_per_run`   | integer | 10–200        | Only meaningful if `network:*` is granted. |
| `total_tokens_per_run`  | integer | 10k–500k      | Abort the run if LLM token budget exceeds. |

## Safety profiles

| Profile    | What changes                                                                       |
| ---------- | ---------------------------------------------------------------------------------- |
| `standard` | Read-heavy research. Side-effect tools get logged but aren't blocked by default.   |
| `strict`   | Every destructive or outbound action requires an explicit entry in `requires_approval`. Rate limits are enforced more tightly. |

Read the deeper guide: [Safety profiles →](../../guides/safety-profiles.md)

## Validation notes

- A tool listed in `grok-agent.yaml` that isn't in `permissions` is a
  hard error at `grok-install validate` time.
- `network:*` is allowed but lights up a warning in the X-side
  pre-install scan that runs when a user replies `@grok install this`.
- `requires_approval` entries must also appear in `permissions` — you
  can't gate something the agent isn't allowed to touch.

Schema: [`grok-security.schema.json`](../../assets/schemas/v2.12/grok-security.schema.json)
