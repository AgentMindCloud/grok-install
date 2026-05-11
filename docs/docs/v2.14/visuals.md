<!-- docs/v2.14/visuals.md -->
---
title: visuals — v2.14 reference
description: Full reference for the v2.14 visuals block. Every field, every default, copy-paste blocks, JanVisuals example, WCAG 2.2 AA accessibility checklist.
---

# `visuals:` — v2.14 reference

The `visuals:` block declares how an agent previews in galleries, the
playground, and the **Install with Grok** card on X. It is fully
additive over v2.13 — a v2.13 validator silently ignores it.

!!! tip "Accessibility is not optional"
    `alt` is the only **required** user-facing field in the block.
    Without it, the schema rejects the file. See the
    [WCAG 2.2 AA checklist →](accessibility.md).

## Field reference

Top-level header (shared with every v2.14 file):

| Field           | Type   | Required | Notes                                  |
| --------------- | ------ | :------: | -------------------------------------- |
| `version`       | string |    ✓     | SemVer, e.g. `2.14.0`.                 |
| `author`        | string |    ✓     | X handle, `^@[A-Za-z0-9_]{1,50}$`.     |
| `compatibility` | list   |    ✓     | Must include `grok-install.yaml@2.14+`. |

The `visuals` object:

| Field           | Type    | Required | Notes                                                      |
| --------------- | ------- | :------: | ---------------------------------------------------------- |
| `type`          | enum    |    ✓     | `image`, `video`, `gif`, `carousel`.                       |
| `src`           | string  |    ✓     | Absolute URL or repo-relative path.                        |
| `srcset`        | list    |          | Responsive variants — see [`srcset`](#srcset).             |
| `poster`        | string  |          | Poster frame for `type: video`.                            |
| `alt`           | string  |    ✓     | 1 – 500 chars. Required for WCAG 2.2 AA.                   |
| `title`         | string  |          | ≤ 100 chars. Rendered above the media.                     |
| `caption`       | string  |          | ≤ 300 chars. Rendered below the media.                     |
| `description`   | string  |          | ≤ 1000 chars. Tooltip + search indexing.                   |
| `theme`         | enum    |          | `auto`, `light`, `dark`. Default `auto`.                   |
| `layout`        | enum    |          | `card`, `banner`, `inline`. Default `card`.                |
| `accessibility` | object  |          | See [`accessibility`](#accessibility).                     |
| `cta`           | object  |          | See [`cta`](#cta). Optional call-to-action button.         |

### `srcset`

```yaml
visuals:
  srcset:
    - src: ./assets/card.webp
      width: 640
      density: 1
    - src: ./assets/card@2x.webp
      width: 1280
      density: 2
```

| Field     | Type    | Required | Notes                                       |
| --------- | ------- | :------: | ------------------------------------------- |
| `src`     | string  |    ✓     | Variant URL.                                |
| `width`   | integer |          | Intrinsic width in CSS pixels. 1 – 8192.    |
| `density` | number  |          | DPR (e.g. `1`, `2`, `3`). 0.5 – 5.          |

### `accessibility`

```yaml
visuals:
  accessibility:
    reduced_motion: true
    contrast_ratio: 7.0
    captions: true
    transcript: ./assets/card.transcript.md
```

| Field            | Type    | Required | Notes                                               |
| ---------------- | ------- | :------: | --------------------------------------------------- |
| `reduced_motion` | boolean |          | Default `true`. Swaps animation for poster under `prefers-reduced-motion`. |
| `contrast_ratio` | number  |          | Declared minimum contrast. **Must be ≥ 4.5 for AA body text**. |
| `captions`       | boolean |          | Default `false`. Set `true` if CC is embedded/sidecar. |
| `transcript`     | string  |          | URL to a full text transcript.                      |

### `cta`

```yaml
visuals:
  cta:
    label: "Install on X"
    url: "https://x.com/compose/tweet?text=%40grok+install+..."
```

| Field   | Type   | Required | Notes                                   |
| ------- | ------ | :------: | --------------------------------------- |
| `label` | string |    ✓     | 1 – 24 chars.                           |
| `url`   | string |    ✓     | Absolute URL or repo-relative path.     |

## Minimal example

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

## JanVisuals — full example

The reference implementation. A static hero image with a `srcset`, an
embedded transcript, and an **Install on X** CTA.

```yaml
version: 2.14.0
author: "@JanSol0s"
compatibility:
  - grok-install.yaml@2.14+
  - grok@2026.4+
  - grok-yaml-standards@1.3+

visuals:
  type: image
  src: ./assets/janvisuals.webp
  srcset:
    - src: ./assets/janvisuals.webp
      width: 640
      density: 1
    - src: ./assets/janvisuals@2x.webp
      width: 1280
      density: 2
    - src: ./assets/janvisuals@3x.webp
      width: 1920
      density: 3
  alt: >
    The JanVisuals install card. Left: a dark-themed Grok terminal running
    "grok-install init janvisuals" on a cyan-accented keyboard. Right: a
    stacked preview of the generated README, API doc, and security scan
    summary, all labelled with the grok-install logo.
  title: "Install JanVisuals on X"
  caption: "The reference v2.14 visuals example — dark theme, high contrast, reduced-motion aware."
  description: >
    JanVisuals is the reference agent that ships with the v2.14 spec. It
    demonstrates every visuals feature: a responsive srcset, a declared
    contrast ratio, a sidecar transcript, and an Install-on-X CTA.
  theme: auto
  layout: card
  accessibility:
    reduced_motion: true
    contrast_ratio: 7.2
    captions: false
    transcript: ./assets/janvisuals.transcript.md
  cta:
    label: "Install on X"
    url: "https://x.com/intent/post?text=%40grok+install+AgentMindCloud%2Fjanvisuals"
```

## Video example

```yaml
version: 2.14.0
author: "@JanSol0s"
compatibility:
  - grok-install.yaml@2.14+
  - grok@2026.4+

visuals:
  type: video
  src: ./assets/demo.mp4
  poster: ./assets/demo-poster.webp
  alt: "45-second screen recording of a grok-install deploy landing on Vercel."
  title: "60-second install"
  layout: banner
  accessibility:
    reduced_motion: true
    contrast_ratio: 5.0
    captions: true
    transcript: ./assets/demo.transcript.md
  cta:
    label: "Try it live"
    url: "https://agentmindcloud.github.io/grok-docs/playground/v2.14/"
```

## Carousel example

```yaml
version: 2.14.0
author: "@JanSol0s"
compatibility:
  - grok-install.yaml@2.14+
  - grok@2026.4+

visuals:
  type: carousel
  src: ./assets/carousel/index.json
  alt: "Four-slide walkthrough of the grok-install onboarding flow."
  caption: "Four slides · 20 s each · tap to pause."
  layout: card
  accessibility:
    reduced_motion: true
    contrast_ratio: 4.5
    captions: true
```

## Accessibility checklist (summary)

- [x] Provide non-empty `alt`.
- [x] Declare `accessibility.contrast_ratio` ≥ 4.5 for body text.
- [x] Provide a `transcript` for any non-image media.
- [x] Set `accessibility.reduced_motion: true` for animated media.
- [x] Mark `captions: true` when CC is present.

Full guide: [Accessibility (WCAG 2.2 AA) →](accessibility.md).

## Live preview

Open the [playground](../playground/v2.14.md) to see the preview card
render in real time as you edit the YAML. Three pre-loaded samples are
available: **JanVisuals**, **Research swarm**, and **Reply bot**.

## Schema

[`grok-visuals.schema.json`](../assets/schemas/v2.14/grok-visuals.schema.json)
