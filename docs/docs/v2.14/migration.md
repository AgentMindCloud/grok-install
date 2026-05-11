<!-- docs/v2.14/migration.md -->
---
title: Migrate from v2.13 to v2.14
description: Add a visuals block — the only change required to adopt v2.14. Fully additive and non-breaking.
---

# Migrate v2.13 → v2.14

v2.14 adds exactly one thing: the `visuals:` block. Nothing is renamed,
nothing is removed, no field changes anywhere else. A v2.13 validator
happily ignores the new block.

## Three-minute adoption

### 1. Bump the `compatibility:` list

In any file that declares visuals, add `grok-install.yaml@2.14+`:

```yaml
version: 2.14.0
compatibility:
  - grok-install.yaml@2.14+
  - grok@2026.4+
```

### 2. Drop the block in

Anywhere in your `.grok/` directory (by convention in
`.grok/grok-visuals.yaml`), add:

```yaml
visuals:
  type: image
  src: ./assets/card.png
  alt: "Describe what a screen reader should announce here."
```

That is the minimum viable `visuals:` block.

### 3. Validate

```bash
grok-install validate .
```

Or in the browser: [playground →](../playground/v2.14.md).

## What changes in tooling

| Tool                                 | v2.13 behaviour            | v2.14 behaviour                                  |
| ------------------------------------ | -------------------------- | ------------------------------------------------ |
| `grok-install validate`              | Ignores unknown blocks     | Validates `visuals:` if `type` is present        |
| Playground                           | Schema validation only     | Schema validation + **live preview card**        |
| `@grok install <repo>` on X          | Default install card       | Renders `visuals:` block if present, else default |
| CI link-check                        | Unchanged                  | Also checks `visuals.src`, `visuals.poster`, `visuals.cta.url` |

## What does NOT change

- Every carried file from v2.13 (`grok-agent`, `grok-prompts`,
  `grok-security`, `grok-workflow`) — byte-for-byte.
- Every new-in-v2.13 file (`grok-config`, `grok-analytics`, etc.) —
  byte-for-byte.
- Runtime version, SDK version, CLI version — all unchanged for agents
  that don't use `visuals:`.

## When to skip v2.14

- You don't need an install-card preview.
- You are pinning to v2.13 for contract reasons.

v2.14 does **not** reach end-of-life for v2.13 — both remain current
and supported for the 2026 release cycle.

## Opting back out

Delete the `visuals:` block and change `compatibility:` back to
`grok-install.yaml@1.0+`. The repo is pure v2.13 again — nothing else
to unwind.

## Next

- [Full `visuals:` reference →](visuals.md)
- [WCAG 2.2 AA checklist →](accessibility.md)
- [Playground with three pre-loaded examples →](../playground/v2.14.md)
