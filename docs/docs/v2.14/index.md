<!-- docs/v2.14/index.md -->
---
title: v2.14 — visuals block (current release)
description: grok-install v2.14 adds a fully additive visuals block for install-card previews. Fully backwards compatible with v2.13 validators.
---

# grok-install v2.14

v2.14 is a **purely additive** release. It introduces exactly one thing:
a `visuals:` block that declares how an agent should preview in galleries,
the playground, and the **Install with Grok** card on X.

Every v2.13 file still validates in v2.14 without changes. A v2.13
validator that encounters a v2.14 file ignores the new block — no
breakage.

!!! success "Additive by design"
    No removed fields, no renamed fields, no moved files. If you are on
    v2.13 today, adopt v2.14 when you want a preview card — not before.

## What's new

<div class="grok-features" markdown>

<div class="grok-feature" markdown>
### [`visuals:` block →](visuals.md)
Image, GIF, video, or carousel + accessibility declarations + optional CTA.
</div>

<div class="grok-feature" markdown>
### [Migration from v2.13 →](migration.md)
A drop-in YAML block. Zero breaking changes, 3 minutes to adopt.
</div>

<div class="grok-feature" markdown>
### [WCAG 2.2 AA checklist →](accessibility.md)
`alt` is required. Captions, transcripts, reduced-motion, contrast ratios.
</div>

<div class="grok-feature" markdown>
### [Live playground →](../playground/v2.14.md)
Three pre-loaded examples — JanVisuals, research-swarm, reply-bot.
</div>

</div>

## The minimum viable example

```yaml
version: 2.14.0
author: "@JanSol0s"
compatibility:
  - grok-install.yaml@2.14+
  - grok@2026.4+

visuals:
  type: image
  src: ./assets/card.png
  alt: "A terminal showing grok-install init my-agent."
```

That's it. Everything else is optional.

## JSON Schema

- [`grok-visuals.schema.json`](../assets/schemas/v2.14/grok-visuals.schema.json)

The playground validates v2.14 YAML against this schema in-browser — no
server round-trip. Invalid blocks surface errors with line numbers.

## Compatibility matrix

| Spec  | Runtime         | SDK            | CLI              |
| ----- | --------------- | -------------- | ---------------- |
| v2.14 | grok@2026.4+    | grok-sdk@1.4+  | grok-install@3.1+ |

## Still on v2.12?

v2.14 requires the v2.13 12-standard layout. Run
[v2.12 → v2.13 migration](../v2.13/migration-from-v2.12.md) first, then
[v2.13 → v2.14](migration.md).
