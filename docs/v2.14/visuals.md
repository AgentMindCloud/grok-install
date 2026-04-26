---
title: grok-install v2.14 — visuals reference
description: The optional v2.14 visuals block — branded preview cards, animated install flows, demo media, dashboards, and accessibility defaults.
image: /docs/posters/og-default.png
---

# v2.14 Visuals

The `visuals` block is new in v2.14. It is **optional** — any valid v2.13
file stays valid — but adopting it opts your agent into the dark-premium
install surface: a branded gallery card, an animated install flow, a demo
asset, and a post-install mini-dashboard.

All v2.14 agents ship with a `#0A0A0A` canvas by default. Your `accent_color`
overlays that canvas; the gallery guarantees WCAG AA contrast for strokes,
focus rings, and CTA text.

---

## Drop-in block

Paste this at the root of your `grok-install.yaml` and adjust:

```yaml
visuals:
  accent_color: "#00F0FF"
  preview_card:
    style: "futuristic"
    panel_count: 4
  install_flow:
    steps:
      - "Scan safety"
      - "Request keys"
      - "Deploy agent"
      - "Go live"
    animation_speed: "normal"
  demo_media:
    type: "video"
    url: "https://cdn.example.com/demo.mp4"
    auto_generate: false
  post_install:
    mini_dashboard:
      animations: true
      haptics: true
      accessibility:
        reduce_motion_respect: true
        high_contrast: false
  theme:
    auto_adapt: true
  accessibility:
    alt_text_template: "{{name}} — {{description}}"
```

---

## Field reference

### `accent_color`

A 3- or 6-digit hex string. Used for card borders, focus rings, CTA fills,
and dashboard sparklines.

```yaml
visuals:
  accent_color: "#00F0FF"
```

Recommended palette on the default `#0A0A0A` canvas:

| Hex | Name | Contrast vs canvas |
|---|---|---|
| `#00F0FF` | Cyan | 13.8 : 1 |
| `#00FF9D` | Mint | 15.1 : 1 |
| `#7C3AED` | Violet | 6.1 : 1 |

All three clear WCAG AA for normal text.

### `preview_card`

Style presets for the gallery card.

```yaml
visuals:
  preview_card:
    style: "premium"   # futuristic | premium | minimal
    panel_count: 5      # integer, 3–8
```

- **futuristic** — glassy panels, neon strokes, subtle grid
- **premium** — monochrome + serif typography, no motion
- **minimal** — flat monochrome, single stat panel

### `install_flow`

Declarative step track shown inside the install modal.

```yaml
visuals:
  install_flow:
    steps: ["Scan", "Keys", "Deploy", "Live"]
    animation_speed: "fast"   # slow | normal | fast
```

Each step label is capped at 24 characters. Up to 8 steps are supported.

### `demo_media`

Attach a short demo for the gallery card. Provide either a `url` **or** set
`auto_generate: true`.

```yaml
visuals:
  demo_media:
    type: "gif"
    url: "https://cdn.example.com/demo.gif"
```

```yaml
visuals:
  demo_media:
    auto_generate: true
```

Supported `type` values: `image`, `video`, `gif`, `lottie`.

### `post_install.mini_dashboard`

A compact widget shown once install completes — tool-call counter, cost
remaining, status pulse.

```yaml
visuals:
  post_install:
    mini_dashboard:
      animations: true
      haptics: true
      accessibility:
        reduce_motion_respect: true
        high_contrast: false
```

### `theme.auto_adapt`

Set `true` to let the gallery card follow the viewer's light/dark
preference. Omit or set `false` to stay in the dark-premium default.

```yaml
visuals:
  theme:
    auto_adapt: true
```

### `accessibility.alt_text_template`

A Mustache-style template used for alt text on every rendered surface.

```yaml
visuals:
  accessibility:
    alt_text_template: "{{name}} — {{description}}"
```

Available variables: `{{name}}`, `{{description}}`, `{{category}}`.

---

## Accessibility notes

- **Contrast**: keep `accent_color` at or above 4.5 : 1 against `#0A0A0A`.
  The three palette entries above already clear this bar.
- **Motion**: always set `reduce_motion_respect: true` unless you have a
  reason not to. The gallery honours `prefers-reduced-motion` and will
  freeze dashboard animation when the user's system requests it.
- **Alt text**: always populate `accessibility.alt_text_template`. The
  gallery uses it for the preview card image, the demo media, and any
  downloaded screenshots.
- **Haptics**: only fire on user-initiated actions. The gallery gates
  haptics behind a per-user preference.

---

## Full reference example

See [`examples/janvisuals/grok-install.yaml`](../../examples/janvisuals/grok-install.yaml)
for a complete v2.14 file that exercises every field above.
