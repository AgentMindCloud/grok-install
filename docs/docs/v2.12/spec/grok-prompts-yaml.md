---
title: grok-prompts.yaml
description: The system-prompt library. One place for every prompt an agent might use.
---

# `grok-prompts.yaml`

Prompts live in one file, keyed by name. Agents reference them by
`prompt_ref` in [`grok-agent.yaml`](grok-agent-yaml.md). This separation
lets you iterate prompts without touching agent wiring, and it keeps
diffs clean when a prompt changes.

## Minimal example

```yaml
prompts:
  greeter_system: |
    You are a friendly Grok agent whose only job is to greet the user and,
    if asked, tell them the current time via the `now` tool. Keep replies
    to two sentences.
```

## Full example (three prompts for a research swarm)

```yaml
prompts:
  researcher_system: |
    You gather sources for the question. Rules:
    - Prefer primary sources (papers, docs, first-party blog posts) over
      aggregators.
    - Call `add_source` for every claim you want to carry forward, including
      URL, author, date, and a one-sentence extract.
    - Stop when you have 5-8 high-quality sources or you've done 10 searches.

  critic_system: |
    You are the skeptical peer reviewer. For each claim in the findings:
    - Try to falsify it with `challenge_claim`.
    - Score the evidence strength 0-1 with `score_evidence`.
    - Flag any claim that rests on a single source or a non-primary source
      as a weak_claim the researcher must revisit.

  publisher_system: |
    Compile a brief with: TL;DR (2 sentences), 3-5 key findings, open
    questions, sources cited inline. Never introduce claims the critic
    rejected. Never add sources that aren't in the findings list.
```

## Field reference

| Field     | Type   | Required | Notes                                                                 |
| --------- | ------ | :------: | --------------------------------------------------------------------- |
| `prompts` | object |    ✓     | Map of prompt name → prompt body. At least one entry.                 |

Each key:

| Constraint | Rule                                                               |
| ---------- | ------------------------------------------------------------------ |
| Name       | `snake_case`, starts with a letter.                                |
| Body       | String. Usually written as a YAML block scalar (`|`) for multi-line. |

## Style guidance

- Name prompts after the role they fill, not the model. `researcher_system` — not `grok4_research_v2`.
- Keep each prompt under ~300 words. Longer prompts fight the model.
- Put tool-use rules **in the prompt**, even though tools are declared
  separately — the model needs to know when to reach for each.
- Use second-person imperative ("You gather sources"), not third ("The
  agent should gather sources").

## Cross-validation

`grok-install validate` checks that every `prompt_ref` used in
`grok-agent.yaml` resolves to a key in `prompts:`. Orphaned prompts
(defined here but never referenced) produce a warning, not an error —
useful while iterating.

Schema: [`grok-prompts.schema.json`](../../assets/schemas/v2.12/grok-prompts.schema.json)
