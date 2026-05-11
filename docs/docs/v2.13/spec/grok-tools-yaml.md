<!-- docs/v2.13/spec/grok-tools-yaml.md -->
---
title: grok-tools.yaml (v2.13)
description: Dedicated tools registry with typed signatures, permission declarations, and rate limits.
---

# `grok-tools.yaml` — v2.13

The typed tool registry. Every tool referenced by
[`grok-agent.yaml`](grok-agent-yaml.md) or
[`grok-workflow.yaml`](grok-workflow-yaml.md) must be declared here with
a signature, a category, required permissions, and optional rate limits.

## Minimal example

```yaml
version: 1.0.0
author: "@JanSol0s"
compatibility:
  - grok-install.yaml@1.0+
  - grok@2026.4+

tools:
  now:
    description: Return the current UTC timestamp.
    category: data
    outputs:
      iso_timestamp:
        type: string
        format: date-time
        description: ISO-8601 UTC timestamp.
```

## Full example

```yaml
version: 1.0.0
author: "@JanSol0s"
compatibility:
  - grok-install.yaml@1.0+
  - grok@2026.4+

tools:
  fetch_page:
    description: Fetch a public URL and return its text content.
    category: web
    inputs:
      url:
        type: string
        format: uri
        required: true
        description: Absolute URL.
      max_bytes:
        type: integer
        required: false
        default: 500000
        minimum: 1024
        maximum: 5000000
    outputs:
      status:
        type: integer
        description: HTTP status code.
      body:
        type: string
        description: Response body (truncated at max_bytes).
    permissions: [network, read]
    rate_limit:
      requests_per_minute: 30
      requests_per_day: 2000

  post_reply:
    description: Publish a reply to an X thread.
    category: social
    inputs:
      tweet_id:
        type: string
        required: true
        pattern: "^[0-9]{10,20}$"
      text:
        type: string
        required: true
        maxLength: 280
    permissions: [network, publish]
    requires_auth: true
    auth_provider: x_oauth2
    rate_limit:
      requests_per_minute: 5
      requests_per_day: 500
```

## Field reference

Top-level:

| Field   | Type   | Required | Notes                           |
| ------- | ------ | :------: | ------------------------------- |
| `tools` | object |    ✓     | ≥ 1 named tool.                 |

Per-tool:

| Field           | Type    | Required | Notes                                                 |
| --------------- | ------- | :------: | ----------------------------------------------------- |
| `description`   | string  |    ✓     | 10 – 300 chars.                                       |
| `category`      | enum    |    ✓     | `file_system / code / web / social / ai / data / notification / deployment / testing` |
| `inputs`        | object  |          | Parameter schemas (JSON Schema-style).                |
| `outputs`       | object  |          | Return-value schemas.                                 |
| `permissions`   | list    |          | `read / write / execute / network / publish / deploy / admin` |
| `requires_auth` | boolean |          | Default `false`.                                      |
| `auth_provider` | enum    |          | `github / x_oauth2 / google / slack / stripe / aws / gcp / azure / custom` |
| `rate_limit`    | object  |          | `requests_per_minute`, `requests_per_day`.            |
| `enabled`       | boolean |          | Default `true`.                                       |

### Parameter schema

Each entry in `inputs` or `outputs`:

`type`, `description`, `required`, `default`, `enum`, `format`,
`minimum`, `maximum`, `minLength`, `maxLength`, `pattern`, `items`.

## Cross-validation

- Every `tool:X` permission in `grok-security.yaml` must appear here.
- Every tool referenced in `grok-agent.yaml:tools` must appear here.

## Schema

[`grok-tools.json` →](../../assets/schemas/latest/grok-tools.json)
