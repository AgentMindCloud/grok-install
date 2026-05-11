<!-- docs/v2.12/index.md -->
---
title: v2.12 — pinned reference
description: Pinned reference for grok-install spec v2.12. Five YAML file types released April 2026.
---

# grok-install v2.12

!!! note "Pinned version"
    This is the **pinned** v2.12 reference. v2.12 is frozen — it still
    validates and runs exactly as shipped in April 2026.
    For the current release, see [**v2.14 →**](../v2.14/index.md) (adds a
    `visuals:` block).
    For the 12-standard expansion, see [**v2.13 →**](../v2.13/index.md).

v2.12 was the last release where the standard was **five YAML file types**.
Starting with v2.13, the standard was split into 12 focused files.

## The five files

<div class="grok-features" markdown>

<div class="grok-feature" markdown>
### [grok-install.yaml →](spec/grok-install-yaml.md)
Root manifest. Spec version, name, entrypoint, runtime, env vars.
</div>

<div class="grok-feature" markdown>
### [grok-agent.yaml →](spec/grok-agent-yaml.md)
One or more agents: id, model, prompt reference, tools, turn limits.
</div>

<div class="grok-feature" markdown>
### [grok-workflow.yaml →](spec/grok-workflow-yaml.md)
Multi-agent orchestration. Typed steps with inputs, outputs, conditions.
</div>

<div class="grok-feature" markdown>
### [grok-prompts.yaml →](spec/grok-prompts-yaml.md)
System prompt lookup table, keyed by name.
</div>

<div class="grok-feature" markdown>
### [grok-security.yaml →](spec/grok-security-yaml.md)
Safety profile, explicit permissions, approval gates, rate limits.
</div>

</div>

## Pin your spec

At the top of `grok-install.yaml`:

```yaml
spec: grok-install/v2.12
```

This locks the validator and runtime to v2.12 semantics, regardless of
what is released upstream.

## JSON schemas

- [`grok-install.schema.json`](../assets/schemas/v2.12/grok-install.schema.json)
- [`grok-agent.schema.json`](../assets/schemas/v2.12/grok-agent.schema.json)
- [`grok-workflow.schema.json`](../assets/schemas/v2.12/grok-workflow.schema.json)
- [`grok-security.schema.json`](../assets/schemas/v2.12/grok-security.schema.json)
- [`grok-prompts.schema.json`](../assets/schemas/v2.12/grok-prompts.schema.json)

## When to stay on v2.12

- You don't need the 7 new file types from v2.13 (`grok-config`,
  `grok-analytics`, `grok-deploy`, `grok-docs`, `grok-test`, `grok-tools`,
  `grok-ui`, `grok-update`).
- You don't need the v2.14 `visuals:` block.
- Your CI, team, or downstream consumers need a frozen contract.

## Migrating off v2.12

- [v2.12 → v2.13 migration guide →](../v2.13/migration-from-v2.12.md)
- [v2.13 → v2.14 migration guide →](../v2.14/migration.md)

Both migrations are additive-only for the four files carried forward
(`grok-agent`, `grok-prompts`, `grok-security`, `grok-workflow`).
`grok-install.yaml` is replaced by `grok-config.yaml` in v2.13 — see the
migration guide.
