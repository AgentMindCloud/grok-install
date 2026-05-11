<!-- docs/v2.13/spec/grok-test-yaml.md -->
---
title: grok-test.yaml (v2.13)
description: AI-powered test suites for code quality, security, accessibility, and performance audits.
---

# `grok-test.yaml` — v2.13

Declarative AI-powered test suites. Each suite is a named evaluation
prompt plus scope, severity rules, and CI gating. Invoke via
`@grok test <SuiteName>` on any PR or commit.

## Minimal example

```yaml
version: 1.0.0
author: "@JanSol0s"
compatibility:
  - grok-install.yaml@1.0+
  - grok@2026.4+

test_suites:
  security-scan:
    description: Flag obvious security anti-patterns in application code.
    prompt: |
      Review the attached files for hard-coded secrets, SQL injection,
      XSS, missing auth checks, and CSRF. Classify each finding as
      info / warning / high / critical.
    categories: [security]
    alert_level: warning
    fail_on: error
```

## Full example

```yaml
version: 1.2.0
author: "@JanSol0s"
compatibility:
  - grok-install.yaml@1.0+
  - grok@2026.4+

test_suites:
  all:
    description: Run every enabled suite.
    prompt: "Run all enabled suites below."

  security-scan:
    description: Application security audit.
    prompt: |
      Review for hard-coded secrets, SQL injection, XSS, missing auth,
      CSRF, dependency vulnerabilities. Severities: info / warning /
      high / critical.
    files: ["src/**/*.py", "src/**/*.ts", "src/**/*.tsx"]
    exclude_files: ["**/*.test.*", "**/__mocks__/**"]
    temperature: 0.1
    alert_level: warning
    fail_on: error
    max_findings: 50
    categories: [security]
    block_merge_on_fail: true

  a11y-check:
    description: WCAG 2.2 AA accessibility audit.
    prompt: |
      Review the HTML and JSX for WCAG 2.2 AA violations: colour
      contrast, focus order, missing alt text, ARIA misuse.
    files: ["**/*.html", "**/*.tsx", "**/*.jsx"]
    categories: [accessibility]
    alert_level: warning
    fail_on: warning
```

## Field reference

Top-level:

| Field         | Type   | Required | Notes                               |
| ------------- | ------ | :------: | ----------------------------------- |
| `test_suites` | object |    ✓     | ≥ 1 named suite. `all` is the special "run everything" alias. |

Per-suite:

| Field                 | Type    | Required | Notes                                           |
| --------------------- | ------- | :------: | ----------------------------------------------- |
| `description`         | string  |    ✓     | 5 – 500 chars.                                  |
| `prompt`              | string  |    ✓     | 10 – 2000 chars. Be explicit about pass/fail.   |
| `files`               | list    |          | Glob patterns; default = whole repo.            |
| `exclude_files`       | list    |          | Glob patterns.                                  |
| `temperature`         | number  |          | 0 – 1. Default `0.2`.                           |
| `alert_level`         | enum    |          | `info / warning / high / critical`. Default `warning`. |
| `fail_on`             | enum    |          | `error / warning / all`. Default `error`.       |
| `max_findings`        | integer |          | 1 – 500.                                        |
| `categories`          | list    |          | `security / performance / accessibility / code_quality / documentation / testing / dependencies / compliance`. |
| `block_merge_on_fail` | boolean |          | Default `false`.                                |
| `enabled`             | boolean |          | Default `true`.                                 |

## Schema

[`grok-test.json` →](../../assets/schemas/latest/grok-test.json)
