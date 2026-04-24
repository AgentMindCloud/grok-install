# Changelog

All notable changes to the `grok-install` open standard are documented here.

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) for
the spec itself (e.g. `v2.12` → `v2.13` is a minor-but-breaking spec bump).

## [Unreleased]

### Added

- `CHANGELOG.md` (this file).
- `DISCLAIMER.md` covering safety-scan boundaries and liability.

## [2.14.0] - 2026-04-24

### Added

- Optional `visuals` block: branded dark-premium install surface
  (`accent_color`, `preview_card`, animated `install_flow` step track,
  demo media + auto-generation, post-install mini-dashboard with
  accessibility controls, `theme.auto_adapt`, alt-text templating).
- v2.14 JSON Schema at `schemas/v2.14/schema.json` (draft 2020-12).
- Flagship example: `examples/janvisuals/grok-install.yaml`.
- Migration guide: [docs/migration/v2.13-to-v2.14.md](docs/migration/v2.13-to-v2.14.md).
- Reference documentation: [docs/v2.14/visuals.md](docs/v2.14/visuals.md).

### Changed

- Root `grok-install.yaml` bumped to `2.14`; internal "Phase N"
  planning language removed from the user-facing template.
- v2.13 examples explicitly labelled as back-compat fixtures; v2.14 is
  purely additive, so v2.13 YAML still validates under v2.14 tooling.
- Install counts in `featured-agents.json` and `trending.json` reset
  to 0 pending a real telemetry source.
- `.gitignore` cleaned up (stray shell commands removed, env/secret
  patterns expanded).

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
