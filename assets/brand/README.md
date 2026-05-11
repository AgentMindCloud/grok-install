# assets/brand/

The grok-install visual identity. Per DECISIONS.md D9, the lineage is Apache-2.0, the system is intentionally minimal (no capsule-render banners, no typing-svg, no status-emoji rows), and we share a unified design system with the experimental `xlOS` sibling.

## Palette

Four reserved colors. **Use at most three per asset.**

| Token | Hex | Use |
| --- | --- | --- |
| `--color-background` | `#0A0A0A` | Background and text base. |
| `--color-primary` | `#00F0FF` | Primary accent — canonical grok-install cyan. |
| `--color-secondary` | `#00FF9D` | Secondary accent — canonical grok-install green. |
| `--color-experimental` | `#FF2D55` | **RESERVED for xlOS only.** Do not use in grok-install-v2 assets. |

Per ARCHITECTURE-xlOS.md §5, `#FF2D55` is the xlOS experimental marker. It appears in `tokens.json` here strictly as a documented-reserved entry so the shared design system stays in one place.

## Fonts

- Sans: `Inter`, system-ui fallback.
- Mono: `JetBrains Mono`, `Fira Code` fallback.

## Files

- `tokens.json` — design tokens (DTCG format).
- `colors.css` — CSS custom properties mirror.
- `banner.svg` — README hero (1280×320).
- `logo-mark.svg` — square mark (256×256).
- `logo-wordmark.svg` — wordmark only (800×200).
- `social-card.svg` — OpenGraph card (1200×630).

All assets are placeholders; final art lands ahead of v1.0.
