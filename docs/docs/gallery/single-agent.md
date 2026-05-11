---
title: Single-agent templates
description: One agent, one job — the simplest installable shape.
---

# Single-agent templates

One `grok-agent.yaml` with a single entry. No workflow file needed.
Best starting point for a new idea.

## hello-grok

> The simplest possible Grok agent. Single agent, single tool.

**Pattern:** single-agent · **Profile:** standard

```yaml
spec: grok-install/v2.12
name: hello-grok
description: The simplest possible Grok agent. Single agent, single tool.
entrypoint: .grok/grok-agent.yaml
model: grok-4
runtime:
  python: ">=3.11"
env:
  - XAI_API_KEY
```

A greeter with access to a `now` tool. 40-line footprint end to end.
Recommended first template to read.

[View on GitHub →](https://github.com/AgentMindCloud/awesome-grok-agents/tree/main/templates/hello-grok){ .grok-btn .grok-btn--ghost }

## When to pick single-agent

- Prototyping a new capability.
- The behavior fits in one coherent system prompt.
- You don't need conditional routing between steps.
- You want zero orchestration overhead.

When you outgrow it, split into [multi-step](multi-step.md) — no
rewrite needed, just add a `grok-workflow.yaml`.
