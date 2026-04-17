# grok-install Specification — v2.13

> **Status:** Active  
> **Supersedes:** v2.12  
> **Back-compat:** v2.12 agents continue to work; see [migration guide](../../docs/migration/v2.12-to-v2.13.md)

---

## Overview

`grok-install.yaml` is the open standard that lets any developer make their AI
agent installable with one command on X using Grok. Place the file at the root
of any public GitHub repository.

v2.13 introduces full tool schemas, structured outputs, parallel tool execution,
rate limiting, cost limits, and opt-in telemetry.

---

## File Location

Must be placed at the **root** of your public GitHub repository: `grok-install.yaml`

---

## What Changed in v2.13

| Block | Status | Notes |
|---|---|---|
| `tools[].parameters` | **Required** | Full JSON Schema shape — tool name-only no longer valid |
| `structured_output` | New | Pydantic-compatible response schema |
| `parallel_tool_calls` | New | Enable concurrent tool execution |
| `tool_choice` | New | `auto`, `required`, or named tool |
| `rate_limits` | New | Per-tool QPS + daily caps |
| `cost_limits` | New | Hard USD stops per request / day / month |
| `telemetry` | New | Opt-in anonymous usage events |
| `version` | Changed | Must be `"2.13"` |

---

## Full Specification

### Top-level fields (required)

```yaml
---
version: "2.13"               # must be exactly "2.13"
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

### tools: (REQUIRED in v2.13)

Every tool the agent can call must be declared with full JSON Schema parameters
and a return type. The old name-only syntax is no longer valid.

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

### structured_output: (new in v2.13)

Enables Pydantic-compatible typed responses validated against a JSON Schema
file. The schema file must live in the repository.

```yaml
structured_output:
  enabled: true
  schema: "./schemas/ResponseModel.json"  # path relative to repo root
  strict: true                            # refuse to return if schema fails
```

---

### parallel_tool_calls: (new in v2.13)

```yaml
parallel_tool_calls: true   # default false — enable concurrent tool execution
```

---

### tool_choice: (new in v2.13)

```yaml
tool_choice: "auto"         # auto | required | {name: "specific_tool"}
```

---

### rate_limits: (new in v2.13)

Per-tool rate limiting. All values are per-instance; if the agent runs as a
swarm each node is independently limited.

```yaml
rate_limits:
  post_thread:
    qps: 0.1          # max requests per second (0.1 = 1 per 10 seconds)
    daily_cap: 20     # hard stop after N calls per UTC day
    burst: 1          # max simultaneous in-flight calls
  reply_to_mention:
    qps: 1
    daily_cap: 200
    burst: 5
```

---

### cost_limits: (new in v2.13)

Hard cost stops. When a limit is hit, the agent takes the action in `on_limit`.

```yaml
cost_limits:
  daily_usd: 5.00
  monthly_usd: 100.00
  per_request_usd: 0.10
  on_limit: "block"       # block | warn | notify_user
```

---

### telemetry: (new in v2.13)

Opt-in anonymous usage reporting. Default is `enabled: false`.

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
  provider: "xai"       # xai | openai | anthropic | ollama | custom
  model: "grok-4"
  api_key_env: "GROK_API_KEY"
```

---

### safety: (unchanged from v2.12)

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
  type: "reply-bot"     # reply-bot | dm-handler | trend-monitor | custom
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
  version: "2.13"
  message: "Powered by grok-install open standard"
```

---

## Minimal valid v2.13 file

```yaml
---
version: "2.13"
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

---

## JSON Schema

Validate any `grok-install.yaml` against:
`schemas/grok-install-v2.13.schema.json`

IDE autocomplete: add `# yaml-language-server: $schema=https://raw.githubusercontent.com/AgentMindCloud/grok-install/main/schemas/grok-install-v2.13.schema.json`
to the top of any agent YAML file.
