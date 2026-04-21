# janvisuals — flagship v2.14 example

This example exercises every field in the new `visuals` block introduced in
v2.14. It is the reference implementation used by the gallery to render the
dark-premium install surface.

## What it shows

- `accent_color` driven by the brand cyan `#00F0FF`
- `preview_card.style: "futuristic"` with four stat panels
- `install_flow` with a four-step animated track
- `demo_media` pointing at a pre-recorded MP4 (no auto-generation)
- `post_install.mini_dashboard` with animations, haptics, and reduce-motion
  respect
- `theme.auto_adapt` enabled so the gallery card follows the viewer's
  light/dark preference
- `accessibility.alt_text_template` that populates from `{{name}}`,
  `{{description}}`, and `{{category}}`

## Preview locally

```bash
grok-install preview examples/janvisuals/grok-install.yaml
```

Or validate the file against the v2.14 schema:

```bash
ajv validate \
  -s schemas/v2.14/schema.json \
  -d examples/janvisuals/grok-install.yaml \
  --spec=draft2020 -c ajv-formats
```

## Brand palette

| Token | Hex | Usage |
|---|---|---|
| Canvas | `#0A0A0A` | Card background |
| Primary | `#00F0FF` | Accent strokes, focus rings, CTA |
| Secondary | `#00FF9D` | Success pulse, dashboard sparkline |

All three clear WCAG AA on the `#0A0A0A` canvas.
