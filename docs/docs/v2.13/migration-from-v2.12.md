<!-- docs/v2.13/migration-from-v2.12.md -->
---
title: Migrate from v2.12 to v2.13
description: Step-by-step guide for moving from the five-file v2.12 layout to the 12-file v2.13 layout.
---

# Migrate v2.12 → v2.13

v2.13 is **breaking** for one file (`grok-install.yaml` is replaced by
`grok-config.yaml`). The four carried files —
`grok-agent.yaml`, `grok-prompts.yaml`, `grok-security.yaml`,
`grok-workflow.yaml` — require no changes.

## Automated path

If you're on the official CLI:

```bash
grok-install migrate --from 2.12 --to 2.13
```

The migration:

1. Renames `grok-install.yaml` → `.grok/grok-config.yaml`.
2. Splits `runtime:` into `grok-config.yaml:grok` and
   `grok-deploy.yaml:runtime`.
3. Moves `schedule:` from the root manifest into
   `.grok/grok-deploy.yaml`.
4. Writes stub `.grok/grok-docs.yaml`, `grok-test.yaml`, `grok-tools.yaml`,
   `grok-ui.yaml`, `grok-update.yaml`, `grok-analytics.yaml` with
   sensible defaults so `grok-install validate` passes.
5. Updates every reference in `grok-agent.yaml` to the new tool
   catalog (`grok-tools.yaml`) in-place.

Review the diff, commit, push.

## Manual path

### 1. Create `.grok/grok-config.yaml`

Move these fields out of `grok-install.yaml`:

| v2.12 field                 | v2.13 location                    |
| --------------------------- | --------------------------------- |
| `name`                      | `grok-config.yaml:meta.name`      |
| `description`               | `grok-config.yaml:meta.description` |
| `model`                     | `grok-config.yaml:grok.default_model` |
| `env` (list)                | `grok-config.yaml:env`            |
| `runtime.python`            | `grok-deploy.yaml:runtime.python` |
| `runtime.node`              | `grok-deploy.yaml:runtime.node`   |
| `entrypoint`                | `grok-deploy.yaml:entrypoint`     |
| `schedule`                  | `grok-deploy.yaml:schedule`       |
| `category`, `tags`, `featured` | `grok-ui.yaml:listing`         |

### 2. Delete `grok-install.yaml`

Once every field has found a home, delete the file. v2.13 validators
refuse to run if it's still present.

### 3. Leave the four carried files alone

- `.grok/grok-agent.yaml`  → unchanged
- `.grok/grok-prompts.yaml` → unchanged
- `.grok/grok-security.yaml` → unchanged
- `.grok/grok-workflow.yaml` → unchanged

### 4. Declare compatibility

Every v2.13 file needs a header:

```yaml
version: 2.13.0
author: "@YourHandle"
compatibility:
  - grok-install.yaml@1.0+
  - grok@2026.4+
```

### 5. Re-validate

```bash
grok-install validate .
```

## Gotchas

!!! failure "Mixed-version repo"
    v2.13 validators reject a repo that contains **both** a
    `grok-install.yaml` (v2.12) and any `.grok/grok-*.yaml` whose
    `compatibility:` declares v2.13. Finish the migration or revert.

!!! failure "Case-sensitive file names"
    `grok-config.yaml` — not `Grok-Config.yaml` or `grok_config.yaml`.
    The validator is strict on filename casing.

!!! tip "Template upgrades"
    The 10 templates in
    [awesome-grok-agents](https://github.com/AgentMindCloud/awesome-grok-agents)
    all shipped v2.13 variants on the same day as the spec. Cherry-pick
    the `.grok/` directory from the template closest to your agent.

## Next

After you've landed v2.13, optionally add the v2.14 `visuals:` block.
It's fully additive: [v2.13 → v2.14 →](../v2.14/migration.md).
