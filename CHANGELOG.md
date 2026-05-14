# Changelog

Notable changes between releases. v1.0.0 is the first tagged release.

## [Unreleased]

### Added

- `DESIGN_SYSTEM.md` at repo root — single source of truth for Cinnabar
  Glass. Documents tokens, surfaces, components, and cross-repo ownership.
- `assets/brand/README.md` — entry point that maps the brand artifacts.
- `extensions/vscode/icon.svg` — Cinnabar Glass icon source for the VSCode
  extension. Rasterize to `icon.png` before publishing to Marketplace.
- `worker/` — Cloudflare Worker for the hosted mint flow. Deploy automation
  wired in the release workflow.
- `spec/v2.14/grok-install.yaml` — canonical example manifest validating
  against `spec/v2.14/schema.json`.

### Changed

- **Worker profile analysis is now real.** `/api/analyze-profile` previously
  fed Grok only the bare X handle and returned a hallucinated personality.
  It now fetches up to 50 of the authenticated user's recent original posts
  via X API v2 (`/2/users/:id/tweets?exclude=retweets,replies`), caches them
  in KV for 10 min so rerolls don't burn quota, and passes them to grok-4
  as structured JSON. Failure modes are explicit:
  - X 401 (token expired) → 401 + `reconnect_x_url` to re-auth.
  - X 403/404 (protected / deleted) → 422 `x_account_unavailable`.
  - X 429 (rate limited) → 200 degraded with `retry_after_s` + `Retry-After`.
  - X 5xx / network → 200 degraded handle-only with `posts_source: handle_only`.
  - Grok failures → `safeProfileDefaults` / `safeSampleReply`.
  Response shape adds `posts_analyzed`, `posts_source`, `degraded`,
  `degraded_reason` (additive, non-breaking). `MAX_SAMPLE_REROLLS` is now
  enforced and a 10 s per-session debounce is added.
- **Design system migrated from Residual Frequencies (Instrument Serif +
  warm bone tones) to Cinnabar Glass (Geist + IBM Plex Mono, deep-void
  glass surfaces, cinnabar → amber-glow gradient).** Replaces every public
  surface: `website/` (style.css and all three HTML pages), worker-rendered
  HTML (`/setup-app`, `/api/manifest-callback`), the specimen-plate SVG,
  mkdocs Material theme (`docs/docs/stylesheets/extra.css` + palette in
  `docs/mkdocs.yml`), GitHub Action badge SVG, docs logo and favicon, and
  the Monaco playground theme.
- `assets/brand/tokens.css` + `assets/brand/tokens.json` expanded with the
  full token set (colors, gradients, atmosphere, radii, shadows, blur).
- `website/*.html` pages now ship OpenGraph + Twitter Card meta + canonical
  URLs, and the banner/favicon paths resolve in both local dev and Pages.
- `templates/community/trend-to-thread.yaml` retuned to the Cinnabar Glass
  palette.
- `extensions/vscode/snippets/grok-install.json` — example brand colors
  in the install-document snippet now use Cinnabar Glass tokens.
