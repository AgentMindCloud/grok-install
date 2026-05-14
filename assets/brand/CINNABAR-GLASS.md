# Cinnabar Glass — Visual Identity v1.1

**Design language for** `grok-install` + `xlOS`
**Core feeling**: Dark, premium, glassmorphic, warm, and confident.
**Non-negotiable rule**: Every element must remain readable and impactful at thumbnail size.

## Color Tokens (exactly these 5 — no others)

| Token          | Hex       | Role                                      | Usage Rules |
|----------------|-----------|-------------------------------------------|-------------|
| `void`         | `#0D0D0D` | Primary background                        | Never use flat black. Always layer atmosphere on top. |
| `glass-base`   | `#1C1C1E` | Cards, panels, glass surfaces             | Use at 55–65% opacity over void |
| `cinnabar`     | `#C73E1D` | Primary accent, CTAs, focal strokes       | Main brand color |
| `amber-glow`   | `#FF7A3D` | Gradient top, highlights, hover states    | Never use as large flat fill |
| `mist`         | `#F5F5F5` | Body text, high-contrast UI               | Minimum 60% opacity on any text |

## Hero Gradient (canonical)

`linear-gradient(180deg, #FF7A3D 0%, #C73E1D 100%)`

Use only on typography, thin accent strokes, and CTA fills on hover. Never use as a large background fill.

## Atmospheric Background (mandatory on all hero sections)

Layer these two radial gradients over `void`:

- `amber-glow` at 8% opacity — center: top-right 30%, radius 50%
- `cinnabar` at 5% opacity — center: bottom-left 30%, radius 60%

Result must feel cosmic and premium, never flat black.

Note: README banners (assets/banner.svg) intentionally use stronger atmospheric bloom (~30% center for amber orb, ~20% for cinnabar orb) than web hero sections, because the banner is a display-only surface with no overlaid content. The 8%/5% rule applies to web hero sections where text content overlays the atmosphere.

## Typography

- **Display:** Geist (400, 500, 700, 800)
- **Mono:** IBM Plex Mono (400, 500, 700)
- **Italic option:** Geist Italic (for captions only)

### Web Scale (px)

| Element     | Size | Weight | Color | Notes |
|-------------|------|--------|-------|-------|
| H1          | 64px | 800    | mist  | —     |
| H2          | 40px | 700    | mist  | —     |
| H3          | 28px | 600    | mist  | —     |
| Body        | 18px | 400    | mist  | —     |
| Small body  | 16px | 400    | mist  | —     |
| Mono labels | 14px | 500    | mist 80% | — |
| Code        | 15px | 400    | mist  | —     |

### Banner / SVG Scale (2400×1000 viewBox)

- Hero wordmark: 200px, Geist 800, filled with hero gradient + multi-pass bloom
- Subtitle: 36px, IBM Plex Mono 700, mist, uppercase, tracking +0.05em
- Stats: 22px, IBM Plex Mono 500, mist 90%
- Header strip: 16px–20px, IBM Plex Mono 700, mist 60%, uppercase
- Footer caption: 24px, Geist Italic, mist 70%

## Readability minimums (never break these)

- Body text never below 16px (web) / 22px equivalent (banner)
- All text must pass WCAG AA at final rendered size
- Stroke weight minimum 2px (4px on hero/focal elements)
- Never shrink text to fit — remove or redesign instead

## Glass Surface Treatment



```css
background: rgba(28, 28, 30, 0.60);           /* glass-base */
border: 1px solid rgba(245, 245, 245, 0.08);
border-radius: 16px;
backdrop-filter: blur(20px) saturate(120%);
```





In SVG: simulate with low-opacity rect + 1px stroke.

## CTA Button

- Default: 1px cinnabar border + transparent fill
- Hover: Hero gradient fill + amber-glow box-shadow (30% opacity, 80px blur)
- Border-radius: 12px
- Label: 16px mist

## What This Is NOT

- Not laboratory / technical plate aesthetic
- Not generic glassmorphism (the cinnabar→amber gradient is the signature)
- Not Bootstrap/Material
- Not maximalist — large breathing room is mandatory

## Versioning

This file lives in both repos:
- `grok-install/assets/brand/CINNABAR-GLASS.md`
- `xlOS/assets/brand/CINNABAR-GLASS.md`

They must stay identical.
