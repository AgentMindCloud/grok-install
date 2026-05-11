<!-- docs/v2.13/spec/grok-docs-yaml.md -->
---
title: grok-docs.yaml (v2.13)
description: Auto-generated documentation targets with section composition, style presets, and update triggers.
---

# `grok-docs.yaml` — v2.13

Declarative, AI-generated documentation targets. Each entry describes a
single document to generate: output path, the ordered sections it
contains, the writing style, and the events that trigger regeneration.

## Minimal example

```yaml
version: 1.0.0
author: "@JanSol0s"
compatibility:
  - grok-install.yaml@1.0+
  - grok@2026.4+

docs:
  readme:
    target: README.md
    sections: [hero, features, installation, quickstart]
```

## Full example

```yaml
version: 1.2.0
author: "@JanSol0s"
compatibility:
  - grok-install.yaml@1.0+
  - grok@2026.4+

docs:
  readme:
    target: README.md
    sections: [hero, features, installation, quickstart, magic_triggers, license]
    style: exciting-professional
    update_on: [push, pr_merged]
    include_code_samples: true
    table_of_contents: false
    max_length_words: 1200

  api_reference:
    target: docs/API.md
    sections: [api_reference, auth, endpoints, examples]
    style: reference
    update_on: [release]
    include_code_samples: true
    source_files: ["src/**/*.py", "src/**/*.ts"]
    table_of_contents: true
    max_length_words: 6000
```

## Field reference

Top-level:

| Field  | Type   | Required | Notes                       |
| ------ | ------ | :------: | --------------------------- |
| `docs` | object |    ✓     | ≥ 1 named doc target.       |

Per-target:

| Field                  | Type    | Required | Notes                                                  |
| ---------------------- | ------- | :------: | ------------------------------------------------------ |
| `target`               | string  |    ✓     | Output path. `.md / .rst / .txt / .html`.              |
| `sections`             | list    |    ✓     | ≥ 1 ordered section. See enum below.                   |
| `style`                | enum    |          | `technical-clean / exciting-professional / minimal / comprehensive / tutorial / reference` |
| `update_on`            | list    |          | `push / pr_merged / release / manual / schedule / on_tag` |
| `include_code_samples` | boolean |          | Default `false`.                                       |
| `source_files`         | list    |          | Glob patterns. Defaults to whole repo.                 |
| `language`             | string  |          | BCP-47. Default `en`.                                  |
| `table_of_contents`    | boolean |          | Default `false`.                                       |
| `max_length_words`     | integer |          | 100 – 50000. Soft limit.                               |
| `enabled`              | boolean |          | Default `true`.                                        |

### `sections` enum

`hero`, `features`, `installation`, `quickstart`, `magic_triggers`,
`configuration`, `api_reference`, `examples`, `auth`, `endpoints`,
`changelog`, `contributing`, `license`, `faq`, `troubleshooting`,
`architecture`, `deployment`, `security`.

## Schema

[`grok-docs.json` →](../../assets/schemas/latest/grok-docs.json)
