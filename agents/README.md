# agents/

Catalog of bundled agent manifests, organized by category:

- [`simple/`](simple/) — single-purpose agents.
- [`creator/`](creator/) — content/code creation agents.
- [`finance/`](finance/) — finance agents (carry the `finance-app` certification badge per DECISIONS.md Q4).
- [`super/`](super/) — orchestrated super-agents.

Manifest schema is locked at v2.14 per DECISIONS.md D5. Validate any manifest with `grok-install validate <path>`.

Browse the bundled catalog with `grok-install list-agents agents/` — table by default, `--json` for machine-readable output, `--target <name>` to filter by deploy target. A hosted, browsable marketplace launches with v1.0.

Status: `simple/` populated (10 agents); `creator/`, `finance/`, `super/` migration in progress.
