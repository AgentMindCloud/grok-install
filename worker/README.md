# Cloudflare Worker

The hosted mint flow for grok-install agents. Powers the "install this" web UI for any grok-install.yaml manifest.

## Local dev

    cd worker
    npm install
    npx wrangler dev

## Deploy

Deployment will be wired in `.github/workflows/release.yml`. Manual deploy:

    npx wrangler deploy

## Secrets required

- `XAI_API_KEY` — Bearer token for the xAI API
- `X_CLIENT_ID` — X/Twitter OAuth 2.0 client id
- `X_CLIENT_SECRET` — X/Twitter OAuth 2.0 client secret

Set via `npx wrangler secret put <NAME>` or repo Settings → Secrets and variables → Actions.

The Worker binds a KV namespace as `GROK_INSTALL_KV`; the binding is already configured in `wrangler.toml` for the AgentMindCloud production deployment. For forks or fresh Cloudflare accounts, see [`DEPLOY.md`](./DEPLOY.md) §3 for the one-time namespace setup. GitHub App credentials are not wrangler secrets — they are provisioned at runtime via the `/setup-app` endpoint and stored in KV.

## Schema reference

The Worker validates incoming manifests against `../spec/v2.14/schema.json`. Schema updates flow through on next deploy.
