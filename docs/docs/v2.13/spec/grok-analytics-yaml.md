<!-- docs/v2.13/spec/grok-analytics-yaml.md -->
---
title: grok-analytics.yaml (v2.13)
description: Opt-in telemetry with fine-grained event control, PII safety declarations, provider abstraction, and GDPR-friendly retention.
---

# `grok-analytics.yaml` — v2.13

Declarative, opt-in analytics. No data is collected unless
`analytics.enabled: true` is explicitly set. Every tracked event must
declare a `pii_safe` flag.

## Minimal example

```yaml
version: 1.0.0
author: "@JanSol0s"
compatibility:
  - grok-install.yaml@1.0+
  - grok@2026.4+

analytics:
  enabled: false
  provider: posthog
```

## Full example

```yaml
version: 1.0.0
author: "@JanSol0s"
compatibility:
  - grok-install.yaml@1.0+
  - grok@2026.4+

analytics:
  enabled: true
  provider: posthog
  provider_config:
    api_key_secret: POSTHOG_API_KEY
    host: https://eu.posthog.com
    project_id: "123456"
  sampling_rate: 0.5
  anonymize_user_ids: true
  data_retention_days: 90
  opt_out_roles: [bot, ci]
  events:
    - name: agent_installed
      description: Fires when a user completes the install-with-grok flow.
      properties: [source, agent_id]
      pii_safe: true
    - name: tool_invoked
      description: Per-tool invocation audit event.
      properties: [tool_id, agent_id, latency_ms]
      pii_safe: true
```

## Field reference

| Field           | Type    | Required | Notes                                                     |
| --------------- | ------- | :------: | --------------------------------------------------------- |
| `analytics`     | object  |    ✓     | Container.                                                |
| `.enabled`      | boolean |    ✓     | Master switch. Defaults `false`.                          |
| `.provider`     | enum    |    ✓     | `posthog / mixpanel / amplitude / segment / datadog / custom` |
| `.provider_config` | object |         | Never put raw keys here — use `*_secret` fields.          |
| `.events`       | list    |          | Opt-in event list. Unlisted events are dropped.           |
| `.sampling_rate`| number  |          | 0 – 1. Default `1.0`.                                     |
| `.anonymize_user_ids` | boolean |   | Default `true`.                                           |
| `.data_retention_days` | integer | | 1 – 730. Default `90`.                                    |
| `.opt_out_roles`| list    |          | `bot` and CI accounts should always appear.               |

### Event object

| Field         | Type    | Required | Notes                                                  |
| ------------- | ------- | :------: | ------------------------------------------------------ |
| `name`        | string  |    ✓     | `snake_case`, 3 – 100 chars.                           |
| `description` | string  |          | ≤ 500 chars.                                           |
| `properties`  | list    |          | Only listed properties are captured.                   |
| `pii_safe`    | boolean |    ✓     | `false` triggers a security review gate before enable. |
| `enabled`     | boolean |          | Default `true`.                                        |

## Schema

[`grok-analytics.json` →](../../assets/schemas/latest/grok-analytics.json)
