<!-- docs/v2.13/spec/grok-ui-yaml.md -->
---
title: grok-ui.yaml (v2.13)
description: Voice commands, live dashboard with typed widgets, keyboard shortcuts, themes, and locale.
---

# `grok-ui.yaml` — v2.13

Configures the Grok IDE extension and dashboard: theme and locale,
voice commands, a live widget-based dashboard, and keyboard shortcut
bindings.

## Minimal example

```yaml
version: 1.0.0
author: "@JanSol0s"
compatibility:
  - grok-install.yaml@1.0+
  - grok@2026.4+

ui:
  theme: system
  locale: en-US
```

## Full example

```yaml
version: 1.0.0
author: "@JanSol0s"
compatibility:
  - grok-install.yaml@1.0+
  - grok@2026.4+

ui:
  theme: dark
  locale: en-US

  voice_commands:
    enabled: true
    language: en-US
    wake_phrase: hey grok
    commands:
      - phrase: "run tests"
        action: grok-test
        suite: all
      - phrase: "ship it"
        action: grok-deploy
        target: staging

  dashboard:
    enabled: true
    refresh_seconds: 30
    widgets:
      - type: agent_status
        title: Agents
      - type: test_results
        title: Last CI
        suite: all
        show_last_n: 5
      - type: security_summary
        title: Security
        alert_level: warning
      - type: analytics_pulse
        title: 24 h
        time_window_hours: 24

  shortcuts:
    keyboard:
      - key: ctrl+shift+g
        action: grok-agent
        description: Open Grok agent palette.
      - key: cmd+k
        action: grok-docs
        description: Regenerate the README.
```

## Field reference

Top-level: `ui` object.

| Field            | Type    | Required | Notes                                    |
| ---------------- | ------- | :------: | ---------------------------------------- |
| `theme`          | enum    |          | `dark / light / system / high-contrast`. Default `system`. |
| `locale`         | string  |          | BCP-47. Default `en-US`.                 |
| `voice_commands` | object  |          | See below.                               |
| `dashboard`      | object  |          | See below.                               |
| `shortcuts`      | object  |          | `keyboard` list of bindings.             |

### `voice_commands`

| Field         | Type    | Required | Notes                                  |
| ------------- | ------- | :------: | -------------------------------------- |
| `enabled`     | boolean |    ✓     | Default `false`. Triggers mic prompt.  |
| `language`    | string  |          | BCP-47. Default `en-US`.               |
| `wake_phrase` | string  |          | Default `hey grok`.                    |
| `commands`    | list    |          | `phrase`, `action`, plus optional `suite`, `target`, `scan`, `command`. |

### Dashboard widget types

`agent_status`, `test_results`, `deployment_history`, `security_summary`,
`analytics_pulse`, `custom`.

### Keyboard shortcut format

`ctrl`, `cmd`, `alt`, `shift`, or `meta` + any letter/number, chained
with `+`. Example: `ctrl+shift+g`.

## Schema

[`grok-ui.json` →](../../assets/schemas/latest/grok-ui.json)
