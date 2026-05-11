---
title: grok-workflow.yaml
description: Chain agents into multi-step and multi-agent workflows with typed I/O and conditionals.
---

# `grok-workflow.yaml`

Orchestration for multi-step and swarm agents. Lives at
`.grok/grok-workflow.yaml`. Set `entrypoint: .grok/grok-workflow.yaml`
in your root manifest to activate it.

## Example: researcher → critic → publisher swarm

```yaml
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

Notice the conditional `when:` on `research_round_two` — the critic's
output determines whether the researcher runs a second pass.

## Field reference

Top-level:

| Field      | Type   | Required |
| ---------- | ------ | :------: |
| `workflow` | object |    ✓     |

`workflow`:

| Field          | Type   | Required | Notes                                               |
| -------------- | ------ | :------: | --------------------------------------------------- |
| `id`           | string |    ✓     | `snake_case` identifier for the flow.               |
| `input_schema` | object |          | Map of input name → type (`string`, `number`, `boolean`, `object`, `array`). |
| `steps`        | list   |    ✓     | Ordered list of steps; at least one.                |

Each step:

| Field   | Type   | Required | Notes                                                                                      |
| ------- | ------ | :------: | ------------------------------------------------------------------------------------------ |
| `id`    | string |    ✓     | `snake_case`. Output values are addressable by this id.                                    |
| `agent` | string |    ✓     | Must match an `id` in `grok-agent.yaml`.                                                   |
| `input` | object |          | Arbitrary key → Jinja expression. `{{ input.x }}` references flow inputs; `{{ step_id }}` references prior output. |
| `output`| string |          | Binds this step's result to a variable name for downstream steps.                          |
| `when`  | string |          | Jinja boolean expression. Step is skipped if falsy.                                        |

## Templating

Step inputs are [Jinja2](https://jinja.palletsprojects.com/) strings
evaluated at runtime. You get:

- `{{ input.<key> }}` — original flow input.
- `{{ <step_output_name> }}` — any prior step's `output`.
- Standard filters: `default`, `length`, `map`, `select`, `join`, `tojson`.

```yaml
input:
  findings: "{{ refined_findings | default(initial_findings) }}"
```

## Error behavior

- A step that raises halts the workflow (no silent continue).
- A step with `when:` that evaluates falsy is logged as `skipped` and
  the workflow continues.
- Output bindings survive skips: downstream `{{ some_output }}` is
  `undefined` if the producing step was skipped — use `default()`.

## Validation notes

- Every step's `agent:` must resolve against `grok-agent.yaml`.
- Output names must be unique within a workflow.
- `when:` and `input:` expressions are parsed as Jinja at validate time
  — syntax errors fail the build, not the run.

Schema: [`grok-workflow.schema.json`](../../assets/schemas/v2.12/grok-workflow.schema.json)
