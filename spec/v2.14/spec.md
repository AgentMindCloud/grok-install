# grok-install Specification — v2.14

> **Status:** Active
> **Supersedes:** v2.13
> **Back-compat:** v2.13 agents continue to work unchanged; see [migration guide](../../docs/migration/v2.13-to-v2.14.md)

---

## Overview

`grok-install.yaml` is the open standard that lets any developer make their AI
agent installable with one command on X using Grok. Place the file at the root
of any public GitHub repository.

v2.14 adds the optional **Visuals** layer — a declarative way to describe the
preview card, install flow, demo media, and post-install mini-dashboard so that
every grok-install-native agent ships a premium, dark-mode-first install
experience without custom design work. No field is required; every v2.13 file
is a valid v2.14 file.

---

## File Location

Must be placed at the **root** of your public GitHub repository: `grok-install.yaml`

---

## What Changed in v2.14

| Block | Status | Notes |
|---|---|---|
| `visuals` | New (optional) | Preview card, install flow, demo media, dashboard, theme, a11y |
| `visuals.accent_color` | New | Hex color powering accent strokes and button fills |
| `visuals.preview_card` | New | `style`: futuristic, premium, or minimal |
| `visuals.install_flow` | New | Declarative step animation for the install modal |
| `visuals.demo_media` | New | Attach or auto-generate a short demo for the gallery card |
| `visuals.post_install.mini_dashboard` | New | Animated status widget shown after install |
| `visuals.theme.auto_adapt` | New | Auto light/dark-mode swap on the gallery page |
| `visuals.accessibility.alt_text_template` | New | Alt text template for every rendered surface |
| `version` | Accepts | `"2.13"` or `"2.14"` — no breaking change |

Every v2.13 block (`tools`, `structured_output`, `parallel_tool_calls`,
`tool_choice`, `rate_limits`, `cost_limits`, `telemetry`, `llm`, `safety`,
`x_native_runtime`, `intelligence_layer`, `orchestration`, `deployment`,
`on_install`, `promotion`, `credits`) is carried forward unchanged.

---

## Full Specification

### Top-level fields (required)

```yaml
---
version: "2.14"               # "2.13" also remains valid in v2.14 tooling
name: "My Agent"              # human-readable name, max 80 chars
description: "What it does"   # one sentence, max 200 chars
```

### Top-level fields (optional)

```yaml
repository: "https://github.com/you/my-agent"
category: "x-native"          # x-native | telegram | discord | research | voice | custom
tags: ["reply-bot", "beginner"]
featured: false
ecosystem: ["grok", "x"]
update_strategy: "semver"     # semver | always
```

---

### tools: (REQUIRED — unchanged from v2.13)

Every tool the agent can call must be declared with full JSON Schema parameters
and a return type.

```yaml
tools:
  - name: "post_thread"
    description: "Posts a thread to X after explicit user approval"
    parameters:
      type: "object"
      properties:
        tweets:
          type: "array"
          items: {type: "string", maxLength: 280}
          minItems: 1
          maxItems: 25
        require_approval:
          type: "boolean"
          default: true
      required: ["tweets"]
    returns:
      type: "object"
      properties:
        thread_url: {type: "string"}
        posted_at: {type: "string", format: "date-time"}

  - name: "reply_to_mention"
    description: "Replies to a specific mention after reading context"
    parameters:
      type: "object"
      properties:
        mention_id: {type: "string"}
        reply_text: {type: "string", maxLength: 280}
        require_approval: {type: "boolean", default: false}
      required: ["mention_id", "reply_text"]
    returns:
      type: "object"
      properties:
        reply_url: {type: "string"}
        posted_at: {type: "string", format: "date-time"}
```

---

### structured_output: (unchanged from v2.13)

```yaml
structured_output:
  enabled: true
  schema: "./schemas/ResponseModel.json"
  strict: true
```

---

### parallel_tool_calls: (unchanged from v2.13)

```yaml
parallel_tool_calls: true
```

---

### tool_choice: (unchanged from v2.13)

```yaml
tool_choice: "auto"
```

---

### rate_limits: (unchanged from v2.13)

```yaml
rate_limits:
  post_thread:
    qps: 0.1
    daily_cap: 20
    burst: 1
  reply_to_mention:
    qps: 1
    daily_cap: 200
    burst: 5
```

---

### cost_limits: (unchanged from v2.13)

```yaml
cost_limits:
  daily_usd: 5.00
  monthly_usd: 100.00
  per_request_usd: 0.10
  on_limit: "block"
```

---

### telemetry: (unchanged from v2.13)

```yaml
telemetry:
  enabled: true
  anonymous: true
  endpoint: "https://telemetry.grokyaml.dev/v1/events"
  events: ["install", "run", "tool_call", "error"]
```

---

### llm:

```yaml
llm:
  provider: "xai"
  model: "grok-4"
  api_key_env: "GROK_API_KEY"
```

---

### safety: (unchanged from v2.13)

```yaml
safety:
  pre_install_scan: true
  verified_by_grok: true
  scan_summary_visible: true
  minimum_keys_only: true
```

---

### x_native_runtime:

```yaml
x_native_runtime:
  type: "reply-bot"
  permissions: ["tweet.read", "tweet.write", "dm.read"]
  grok_orchestrator: true
  one_click_x_deploy: true
```

---

### intelligence_layer:

```yaml
intelligence_layer:
  function_calling: true
  real_time_tools: true
  multi_agent_swarm: true
  grok_coordinates: true
  ai_suggested_teams: true
```

---

### orchestration:

```yaml
orchestration:
  enabled: true
  role: "publisher"
  can_trigger: ["researcher"]
  can_be_triggered_by: ["critic"]
  visual_builder: true
  ai_suggested_patterns: true
  triggers:
    - event: "mention"
      action: "reply"
      target_agents: []
  safety:
    permission_check: true
    approval_required: true
    verified_orchestration: true
```

---

### deployment:

```yaml
deployment:
  preferred: ["railway", "vercel", "docker"]
  targets:
    - railway
    - vercel
    - docker
```

---

### on_install:

```yaml
on_install:
  welcome: "{{name}} is now live. Type /help for commands."
  suggested_commands:
    - "/status"
    - "/help"
```

---

### promotion:

```yaml
promotion:
  auto_welcome: true
  auto_share: true
  weekly_highlight: true
  featured: false
  builder_credits: "@you"
  support_link: "https://github.com/sponsors/you"
```

---

### credits: (recommended)

```yaml
credits:
  standard: "grok-install"
  author: "@you"
  url: "https://github.com/AgentMindCloud/grok-install"
  version: "2.14"
  message: "Powered by grok-install open standard"
```

---

## Visuals (new in v2.14)

The `visuals` block is entirely optional. Supplying it opts an agent into the
v2.14 dark-premium install surface: a branded preview card on the gallery, an
animated install flow, an attached demo, and a mini post-install dashboard.
Omitting any sub-field falls back to the default futuristic theme.

### Top-level visuals block

```yaml
visuals:
  accent_color: "#00F0FF"            # hex (3- or 6-digit) — powers strokes and button fills
  preview_card:
    style: "futuristic"              # futuristic | premium | minimal
    panel_count: 4                   # integer, 3–8 inclusive
  install_flow:
    steps:
      - "Scan safety"
      - "Request keys"
      - "Deploy"
      - "Live"
    animation_speed: "normal"        # slow | normal | fast
  demo_media:
    type: "video"                    # image | video | gif | lottie
    url: "https://cdn.example.com/demo.mp4"
    auto_generate: false             # if true, url is optional
  post_install:
    mini_dashboard:
      animations: true
      haptics: true
      accessibility:
        reduce_motion_respect: true
        high_contrast: false
  theme:
    auto_adapt: true                 # swap light/dark with the gallery page
  accessibility:
    alt_text_template: "{{name}} — {{description}}"
```

### visuals.accent_color

A 3- or 6-digit hex color. Used for card borders, focus rings, CTA fills, and
dashboard spark-lines. Aim for WCAG AA contrast against a `#0A0A0A` background
(e.g. `#00F0FF`, `#00FF9D`, `#7C3AED` all pass).

### visuals.preview_card

| Field | Type | Notes |
|---|---|---|
| `style` | enum | `futuristic` (glass + neon), `premium` (mono + serif), `minimal` (flat + monochrome) |
| `panel_count` | integer 3–8 | How many stat panels render on the gallery card |

### visuals.install_flow

Describes the animated step track of the install modal. `steps` is an ordered
array of short labels (≤ 24 chars each). `animation_speed` controls the stagger
between steps.

### visuals.demo_media

Either provide a `url` to an existing asset **or** set `auto_generate: true`
and the gallery will synthesise a short demo from your preview card. The
schema requires at least one of the two.

### visuals.post_install.mini_dashboard

A compact widget shown immediately after install: tool-call counter, cost
remaining, and a status pulse. `animations` toggles motion, `haptics` enables
tactile feedback on supported mobile surfaces. The nested `accessibility`
object lets agents declare reduce-motion and high-contrast behaviour.

### visuals.theme.auto_adapt

When `true`, the gallery card follows the viewer's light/dark preference.
When omitted or `false`, the card stays in the dark-premium default.

### visuals.accessibility.alt_text_template

A Mustache-style template string used as alt text for every rendered surface
(card, demo media, dashboard screenshot). Common variables: `{{name}}`,
`{{description}}`, `{{category}}`.

---

## Minimal valid v2.14 file

```yaml
---
version: "2.14"
name: "My Agent"
description: "Does something useful on X"
llm:
  provider: "xai"
  model: "grok-4"
  api_key_env: "GROK_API_KEY"
tools:
  - name: "do_thing"
    description: "Does the thing"
    parameters:
      type: "object"
      properties:
        input: {type: "string"}
      required: ["input"]
    returns:
      type: "object"
      properties:
        result: {type: "string"}
```

## Minimal v2.14 file using visuals

```yaml
---
version: "2.14"
name: "My Agent"
description: "Does something useful on X"
llm:
  provider: "xai"
  model: "grok-4"
  api_key_env: "GROK_API_KEY"
tools:
  - name: "do_thing"
    description: "Does the thing"
    parameters:
      type: "object"
      properties:
        input: {type: "string"}
      required: ["input"]
    returns:
      type: "object"
      properties:
        result: {type: "string"}
visuals:
  accent_color: "#00F0FF"
  preview_card:
    style: "futuristic"
  demo_media:
    auto_generate: true
```

---

## JSON Schema

Validate any `grok-install.yaml` against:
`schemas/v2.14/schema.json`

IDE autocomplete: add

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/AgentMindCloud/grok-install/main/schemas/v2.14/schema.json
```

to the top of any agent YAML file. The v2.13 schema remains available at
`schemas/grok-install-v2.13.schema.json` for existing agents.
