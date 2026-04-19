# Changelog

All notable changes to the `grok-install` open standard are documented here.

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) for
the spec itself (e.g. `v2.12` → `v2.13` is a minor-but-breaking spec bump).

## [Unreleased]

### Changed

- README rewritten to reflect the Python CLI distribution: install via
  `pip install grok-install-cli` or `uv pip install grok-install-cli`
  (the `npm`-style wording is gone).
- README now documents the 14 `grok-yaml-standards v2.0` specs that plug into
  the `.grok/` folder.
- README links to the VS Code extension (`grok-install-vscode`) and GitHub
  Action (`grok-install-action`).

### Added

- `CHANGELOG.md` (this file).
- `DISCLAIMER.md` covering safety-scan boundaries and liability.

## [2.13.0] - 2026-04-10

### Added

- `tools[].parameters` is now **required** with full JSON Schema shape.
- `tools[].returns` describes tool return types.
- `structured_output` block — Pydantic-compatible response schemas.
- `parallel_tool_calls` — enable concurrent tool execution.
- `tool_choice` — `auto` | `required` | named tool.
- `rate_limits` block — per-tool QPS and daily caps.
- `cost_limits` block — hard USD stops per request / day / month with
  `on_limit` actions (`block`, `warn`, `degrade`).
- `telemetry` block — opt-in anonymous usage events.
- JSON Schema published at `schemas/grok-install-v2.13.schema.json`.
- Migration guide: [docs/migration/v2.12-to-v2.13.md](docs/migration/v2.12-to-v2.13.md).

### Changed

- `version` must be exactly `"2.13"`.
- Name-only tool syntax (`tools: ["post_thread"]`) is no longer valid — run
  `grok-install migrate --from 2.12 --to 2.13` to auto-upgrade.

### Deprecated

- `intelligence_layer.function_calling` (implicit now that `tools[]` carries
  full schemas). Will be removed in v3.0.

## [2.12.0] - 2026-02-18

### Added

- Native X agent runtime (`x_native_runtime` block): reply-bot, dm-handler,
  trend-monitor, custom.
- Grok intelligence layer: function calling, real-time tools, multi-agent
  swarm, Grok-coordinated handoffs, AI-suggested teams.
- Trust & reputation block: public score, verified-by-Grok, scan history,
  automated recommendations.
- Passive growth engine (`promotion` block): auto-welcome, auto-share,
  weekly highlight, builder credits, support links.

### Changed

- Most `llm.*` fields are now optional — `provider`, `model`, and
  `api_key_env` are the only hard requirements.

## [2.10.0] - 2025-11-02

### Added

- Enhanced Safety & Verification 2.0: `safety.pre_install_scan`,
  `minimum_keys_only`, scan-summary visibility, "Verified by Grok" badge.
- Orchestration block: role, triggers, visual builder, AI-suggested patterns.

## [2.0.0] - 2025-08-15

### Added

- First public release of the `grok-install.yaml` standard.
- `grok-install-cli` published to PyPI.
- Reference landing page and gallery at
  <https://agentmindcloud.github.io/grok-install>.

[Unreleased]: https://github.com/agentmindcloud/grok-install/compare/v2.13.0...HEAD
[2.13.0]: https://github.com/agentmindcloud/grok-install/compare/v2.12.0...v2.13.0
[2.12.0]: https://github.com/agentmindcloud/grok-install/compare/v2.10.0...v2.12.0
[2.10.0]: https://github.com/agentmindcloud/grok-install/compare/v2.0.0...v2.10.0
[2.0.0]: https://github.com/agentmindcloud/grok-install/releases/tag/v2.0.0
