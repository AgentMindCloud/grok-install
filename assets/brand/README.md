# Brand Assets

Cinnabar Glass — the visual identity for `grok-install` and `xlOS`.

## Files

| File | Purpose |
| --- | --- |
| [`CINNABAR-GLASS.md`](./CINNABAR-GLASS.md) | Long-form brand essay. Tone, vocabulary, and the non-negotiable rules. Mirrored across `grok-install` and `xlOS`. |
| [`tokens.css`](./tokens.css) | CSS custom properties: colors, gradients, atmosphere, radii, shadows, blur. Import this into any web surface. |
| [`tokens.json`](./tokens.json) | Machine-readable token export for tooling. |

## Canonical implementation guide

See [`/DESIGN_SYSTEM.md`](../../DESIGN_SYSTEM.md) at the repository root for
the per-component spec — typography scale, surfaces, button variants, focus
states, animation rules, and cross-repo ownership. When this README and the
implementation guide disagree, the implementation guide wins.

## Banner

[`/assets/banner.svg`](../banner.svg) is the canonical hero used in the
GitHub social card, README, and `og:image` for every site page. Pushes
atmospheric bloom harder than web hero sections (~30 % amber / ~20 %
cinnabar) because banners are display-only with no overlaid content.

## Versioning

Tokens version 1.0 — corresponds to the `grok-install` v1.0.0 launch.
Bump `version` in `tokens.json` whenever any token value changes and
mirror the change to `xlOS`.
