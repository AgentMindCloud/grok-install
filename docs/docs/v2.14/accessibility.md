<!-- docs/v2.14/accessibility.md -->
---
title: Accessibility (WCAG 2.2 AA)
description: WCAG 2.2 AA checklist for the v2.14 visuals block. Required alt text, contrast ratios, captions, transcripts, reduced motion.
---

# Accessibility — WCAG 2.2 AA

Every install card reaches an audience with diverse abilities,
connections, and devices. The `visuals:` block is designed so that the
minimum configuration passes WCAG 2.2 AA, and every optional field
directly maps to a success criterion.

## Non-negotiables

The schema **rejects** files that violate these:

- [x] `alt` is present and non-empty (1 – 500 chars).
- [x] `accessibility.contrast_ratio`, if set, is ≥ 4.5 (AA body-text minimum).

## Checklist

### Perceivable

- [x] **1.1.1 Non-text Content** — `alt` is required and non-empty.
- [x] **1.2.1 Audio-only / Video-only (Prerecorded)** — provide a
  `accessibility.transcript` for any `type: video` or `type: gif`.
- [x] **1.2.2 Captions (Prerecorded)** — set
  `accessibility.captions: true` when closed captions are embedded
  or sidecar.
- [x] **1.2.3 Audio Description / Transcript** — the `transcript` URL
  satisfies this for prerecorded media.
- [x] **1.4.3 Contrast (Minimum)** — declare
  `accessibility.contrast_ratio: ≥ 4.5` for body text overlaid on media;
  ≥ 3.0 for large text (≥ 18 pt or 14 pt bold).
- [x] **1.4.5 Images of Text** — avoid embedding copy inside the image
  whenever possible; use the `title` and `caption` fields instead.
- [x] **1.4.10 Reflow** — the preview card reflows down to 320 CSS
  pixels wide. Avoid fixed-pixel widths in `srcset`.
- [x] **1.4.11 Non-text Contrast** — UI affordances (the CTA button, the
  card border) already meet 3:1 via the site's CSS variables.

### Operable

- [x] **2.2.2 Pause, Stop, Hide** — videos auto-pause when off-screen;
  carousels auto-pause on focus. No configuration needed.
- [x] **2.3.3 Animation from Interactions (AAA but recommended)** — set
  `accessibility.reduced_motion: true` (default). The renderer swaps
  animated media for the `poster` under `prefers-reduced-motion: reduce`.
- [x] **2.4.4 Link Purpose (In Context)** — the `cta.label` must clearly
  describe its destination. "Install on X" passes; "Click here" fails.
- [x] **2.5.5 Target Size (Minimum)** — the CTA button is ≥ 44 × 44
  CSS pixels. No configuration needed.

### Understandable

- [x] **3.1.1 Language of Page** — inherited from the page `<html lang>`.
- [x] **3.2.4 Consistent Identification** — the preview card's DOM
  structure is identical across all layouts (`card`, `banner`, `inline`).

### Robust

- [x] **4.1.2 Name, Role, Value** — the preview card uses standard
  `<figure>`, `<figcaption>`, `<img>`, `<video>`, and `<a>` elements.
  Screen readers announce "image", "video", or "link" without ARIA.

## Contrast ratio — how to measure

For a v2.14 `visuals:` block where the CTA or title overlays the media:

1. Sample the median luminance of the overlay region in your source
   asset (any image editor's eyedropper will do).
2. Compute the contrast ratio between that luminance and the text color
   the site renders (the theme CSS variable `--grok-text` for most
   cases).
3. Declare the **minimum** you measured in `accessibility.contrast_ratio`.

If the text never overlays the media (e.g. `layout: card` with text
below the image), you can omit `contrast_ratio` entirely — the site's
CSS variables already pass AA for the surrounding chrome.

## Captions and transcripts

| Media type       | Transcript | Captions |
| ---------------- | ---------- | -------- |
| `image`          | optional   | n/a      |
| `gif` (animated) | **required** | n/a  |
| `video`          | **required** | recommended |
| `carousel`       | **required for any non-image slide** | per-slide |

!!! tip "Auto-generated transcripts"
    Set
    `grok-update.yaml:updates.transcript.sources: ["assets/*.mp4"]` to
    have Grok regenerate transcripts on a schedule.

## Automated checks

In `grok-test.yaml`:

```yaml
test_suites:
  visuals-a11y:
    description: Validate every visuals block against WCAG 2.2 AA.
    prompt: |
      For each grok-visuals.yaml, verify alt is present, contrast_ratio
      is ≥ 4.5, transcript is present for non-image media, and reduced
      motion is not explicitly disabled. Fail on any violation.
    files: [".grok/**/grok-visuals*.yaml"]
    categories: [accessibility]
    fail_on: warning
    block_merge_on_fail: true
```

## Further reading

- [WCAG 2.2 AA quick reference](https://www.w3.org/WAI/WCAG22/quickref/?currentsidebar=%23col_customize&levels=aaa)
- [Visuals reference →](visuals.md)
- [Migration from v2.13 →](migration.md)
