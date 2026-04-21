<div align="center">
  <img src="assets/hero-v2.14.svg" alt="grok-install v2.14 — dark-premium install surface" width="100%">

  <br/>

  <img src="assets/logo-dark.svg" alt="grok-install" height="80">

  <br/><br/>

  **The Universal Standard for Grok-Native Agents**

  One YAML file. One command. Your agent is live on X.

  [![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-00F0FF?style=flat-square)](LICENSE)
  [![Spec: v2.14](https://img.shields.io/badge/Spec-v2.14-7C3AED?style=flat-square)](spec/v2.14/spec.md)
  [![xAI SDK Compatible](https://img.shields.io/badge/xAI_SDK-Compatible-00FFA3?style=flat-square)](https://github.com/xai-org/xai-sdk)
  [![Grok-Native](https://img.shields.io/badge/Grok--Native-Certified-00F0FF?style=flat-square&logo=x&logoColor=white)](https://agentmindcloud.github.io/grok-install)
  [![Validate live](https://img.shields.io/badge/Validate-live-00FF9D?style=flat-square)](https://agentmindcloud.github.io/grok-install#validate)

  [**Quickstart**](#60-second-quickstart) · [**Spec v2.14**](spec/v2.14/spec.md) · [**What's new**](#whats-new-in-v214) · [**Gallery**](https://agentmindcloud.github.io/grok-install) · [**Examples**](examples/) · [**CLI**](https://github.com/agentmindcloud/grok-install-cli)
</div>

---

## 60-Second Quickstart

```bash
pip install grok-install
grok-install init my-first-agent
cd my-first-agent
grok-install run
```

Done. Your first Grok agent is live on X.

No Docker. No config files. No guesswork.

---

## Why grok-install

| | Writing xAI SDK manually | With grok-install |
|---|---|---|
| Lines of code for a reply bot | ~250 Python | 30 YAML |
| Deploy to Vercel | Manual config | `grok-install deploy --target vercel` |
| Multi-agent swarm | DIY orchestration | Built-in |
| Safety scanning | You build it | Pre-install scan included |
| Rate limiting | DIY | Declarative one-liner |
| Cost limits | DIY | Declarative hard stops |
| Install from GitHub | Clone + wire up manually | `grok-install install github.com/user/repo` |
| Tool schemas | Write JSON Schema by hand | Declared in YAML |

---

## What You Can Build

| Template | Category | Install |
|---|---|---|
| [X Reply Bot](examples/x-reply-bot.yaml) | X-native | `grok-install install agentmindcloud/x-reply-bot` |
| [Research Swarm](examples/research-swarm.yaml) | Multi-agent | `grok-install install agentmindcloud/research-swarm` |
| [Voice Agent](examples/voice-agent.yaml) | Voice | `grok-install install agentmindcloud/voice-agent` |
| [Multi-Agent Coordinator](examples/multi-agent.yaml) | Orchestration | `grok-install install agentmindcloud/multi-agent` |
| Trend-to-Thread Bot | X-native | `grok-install install agentmindcloud/trend-to-thread` |
| Discord AI Moderator | Community | `grok-install install agentmindcloud/discord-mod` |

Browse all templates → [awesome-grok-agents](https://github.com/agentmindcloud/awesome-grok-agents)

---

## The Spec at a Glance

```
grok-install.yaml
├── version: "2.13"
├── name / description / category / tags
├── llm (provider, model, api_key_env)
├── tools[] ─── NEW: full JSON Schema per tool
│   ├── name + description
│   ├── parameters (JSON Schema object)
│   └── returns (JSON Schema object)
├── rate_limits ─── NEW: per-tool QPS + daily caps
├── cost_limits ─── NEW: hard USD stops
├── structured_output ─── NEW: Pydantic-compatible
├── parallel_tool_calls ─── NEW
├── x_native_runtime (type, permissions)
├── intelligence_layer (function_calling, swarm, ...)
├── orchestration (role, triggers, safety)
├── safety (pre_install_scan, minimum_keys_only, ...)
├── deployment (railway, vercel, docker)
├── telemetry ─── NEW: opt-in anonymous events
└── promotion (auto_welcome, auto_share, ...)
```

Full spec: [spec/v2.14/spec.md](spec/v2.14/spec.md) (v2.13 still at [spec/v2.13/spec.md](spec/v2.13/spec.md))

**Validate your YAML live → [agentmindcloud.github.io/grok-install#validate](https://agentmindcloud.github.io/grok-install#validate)**

---

## Minimal Example

```yaml
---
version: "2.13"
name: "My Reply Bot"
description: "Replies to X mentions using Grok"

llm:
  provider: "xai"
  model: "grok-4"
  api_key_env: "GROK_API_KEY"

tools:
  - name: "reply_to_mention"
    description: "Replies to a specific X mention"
    parameters:
      type: "object"
      properties:
        mention_id: {type: "string"}
        reply_text: {type: "string", maxLength: 280}
      required: ["mention_id", "reply_text"]
    returns:
      type: "object"
      properties:
        reply_url: {type: "string"}

rate_limits:
  reply_to_mention:
    qps: 0.5
    daily_cap: 200

cost_limits:
  daily_usd: 3.00
  on_limit: "block"

safety:
  pre_install_scan: true
  minimum_keys_only: true
```

---

## Ecosystem

| Repo | Purpose |
|---|---|
| [`grok-install`](https://github.com/agentmindcloud/grok-install) | This repo — spec, schema, landing page |
| [`grok-install-cli`](https://github.com/agentmindcloud/grok-install-cli) | Official Python CLI and runtime |
| [`awesome-grok-agents`](https://github.com/agentmindcloud/awesome-grok-agents) | 10+ production-ready agent templates |
| [`grok-yaml-standards`](https://github.com/agentmindcloud/grok-yaml-standards) | Modular YAML extensions (.grok/ folder) |
| [`grok-docs`](https://github.com/agentmindcloud/grok-docs) | Full documentation site |

Works with: **xAI SDK** (native) · LiteLLM · Semantic Kernel · OpenAI-compatible clients

---

## Safety First

Every agent installed via grok-install runs an automated pre-install scan:

- No hardcoded API keys
- X-posting tools behind approval gates (configurable)
- Rate limits declared — no runaway posting
- Permissions explicit and minimal
- Blocked patterns: deepfakes, mass DMs, spam

Only green-scan agents earn the **Grok-Native Certified** badge.

---

## What's new in v2.14

v2.14 is **additive** — zero breaking changes. It introduces the optional
`visuals` block: a declarative way to ship a branded, dark-premium install
surface without custom design work.

| Field | What it does |
|---|---|
| `visuals.accent_color` | Hex color for strokes, focus rings, CTA fills |
| `visuals.preview_card.style` | `futuristic`, `premium`, or `minimal` |
| `visuals.install_flow` | Animated step track for the install modal |
| `visuals.demo_media` | Attach a demo asset or auto-generate one |
| `visuals.post_install.mini_dashboard` | Animated status widget, haptics, a11y |
| `visuals.theme.auto_adapt` | Auto light/dark swap on the gallery |
| `visuals.accessibility.alt_text_template` | Alt text for every rendered surface |

- Full reference: [`docs/v2.14/visuals.md`](docs/v2.14/visuals.md)
- Flagship example: [`examples/janvisuals/grok-install.yaml`](examples/janvisuals/grok-install.yaml)
- Migration notes: [`docs/migration/v2.13-to-v2.14.md`](docs/migration/v2.13-to-v2.14.md)

---

## Migrating from v2.12 / v2.13

- **v2.13 → v2.14** is additive, no migration required. See the
  [v2.13 → v2.14 guide](docs/migration/v2.13-to-v2.14.md).
- **v2.12 → v2.13** has one breaking change (tool declarations require full
  JSON Schema). See the [v2.12 → v2.13 guide](docs/migration/v2.12-to-v2.13.md) or run:

```bash
grok-install migrate --from 2.12 --to 2.13
grok-install migrate --from 2.13 --to 2.14
```

---

## Community & Calls to Action

- [**Submit your agent**](https://github.com/AgentMindCloud/grok-install/issues/new?template=agent-submission.yml) to the featured gallery.
- [**Join the weekly spec review**](https://github.com/AgentMindCloud/grok-install/discussions) in GitHub Discussions.
- [**Validate your YAML live**](https://agentmindcloud.github.io/grok-install#validate) in the browser.
- [**Sponsor the project**](https://github.com/sponsors/JanSol0s) to fund the open standard.

---

## Contributing

RFCs for v2.14 are open. Propose a spec change, ship a template, fix a bug.
See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

Apache 2.0 — same as xAI. Patent grant included.

---

<div align="center">
  Built by <a href="https://x.com/JanSol0s">@JanSol0s</a> · Part of <a href="https://github.com/AgentMindCloud">AgentMindCloud</a>
</div>
