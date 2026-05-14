# Cinnabar Glass — Design System

**Version 1.0** · Single source of truth for `grok-install`, `xlOS`, and every
public-facing AgentMindCloud surface.

This file is the **implementation guide**. The long-form brand essay lives at
[`assets/brand/CINNABAR-GLASS.md`](./assets/brand/CINNABAR-GLASS.md); the raw
tokens are at [`assets/brand/tokens.css`](./assets/brand/tokens.css) and
[`assets/brand/tokens.json`](./assets/brand/tokens.json). When a value
disagrees across files, **this document wins** until the others are brought
into line.

---

## 1 · Identity in one sentence

Dark, premium, glassmorphic, warm, confident. A black canvas, a deep cinnabar
accent, an amber bloom on the gradient, and frosted glass surfaces with soft
white-on-white borders.

## 2 · What this is NOT

- Not Bootstrap, not Material, not Tailwind defaults.
- Not the prior "Residual Frequencies" plate aesthetic (Instrument Serif +
  warm bone tones over near-black).
- Not generic glassmorphism — the cinnabar → amber-glow vertical gradient is
  the signature mark; without it a glass card is just a glass card.
- Not flat black. Atmosphere is mandatory under every hero.
- Not maximalist. Generous breathing room is part of the look.

---

## 3 · Color

| Token | Hex / value | Role |
| --- | --- | --- |
| `--color-void` | `#0D0D0D` | Primary page background. Never use `#000`. |
| `--color-onyx` | `#111113` | Sub-surface (under glass panels, code blocks). |
| `--color-glass-base` | `#1C1C1E` | Card / panel base. Apply at 55–65% opacity over void. |
| `--color-cinnabar` | `#C73E1D` | Primary accent. CTAs, focal strokes, brand mark. |
| `--color-cinnabar-glow` | `#E03C31` | Hover / active variant of cinnabar. |
| `--color-amber-glow` | `#FF7A3D` | Gradient top stop, hover highlights. |
| `--color-mist` | `#F5F5F5` | Default text, high-contrast UI. |
| `--color-mist-70` | `rgba(245,245,245,0.70)` | Secondary text. |
| `--color-mist-50` | `rgba(245,245,245,0.50)` | Tertiary text, captions. |
| `--color-mist-30` | `rgba(245,245,245,0.30)` | Hairline dividers. |
| `--border-soft` | `rgba(255,255,255,0.08)` | Default glass border. |
| `--border-strong` | `rgba(255,255,255,0.16)` | Hover / focus border. |
| `--border-cinnabar` | `rgba(199,62,29,0.55)` | Cinnabar-tinted border on accent surfaces. |

### Gradients

```css
--gradient-hero:        linear-gradient(180deg, #FF7A3D 0%, #C73E1D 100%);
--gradient-hero-strong: linear-gradient(180deg, #FFD4A8 0%, #FF7A3D 35%, #C73E1D 100%);
```

The hero gradient is for **typography fills, accent strokes, and CTA fills on
hover** only. Never use it as a large flat background.

### Atmosphere (mandatory on every hero)

Layer two radial gradients over `--color-void`:

```css
background:
  radial-gradient(ellipse 50% 50% at 80% 20%, rgba(255,122,61,0.08), transparent 60%),
  radial-gradient(ellipse 60% 60% at 20% 80%, rgba(199,62,29,0.05), transparent 70%),
  #0D0D0D;
```

Banners (`assets/banner.svg`) intentionally push to ~30% amber / ~20% cinnabar
because they are display-only surfaces with no overlaid content.

---

## 4 · Typography

| Stack | Family | Use |
| --- | --- | --- |
| `--font-display` | Geist 400 / 500 / 700 / 800 | All headings, body text, CTAs. |
| `--font-mono` | IBM Plex Mono 400 / 500 / 700 | Labels, kbd, code, footer captions. |

Geist is loaded from Google Fonts in v1.0; self-hosted woff2 is the v1.1 goal.
IBM Plex Mono is self-hosted in `website/fonts/`.

### Web scale

| Element | Size (px) | Weight | Tracking | Notes |
| --- | --- | --- | --- | --- |
| H1 hero | `clamp(40, 6vw, 64)` | 800 | −0.025em | Default mist; gradient fill optional. |
| H2 section | `clamp(28, 4vw, 40)` | 700 | −0.015em | |
| H3 card title | 22 | 600 | −0.005em | |
| Body | 18 | 400 | 0 | line-height 1.6, mist 90% |
| Small body | 16 | 400 | 0 | mist 70% |
| Mono label | 13 | 500 | +0.16em | uppercase, mist 70% |
| Code inline | 14 | 400 | 0 | mono, onyx bg, 4px radius |
| Code block | 14 | 400 | 0 | mono, onyx bg, 16px radius, 24px pad |
| Chip | 11 | 600 | +0.14em | uppercase, mono |

### Readability rules

- Body text never below 16px. Period.
- All text passes WCAG AA at final rendered size.
- Stroke weight ≥ 1.5px on UI; ≥ 4px on hero / focal SVG elements.
- Never shrink text to fit a container — redesign the container.

---

## 5 · Geometry

| Token | Value | Use |
| --- | --- | --- |
| `--radius-xs` | 4px | Inline code |
| `--radius-sm` | 8px | Chips, small buttons |
| `--radius-md` | 12px | Buttons, inputs |
| `--radius-lg` | 16px | Cards, glass panels, code blocks |
| `--radius-xl` | 24px | Hero glass surfaces |
| `--radius-pill` | 999px | Pills, status badges |

### Spacing (4px scale)

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 64 · 96 · 128`

Use the smaller multiples for compact UI (`8`/`12` inside chips, `12`/`16`
inside cards). Use the larger multiples for vertical rhythm between major
sections (`64`/`96` between hero and content; `128` before footer).

### Elevation

| Token | Value | Use |
| --- | --- | --- |
| `--shadow-glass` | `0 8px 32px rgba(0,0,0,0.32)` | Default glass panel shadow. |
| `--shadow-glow-soft` | `0 0 40px rgba(199,62,29,0.18)` | Hover on accent surfaces. |
| `--shadow-glow-strong` | `0 0 80px rgba(255,122,61,0.30)` | CTA hover, focal mark. |

---

## 6 · Surfaces

### Glass panel (canonical)

```css
.glass {
  background: rgba(28, 28, 30, 0.60);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(20px) saturate(120%);
  -webkit-backdrop-filter: blur(20px) saturate(120%);
  box-shadow: var(--shadow-glass);
}
```

### Glass card hover

```css
.glass:hover,
.glass:focus-within {
  border-color: var(--border-cinnabar);
  box-shadow: var(--shadow-glass), var(--shadow-glow-soft);
  transform: translateY(-2px);
}
```

### CTA button

```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-cinnabar);
  background: transparent;
  color: var(--color-mist);
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  transition: background 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
}

.btn-primary:hover,
.btn-primary:focus-visible {
  background: var(--gradient-hero);
  border-color: transparent;
  box-shadow: var(--shadow-glow-strong);
}
```

### Input

```css
.input {
  background: rgba(28, 28, 30, 0.40);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  color: var(--color-mist);
  font-family: var(--font-display);
  font-size: 16px;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.input:focus {
  outline: none;
  border-color: var(--color-cinnabar);
  box-shadow: var(--shadow-glow-soft);
}
```

### Code block

```css
.code-block {
  background: var(--color-onyx);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  padding: 24px;
  font-family: var(--font-mono);
  font-size: 14px;
  line-height: 1.55;
  color: var(--color-mist);
  overflow-x: auto;
}
```

---

## 7 · Components

### Nav

- Glass strip, sticky on hero pages.
- Mono labels, 13px, weight 500, tracking +0.16em, uppercase.
- Active item: cinnabar underline 2px, 4px offset.

### Card

- Glass treatment.
- 24px padding, 16px gap, 16px radius.
- Title in Geist 22px / 600 mist; body in Geist 16px / 400 mist 70%.
- Optional chips under body, optional `view-link` (mono 12px / 600 / +0.14em
  uppercase / cinnabar) above the card border.

### Chip

- 11px / 600 / +0.14em uppercase IBM Plex Mono.
- 6px 10px padding, 8px radius.
- Surface: `rgba(255,255,255,0.04)` with `1px solid rgba(255,255,255,0.10)`.

### Button variants

- **Primary** — see CTA above.
- **Secondary** — mist 8% bg + mist 16% border, no fill on hover, mist text.
- **Ghost** — transparent, mist 70% text, underline appears on hover in cinnabar.

### Focus state (global rule)

```css
:focus-visible {
  outline: 2px solid var(--color-cinnabar);
  outline-offset: 4px;
}
```

### Animation

- Transitions ≤ 250ms ease.
- `prefers-reduced-motion: reduce` disables atmosphere drift and pulse loops.

---

## 8 · Voice (visual)

- Cinnabar is **rare**. Two or three accents per viewport; never large flat
  fills.
- Atmosphere is **always on**. Flat black is off-brand.
- Spacing is **generous**. If two elements feel cramped, the surrounding
  container is wrong.
- Type is **muscular**. Headings are heavy; weight 800 is the default H1.

---

## 9 · Banner / SVG rules

`assets/banner.svg` is the canonical hero. SVG-only surfaces:

- Use `IBM Plex Mono` for `<text>` mono runs and `Geist` for display runs.
- Use the explicit hex values; do not reference CSS custom properties (SVGs
  ship in OG previews where `:root` is undefined).
- Simulate glass with `rgba(28,28,30,0.60)` rect + `rgba(245,245,245,0.08)`
  1.5px stroke.
- Bloom strength: ~30% amber / ~20% cinnabar for banner; 8% / 5% for web hero.

---

## 10 · Cross-repo

Cinnabar Glass governs:

- `AgentMindCloud/grok-install` (this repo)
- `AgentMindCloud/xlOS`

Mirrored tokens live in both repos at `assets/brand/`. When a token changes
in one repo, mirror the change in the other and bump the version below.

### File ownership

| File | Owner | Status |
| --- | --- | --- |
| `DESIGN_SYSTEM.md` | grok-install | Canonical implementation guide. |
| `assets/brand/CINNABAR-GLASS.md` | both | Brand essay / vocabulary. |
| `assets/brand/tokens.css` | both | CSS custom properties. |
| `assets/brand/tokens.json` | both | Machine-readable token export. |

---

## 11 · Versioning

| System version | grok-install | Notes |
| --- | --- | --- |
| 1.0 | v1.0.0 | Initial Cinnabar Glass rollout. Replaces Residual Frequencies. |

Bump the system version when any token value changes, when a new component is
added to this document, or when the surface inventory in §10 changes.
