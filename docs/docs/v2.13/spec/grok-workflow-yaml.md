<!-- docs/v2.13/spec/grok-workflow-yaml.md -->
---
title: grok-workflow.yaml (v2.13)
description: Chain agents into multi-step workflows with typed I/O and conditionals. Carried forward unchanged from v2.12.
---

# `grok-workflow.yaml` — v2.13

!!! note "Carried from v2.12"
    No field changes. Entrypoint into the runtime is now set in
    [`grok-deploy.yaml`](grok-deploy-yaml.md) instead of the old
    `grok-install.yaml`.

Orchestration for multi-step and swarm agents. Lives at
`.grok/grok-workflow.yaml`. Set
`entrypoint: .grok/grok-workflow.yaml` in `grok-deploy.yaml` to activate it.

## Example: researcher → critic → publisher swarm

```yaml
version: 2.13.0
author: "@JanSol0s"
compatibility:
  - grok-install.yaml@1.0+
  - grok@2026.4+

workflow:
  id: research_swarm
  input_schema:
    question: string
  steps:
    - id: research_round_one
      agent: researcher
      input:
        question: "{{ input.question }}"
      output: initial_findings

    - id: critique
      agent: critic
      input:
        findings: "{{ initial_findings }}"
      output: critiques

    - id: research_round_two
      agent: researcher
      when: "{{ critiques.weak_claims | length > 0 }}"
      input:
        question: "{{ input.question }}"
        gaps: "{{ critiques.weak_claims }}"
      output: refined_findings

    - id: final_brief
      agent: publisher
      input:
        question: "{{ input.question }}"
        findings: "{{ refined_findings | default(initial_findings) }}"
        critiques: "{{ critiques }}"
      output: brief
```

## Field reference

Top-level:

| Field      | Type   | Required |
| ---------- | ------ | :------: |
| `workflow` | object |    ✓     |

`workflow`:

| Field          | Type   | Required | Notes                                                 |
| -------------- | ------ | :------: | ----------------------------------------------------- |
| `id`           | string |    ✓     | `snake_case` identifier.                              |
| `input_schema` | object |          | Map of input name → type.                             |
| `steps`        | list   |    ✓     | ≥1 ordered step.                                      |

Each step:

| Field    | Type   | Required | Notes                                                                      |
| -------- | ------ | :------: | -------------------------------------------------------------------------- |
| `id`     | string |    ✓     | `snake_case`. Output is addressable by this id.                            |
| `agent`  | string |    ✓     | Must match an `id` in `grok-agent.yaml`.                                   |
| `input`  | object |          | Jinja2-templated key → expression.                                         |
| `output` | string |          | Binds this step's result to a downstream variable.                         |
| `when`   | string |          | Jinja boolean. Skipped when falsy.                                         |

## Templating

Step inputs are [Jinja2](https://jinja.palletsprojects.com/) strings
evaluated at runtime:

- `{{ input.<key> }}` — flow input.
- `{{ <step_output_name> }}` — prior step's `output`.
- Filters: `default`, `length`, `map`, `select`, `join`, `tojson`.

## Error behavior

- A step that raises halts the workflow.
- A step with `when:` falsy is logged as `skipped`; the workflow continues.
- Downstream references to a skipped step's output are `undefined` —
  use `default()`.

## Validation notes

- Every step's `agent:` resolves against `grok-agent.yaml`.
- Output names must be unique within a workflow.
- `when:` and `input:` expressions are parsed as Jinja at validate time.

## Schema

[`grok-workflow.json` →](../../assets/schemas/latest/grok-workflow.json)
