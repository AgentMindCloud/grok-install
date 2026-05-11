<!-- docs/v2.13/spec/grok-deploy-yaml.md -->
---
title: grok-deploy.yaml (v2.13)
description: Deployment targets, env-var resolution, resource limits, health checks, rollback rules.
---

# `grok-deploy.yaml` — v2.13

Declarative deployment. Each target has a provider, a git branch, env
resolution rules, resource caps, a health check, and optional rollback.

## Minimal example

```yaml
version: 1.0.0
author: "@JanSol0s"
compatibility:
  - grok-install.yaml@1.0+
  - grok@2026.4+

deploy:
  targets:
    production:
      provider: vercel
      branch: main
```

## Full example

```yaml
version: 1.0.0
author: "@JanSol0s"
compatibility:
  - grok-install.yaml@1.0+
  - grok@2026.4+

deploy:
  targets:
    staging:
      provider: fly
      branch: develop
      require_approval: false
      env_vars:
        - name: XAI_API_KEY
          source: secret
          secret_key: XAI_API_KEY_STAGING
          required: true
      resource_limits:
        memory_mb: 1024
        cpu_cores: 0.5
        timeout_seconds: 60
        max_instances: 3
      health_check:
        path: /health
        interval_seconds: 30
        unhealthy_threshold: 3

    production:
      provider: vercel
      branch: main
      require_approval: true
      approval_from: ["@JanSol0s"]
      env_vars:
        - name: XAI_API_KEY
          source: secret
          secret_key: XAI_API_KEY_PROD
      resource_limits:
        memory_mb: 2048
        cpu_cores: 1
        timeout_seconds: 30
        max_instances: 10
      health_check:
        path: /api/health
      rollback_on_unhealthy: true
      notify_on_failure: true
      notify_on_x: true
```

## Field reference

Top-level:

| Field     | Type   | Required | Notes                    |
| --------- | ------ | :------: | ------------------------ |
| `deploy`  | object |    ✓     | Container.               |
| `.targets`| object |    ✓     | ≥ 1 named target.        |

Per-target:

| Field                  | Type    | Required | Notes                                             |
| ---------------------- | ------- | :------: | ------------------------------------------------- |
| `provider`             | enum    |    ✓     | `vercel / aws / gcp / azure / fly / railway / render / heroku / docker / custom` |
| `branch`               | string  |    ✓     | Git branch.                                       |
| `require_approval`     | boolean |          | Default `true`.                                   |
| `approval_from`        | list    |          | X handles whose comment unblocks the deploy.      |
| `env_vars`             | list    |          | See below.                                        |
| `resource_limits`      | object  |          | `memory_mb`, `cpu_cores`, `timeout_seconds`, `max_instances`. |
| `health_check`         | object  |          | `path`, thresholds, timeouts.                     |
| `rollback_on_unhealthy`| boolean |          | Default `false`.                                  |
| `notify_on_success`    | boolean |          | Default `false`.                                  |
| `notify_on_failure`    | boolean |          | Default `true`.                                   |
| `notify_on_x`          | boolean |          | Post result as an X tweet.                        |
| `enabled`              | boolean |          | Default `true`.                                   |

### `env_vars[]`

| Field        | Type    | Required | Notes                                    |
| ------------ | ------- | :------: | ---------------------------------------- |
| `name`       | string  |    ✓     | `UPPER_SNAKE_CASE`.                      |
| `source`     | enum    |    ✓     | `secret / literal / env`.                |
| `secret_key` | string  |          | Required when `source: secret`.          |
| `value`      | string  |          | Required when `source: literal`.         |
| `required`   | boolean |          | Default `true`. Fail deploy if missing.  |

## Schema

[`grok-deploy.json` →](../../assets/schemas/latest/grok-deploy.json)
