<!-- docs/v2.13/spec/grok-prompts-yaml.md -->
---
title: grok-prompts.yaml (v2.13)
description: System prompt library, keyed by name. Carried forward unchanged from v2.12.
---

# `grok-prompts.yaml` — v2.13

!!! note "Carried from v2.12"
    Zero field changes. Copy your v2.12 file and add the v2.13 header.

Prompts live in one file, keyed by name. Agents reference them by
`prompt_ref` in [`grok-agent.yaml`](grok-agent-yaml.md). The separation
lets you iterate prompts without touching agent wiring and keeps diffs
clean.

## Minimal example

```yaml
version: 2.13.0
author: "@JanSol0s"
compatibility:
  - grok-install.yaml@1.0+
  - grok@2026.4+

prompts:
  greeter_system: |
    You are a friendly Grok agent whose only job is to greet the user
    and, if asked, tell them the current time via the `now` tool. Keep
    replies to two sentences.
```

## Full example (three prompts)

```yaml
version: 2.13.0
author: "@JanSol0s"
compatibility:
  - grok-install.yaml@1.0+
  - grok@2026.4+

prompts:
  researcher_system: |
    You gather sources for the question. Rules:
    - Prefer primary sources (papers, docs, first-party posts).
    - Call `add_source` for every claim you want to carry forward.
    - Stop at 5–8 high-quality sources or 10 searches.

  critic_system: |
    You are the skeptical peer reviewer. For each claim:
    - Try to falsify it with `challenge_claim`.
    - Score evidence strength 0–1 with `score_evidence`.
    - Flag single-source claims as weak.

  publisher_system: |
    Compile a brief: TL;DR (2 sentences), 3–5 key findings, open
    questions, sources cited inline. Never introduce claims the critic
    rejected.
```

## Field reference

| Field     | Type   | Required | Notes                                           |
| --------- | ------ | :------: | ----------------------------------------------- |
| `prompts` | object |    ✓     | Map of prompt name → prompt body. ≥1 entry.     |

Each key:

| Constraint | Rule                                                |
| ---------- | --------------------------------------------------- |
| Name       | `snake_case`, starts with a letter.                 |
| Body       | String; usually a `|` block scalar for multi-line. |

## Style guidance

- Name prompts after the role (`researcher_system`, not `grok4_research_v2`).
- Keep each prompt under ~300 words.
- Put tool-use rules in the prompt — the model needs to know when to reach for each.
- Use second-person imperative.

## Cross-validation

`grok-install validate` checks that every `prompt_ref` in
`grok-agent.yaml` resolves to a key here. Orphaned prompts produce a
warning (not an error).

## Schema

[`grok-prompts.json` →](../../assets/schemas/latest/grok-prompts.json)
