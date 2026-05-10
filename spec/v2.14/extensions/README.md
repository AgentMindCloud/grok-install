# extensions/

## Defined `extensions:` blocks per DECISIONS.md D5

The `extensions:` block on a v2.14 manifest is optional. Parsers without extension support ignore unknown top-level keys, so manifests using these stay backward-compat with vanilla v2.14 parsers.

| Block | Purpose |
|---|---|
| `extensions.constitution` | List of article references (constitution-scanner integration) |
| `extensions.multi_agent_roles` | Role declarations for super-agents that coordinate multiple sub-agents |
| `extensions.provenance` | Citation and confidence configuration (provenance-trust agent) |
| `extensions.demo_metadata` | Video / storyboard URLs and demo metadata |
| `extensions.x_money_specific` | Cost caps + tax disclaimer config for X Money / finance-app templates |

v2.15 RFC for additional blocks is deferred post-launch per D5. Field schemas land in `spec/v2.14/extensions/<block>.schema.json` during Phase 2b.

Status: PLACEHOLDER (Phase 2b — field schemas, validator wiring, examples).
