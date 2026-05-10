# marketplace/

Next.js 15 storefront for the grok-install agent catalog.

## Architecture

The catalog is loaded **at build time**, not runtime. The `prebuild` (and `predev`) scripts shell out to `grok-install list-agents --json <agents-dir>` and write the result to `.catalog.json` (gitignored). Pages then statically render from that JSON.

Failure modes:
- `grok-install` not on `PATH` → prebuild fails loud.
- Any agent fails schema validation → `list-agents` exits 2 → prebuild fails loud.

## Local development

```bash
# From the repo root, install the CLI:
pip install -e ".[dev]"

# Then in marketplace/:
cd marketplace
npm ci
npm run dev
```

`npm run dev` triggers `predev` which fetches the catalog. Re-run after modifying anything under `agents/`.

## Build

```bash
npm run build
```

Same prebuild hook fires; the production output lands in `.next/`.

## Stack

- Next.js 15 (app router) + React 18 + TypeScript (strict).
- Tailwind CSS v3.
- Brand tokens mirror [`../brand/tokens.json`](../brand/tokens.json) — cyan primary, green secondary, black background. `#FF2D55` is reserved for xlOS and is not used here.

## Out of scope (later sub-PRs)

- Runtime catalog fetching (currently build-time only).
- Submission / upload flows.
- Deployment config (Vercel / Hostinger wiring).
- Auth, accounts, ratings, comments.
