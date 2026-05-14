# Cinnabar Glass — Visual Identity v1.0

The design language for grok-install + xlOS. Dark, premium, glassmorphic.
Cinnabar→amber hero gradient, void backgrounds, mist body type.
Built for thumbnail-grade readability — no element is allowed to disappear at small scale.

## Palette (5 tokens — no others)

| Token       | Hex       | Role                                                     |
|-------------|-----------|----------------------------------------------------------|
| void        | `#0D0D0D` | Primary background, deepest layer                        |
| glass-base  | `#1C1C1E` | Surface fill — cards, panels, glass containers           |
| cinnabar    | `#C73E1D` | Primary accent — CTAs, focal strokes, gradient base      |
| amber-glow  | `#FF7A3D` | Highlight — gradient top stop, focal glow, hover         |
| mist        | `#F5F5F5` | Body text + high-contrast UI                             |

## Hero gradient (canonical)

`linear-gradient(180deg, #FF7A3D 0%, #C73E1D 100%)`

Applied to: hero wordmarks, primary CTAs, focal accent strokes.
Never used as flat fill on large surfaces — only on type and accent strokes.

## Atmospheric background

Layered over `void`:
- Radial gradient #1: `amber-glow` @ 8% opacity, center at top-right 30%, radius 50% of viewport
- Radial gradient #2: `cinnabar` @ 5% opacity, center at bottom-left 30%, radius 60% of viewport

Result: cosmic, ambient, premium. Never a flat black surface.

## Typography

- **Display:** Geist (weights: 400, 500, 700, 800) — Google Fonts `family=Geist`
- **Mono:** IBM Plex Mono (weights: 400, 500, 700) — Google Fonts `family=IBM+Plex+Mono`
- **Italic display option:** Geist Italic for poetic captions (replaces the v1 Instrument Serif role)

### Web scale (CSS px, scale down 75% on mobile)

| Use            | Size | Font            | Weight | Color           |
|----------------|------|-----------------|--------|-----------------|
| H1             | 64px | Geist           | 800    | mist            |
| H2             | 40px | Geist           | 700    | mist            |
| H3             | 28px | Geist           | 600    | mist            |
| Body           | 18px | Geist           | 400    | mist            |
| Small body     | 16px | Geist           | 400    | mist 90%        |
| Mono label     | 14px | IBM Plex Mono   | 500    | mist 80%        |
| Code blocks    | 15px | IBM Plex Mono   | 400    | mist            |

### Banner scale (SVG, 2400×1000 viewBox)

| Use                | Size  | Font          | Weight | Notes                              |
|--------------------|-------|---------------|--------|------------------------------------|
| Hero wordmark      | 200px | Geist         | 800    | Hero-gradient fill + outer glow    |
| Subtitle           | 36px  | IBM Plex Mono | 700    | mist, tracking +0.05em, UPPERCASE  |
| Stats row          | 22px  | IBM Plex Mono | 500    | mist 90%, tracking +0.08em, separator: `·` |
| Header strip       | 16px  | IBM Plex Mono | 700    | mist 60%, tracking +0.1em, UPPERCASE |
| Footer caption     | 24px  | Geist Italic  | 400    | mist 70%                           |

## Readability minimums (NEVER below)

- Body text: **16px** on web, **22px** equivalent on banner
- Mono labels: **14px** on web, **16px** on banner
- Stroke weights: **2px minimum**, **4px for hero/focal strokes**
- Body type opacity: **100% mist** for primary read; never below 60% for any text
- Contrast: every text→bg pair must clear WCAG AA at the rendered scale

If an element can't meet the minimum, **drop it**, don't shrink it.

## Surface treatments

### Glass panel (cards, stats containers, hover surfaces)
- Fill: `glass-base` at 60% opacity over background
- Border: 1px `mist` at 8% opacity
- Border-radius: 16px (web) / 20px on SVG banner panels
- Optional: `backdrop-filter: blur(20px) saturate(120%)` in CSS contexts
- In SVG: simulate with `<rect>` at low opacity + 1px stroke

### CTA button
- Default: 1px `cinnabar` border, transparent fill, 16px mist label
- Hover: hero-gradient fill, amber-glow box-shadow at 30% opacity, 80px blur radius
- Border-radius: 12px

### Hero glow (SVG filter)

```xml
<filter id="hero-glow" x="-50%" y="-50%" width="200%" height="200%">
  <feGaussianBlur stdDeviation="8" result="glow"/>
  <feMerge>
    <feMergeNode in="glow"/>
    <feMergeNode in="SourceGraphic"/>
  </feMerge>
</filter>
```


## What this is NOT

- Not laboratory-plate (no grid lines, no axes, no registration crosses, no plate-number conventions from RF v1/v2)
- Not Bootstrap (no Material shadows, no generic rounded buttons)
- Not generic glassmorphism (the cinnabar→amber gradient is the signature, blur alone isn't the identity)
- Not maximalist (every element earns its place; large breathing room is the rule)

## Versioning

This is v1.0 of Cinnabar Glass. Identical file lives in both `grok-install/assets/brand/CINNABAR-GLASS.md` and `xlOS/assets/brand/CINNABAR-GLASS.md`. If either copy is edited, the other must be updated to match in the same commit.
