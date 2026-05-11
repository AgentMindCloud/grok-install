# Changelog

Changelog auto-generated from GitHub releases starting v1.0.0.

## [Unreleased]

### Added

- worker/ — Cloudflare Worker for the hosted mint flow (folded in from
  legacy grok-install per Phase 2a Step 7; closes Gap #2 from PR #10
  audit). Deploy automation wired in Phase 4.
- `spec/v2.14/grok-install.yaml` — canonical example manifest validating
  against `spec/v2.14/schema.json` (closes Gap #1 from Phase 2a Step 6
  oversight).

### Changed

- Landing site upgraded to Residual Frequencies design system (cinnabar
  palette). Three pages (index, standard, templates) rebuilt with premium dark
  theme, living drifting-curves background, interactive mint-flow CTA on
  landing, self-hosted Instrument Serif + IBM Plex Mono fonts. Respects
  `prefers-reduced-motion`.
- `assets/brand/README.md` — now documents the Residual Frequencies
  cinnabar palette and Instrument Serif / IBM Plex Mono typography
  shipped in #10 (was stale Inter / JetBrains Mono; closes Gap #4).
