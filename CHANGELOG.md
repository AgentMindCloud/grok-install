# Changelog

All notable changes to this project are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project
follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

_No unreleased changes._

## [1.0.0] — 2026-05-15

First production release. The `grok-install` ecosystem — manifest spec,
Python validator, Cloudflare Worker, GitHub Action, and VSCode extension —
is now considered stable.

### Added

- `grok-install` Python validator implementing the v2.14 manifest spec.
  Install via the wheel attached to this GitHub Release or
  `pip install git+https://github.com/AgentMindCloud/grok-install`.
- Cloudflare Worker hosting the public mint flow on `workers.dev` — X
  OAuth 2.0 sign-in, one-time GitHub App provisioning via `/setup-app`,
  real X-profile analysis via `/api/analyze-profile`, mascot generation,
  and manifest minting into the user's GitHub account.
- VSCode extension `vscode-grok-yaml` (published as
  `AgentMindCloud.vscode-grok-yaml`) for syntax highlighting and
  validation of `grok-install.yaml` files.
- GitHub Action `grok-install` for validating manifests in CI workflows.
- Hosted landing site at <https://agentmindcloud.github.io/grok-install>
  — three pages (index, standard, templates) rendered in the Cinnabar
  Glass design system with self-hosted Instrument Serif + IBM Plex Mono
  typography, a living drifting-curves background, an interactive
  mint-flow CTA, and full `prefers-reduced-motion` support.
- `spec/v2.14/grok-install.yaml` — canonical example manifest validating
  against `spec/v2.14/schema.json`.
- Tag-driven release automation in `.github/workflows/release.yml`:
  pushing `v*.*.*` builds wheels (Python 3.11 + 3.12), packages the
  VSIX, deploys the Worker, and creates a GitHub Release with all
  artifacts attached.
- Comprehensive Cloudflare Worker deployment runbook
  (`worker/DEPLOY.md`) covering authentication, KV namespace setup,
  runtime secrets, CI integration, verification, and troubleshooting.

### Changed

- Promoted the Python package classifier from
  `Development Status :: 3 - Alpha` to `5 - Production/Stable`.
- Added `Documentation` URL plus `Environment :: Console` and
  `Intended Audience :: Developers` classifiers for a complete PyPI
  project page (note: PyPI publish itself is deferred — see
  `RELEASING.md`).
- Worker `/api/analyze-profile` now fetches real X posts via
  `xGetUserPosts` before LLM analysis, replacing the earlier
  hallucinated-profile path.
- Adopted the Cinnabar Glass design system across the brand kit,
  banner, website, VSCode extension, and docs.
- `assets/brand/README.md` updated to document the Cinnabar palette and
  Instrument Serif / IBM Plex Mono typography (was stale Inter /
  JetBrains Mono).
- Worker `/health` endpoint now sources its `version` field from
  `worker/package.json` rather than a hardcoded string, so future
  Worker version bumps only need one edit.

### Fixed

- Cloudflare Worker first-deploy blockers: schema bundling path,
  missing dependencies, and `wrangler.toml` metadata.
- `GROK_INSTALL_KV` namespace binding enabled in `worker/wrangler.toml`
  — the Worker no longer 500s on the first KV-touching request.
- Banner wordmark bloom artifact replaced with a halo filter and a 1px
  metallic stroke for sharper rendering at all scales.

### Removed

- Stale `REPLACE_WITH_KV_NAMESPACE_ID` and `PASTE_KV_NAMESPACE_ID_HERE`
  placeholders and the one-time KV-setup procedure block from
  `worker/wrangler.toml`, `worker/README.md`, `worker/DEPLOY.md`, and
  `RELEASING.md` (the binding is now live in `wrangler.toml`; fork
  instructions point to `DEPLOY.md` §3).

[Unreleased]: https://github.com/AgentMindCloud/grok-install/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/AgentMindCloud/grok-install/releases/tag/v1.0.0
