# assets/brand/

The grok-install-v2 visual identity. Lineage is Apache-2.0. The system
is intentionally minimal — no third-party animated banner services, no
typing-effect headers, no status-emoji rows.

grok-install-v2 is the public-facing standards repo and landing site of
the AgentMindCloud product line. The brand reflects that — a warmer,
more consumer-facing aesthetic intended to read like a magazine plate
rather than a developer terminal. The developer-tool sibling
[`xlOS`](https://github.com/AgentMindCloud/xlOS) (cross-platform CLI /
runtime / safety scanner for Grok agents) uses the cool halide palette;
same structural grammar (lab plates, registration crosses, frequency
curves, monospace-forward type), different temperature.

## Palette — cinnabar

grok-install-v2 uses the **cinnabar** palette from the Residual
Frequencies design system: warm bone-on-near-black with a single
cinnabar-red accent. Cinnabar is the consumer-facing sibling of the
cool halide palette used by `xlOS`.

| Token          | Hex       | Use                                          |
| -------------- | --------- | -------------------------------------------- |
| `--bg`         | `#0a0706` | Warm dark plate background.                  |
| `--bone`       | `#ead5bd` | Primary readable warm-bone on dark.          |
| `--bone-dim`   | `#baa590` | Secondary text, muted labels.                |
| `--bone-faint` | `#7c6c5f` | Hairline rules, dividers, faint UI.          |
| `--grid`       | `#f5e8d8` | Plate grid wash (used at low alpha).         |
| `--accent`     | `#d44936` | Cinnabar red — sole accent. Use sparingly.   |

### Why cinnabar for grok-install-v2

- grok-install-v2 is the public-facing brand surface — the landing site,
  the README hero, the marketplace catalog. Warm cinnabar reads as
  "magazine plate", "specimen sheet", and stays inviting where a cooler
  palette would feel clinical.
- Halide is reserved for `xlOS`, the developer-product sibling. Cinnabar
  keeps the two products visibly distinct without breaking family.
- Of the four RF palettes (amber, cinnabar, halide, parchment), cinnabar
  is the one explicitly tuned for hero and marketing surfaces. Amber
  would have over-warmed; parchment was too quiet for a hero asset;
  halide is too cool for a consumer landing.

## Typography

Same as `xlOS`, for family cohesion across the AgentMindCloud product
line:

- **Instrument Serif**, italic 400 — display / plate titles only.
- **IBM Plex Mono**, regular 400 + bold 700 — body, code, UI labels.

The pre-RF stack (Inter sans + JetBrains Mono dev-mono) is **superseded — do not re-introduce.** Those typefaces are no longer part of the grok-install-v2 type system. The full typography rules (weights, letter-spacing, tabular figures) live alongside the live tokens in [`website/style.css`](../../website/style.css).

## Files

- [`tokens.json`](tokens.json) — design tokens (DTCG format).
- [`colors.css`](colors.css) — CSS custom-properties mirror.
- [`banner.svg`](banner.svg) — small hero variant for in-repo use.
- [`logo-mark.svg`](logo-mark.svg) — square mark.
- [`logo-wordmark.svg`](logo-wordmark.svg) — wordmark only.
- [`social-card.svg`](social-card.svg) — OpenGraph card.

## Source of truth

The full Residual Frequencies design system (all four palettes — amber,
cinnabar, halide, parchment — plus plate templates and banner
generators) lives upstream in the AgentMindCloud brand repository. The
files in this directory are the grok-install-v2-specific subset
(cinnabar palette pointers, brand SVGs).

The grok-install-v2 README hero banner is at
[`../banner.svg`](../banner.svg) (sibling to this directory).
