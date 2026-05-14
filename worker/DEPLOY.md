# Deploying the grok-install Cloudflare Worker

This is the deployment runbook for the `grok-install` Cloudflare Worker. It assumes you manage this repo through Claude Code and the GitHub UI rather than from a local terminal.

## 1. Overview

The `grok-install` Worker hosts the "install this" mint flow for any `grok-install.yaml` manifest. It calls the xAI Grok API, performs X/Twitter OAuth 2.0, and optionally provisions a GitHub App at runtime via the `/setup-app` endpoint, which writes the resulting credentials into KV under the key `gh-app:credentials`.

At runtime it needs:

- One **KV namespace** bound as `GROK_INSTALL_KV` (see `worker/wrangler.toml`).
- Three **wrangler secrets**: `XAI_API_KEY`, `X_CLIENT_ID`, `X_CLIENT_SECRET`. GitHub App credentials are NOT wrangler secrets — they live in KV after a one-time `/setup-app` flow.
- Public vars baked into `worker/wrangler.toml` (`PRODUCT_NAME`, `GITHUB_OWNER_ORG`, `PUBLIC_BASE_URL`). Note that `PUBLIC_BASE_URL` points at the GitHub Pages site, NOT at the Worker itself — the Worker lives at its own `workers.dev` URL.

The recommended deploy path is the **tag-driven CI job** (`deploy-worker` in `.github/workflows/release.yml`). Push a `v*.*.*` tag and CI handles the rest. The manual path below exists so you can verify wiring once before relying on CI.

## 2. Prerequisites

You need accounts and credentials in four places before you can deploy:

| What | Where to get it | Used as |
|------|-----------------|---------|
| Cloudflare account with Workers enabled | <https://dash.cloudflare.com/sign-up/workers> | Hosting platform |
| GitHub repo admin access | The repo's `Settings` tab | To add Actions secrets |
| xAI API key | <https://console.x.ai/> → API Keys | `XAI_API_KEY` secret |
| X/Twitter OAuth 2.0 app (client id + secret) | <https://developer.x.com/en/portal/dashboard> → Projects & Apps → your app → Keys and tokens → OAuth 2.0 Client ID and Client Secret | `X_CLIENT_ID` and `X_CLIENT_SECRET` secrets |

You will also need to know your Cloudflare account id. You can copy it from the Cloudflare dashboard sidebar of any zone, or from the URL of <https://dash.cloudflare.com/> when logged in.

## 3. One-time setup on Cloudflare

> **For the AgentMindCloud production deployment, the KV namespace (§3.2 / §3.3) is already configured in `worker/wrangler.toml`.** The three runtime secrets (§3.4) still need to be set on the target Cloudflare account before the first deploy. The KV sections below are preserved for forks or anyone re-deploying into a different Cloudflare account.

You must complete the remaining steps in this section **before any first deploy** into a new Cloudflare account, manual or CI. CI cannot do these for you — it only runs `wrangler deploy`. If you skip §3.4 the Worker will deploy successfully but every request will 500 because the runtime secrets will be undefined.

If you have done this before for this Cloudflare account, skip to section 4 or 5.

### 3.1. Authenticate wrangler

Wrangler picks up credentials in one of two ways. Pick whichever fits how you're working.

**Option A — `wrangler login` (browser flow, easiest from a desktop):**

```
cd worker
npx wrangler login
```

Wrangler opens a browser tab; click Authorize. The token is cached in your home directory.

**Option B — `CLOUDFLARE_API_TOKEN` env var (works from any shell, no browser):**

Create the API token first (instructions in section 5.2 below — same token is reused by CI), then export it before running any wrangler command:

```
export CLOUDFLARE_API_TOKEN=<your-cloudflare-api-token>
export CLOUDFLARE_ACCOUNT_ID=<your-cloudflare-account-id>
```

The `CLOUDFLARE_ACCOUNT_ID` is only required if `worker/wrangler.toml` does not pin `account_id` — which is the default in this repo (see section 3.5).

### 3.2. Create the KV namespace (fork / fresh account only)

> **Already done for the AgentMindCloud production deployment.** The namespace exists in the production Cloudflare account and its id is committed in `worker/wrangler.toml`. Skip to §3.4 unless you are deploying into a different Cloudflare account.

From the repo root:

```
cd worker
npx wrangler kv namespace create GROK_INSTALL_KV
```

Wrangler will print a success message containing a config snippet with the new namespace id. The exact format varies by Wrangler version — Wrangler v4 prints a JSON-style snippet (intended for `wrangler.jsonc`), and older versions printed TOML. Either way, the value you need is the same: a 32-character lowercase hex string after `id`. The v4 output looks roughly like:

```
🌀 Creating namespace with title "grok-install-GROK_INSTALL_KV"
✨ Success!
Add the following to your configuration file in your kv_namespaces array:
{
  "kv_namespaces": [
    { "binding": "GROK_INSTALL_KV", "id": "abc123def4567890abc123def4567890" }
  ]
}
```

**Copy just the `id` value** (the 32-char hex string, not the surrounding braces or brackets). It is unique to your Cloudflare account and cannot be regenerated without losing data.

> Shortcut: passing `--update-config` to `wrangler kv namespace create` makes wrangler edit your config file for you. The project ships `wrangler.toml`, so wrangler will append a `[[kv_namespaces]]` block at the bottom of the file. You'll still want to move the block into the position shown in section 3.3 (and delete the commented placeholder lines) so the file stays tidy, but it saves you a copy-paste.

### 3.3. Update `worker/wrangler.toml` with the real KV id (fork / fresh account only)

> **Already done for the AgentMindCloud production deployment.** The live binding is committed in `worker/wrangler.toml`.

Open `worker/wrangler.toml`. The active binding looks like this:

```toml
[[kv_namespaces]]
binding = "GROK_INSTALL_KV"
id = "11d7541c50c84a83ae02891e9e908726"
```

If you are deploying into your own Cloudflare account, replace the `id` value with the one wrangler printed in §3.2. Do not commit a real id from someone else's account.

Save the file. Commit and push the change on your fork so CI uses the same id.

### 3.4. Set the three runtime secrets

Secrets are written directly into Cloudflare and are NOT stored anywhere in this repo. From `worker/`:

```
npx wrangler secret put XAI_API_KEY
```

Wrangler will prompt:

```
Enter a secret value: 
```

Paste the value and press Enter. Repeat for the other two:

```
npx wrangler secret put X_CLIENT_ID
npx wrangler secret put X_CLIENT_SECRET
```

Confirm all three were stored:

```
npx wrangler secret list
```

You should see three entries with type `secret_text`. The values themselves are never readable after they are set — wrangler only shows the names.

> If you rotate any of these values later, just re-run `npx wrangler secret put <NAME>`. The new value takes effect immediately for new requests; there is no redeploy needed.

### 3.5. Choose how Cloudflare resolves your account id

There are two ways to tell wrangler which Cloudflare account to deploy into:

1. **Pin it in `worker/wrangler.toml`** by uncommenting and editing this line:

   ```toml
   account_id = "<your-cloudflare-account-id>"
   ```

2. **Rely on the `CLOUDFLARE_ACCOUNT_ID` env var.** This is the default in the repo and is what CI uses (see `.github/workflows/release.yml`, the `deploy-worker` job, which exports `CLOUDFLARE_ACCOUNT_ID` from the repo secret of the same name).

Pick exactly one. If you pin it in `wrangler.toml` AND set the env var, wrangler will use the file. For local manual deploys either works; for CI, the env-var approach is already wired up — do not change `wrangler.toml` to a pinned id unless you also update CI.

## 4. Manual deploy (verifies everything is wired up)

Run this once after section 3 to confirm bindings + secrets resolve correctly. After that, use CI (section 5) for every release.

From the repo root:

```
cd worker
npm install
```

Then dry-run to inspect what wrangler will publish:

```
npx wrangler deploy --dry-run
```

Success looks like:

```
 ⛅️ wrangler 4.91.0
───────────────────
Total Upload: ~493 KiB / gzip: ~102 KiB
Your Worker has access to the following bindings:
Binding                                                         Resource
env.GROK_INSTALL_KV (<id-from-step-3.2>)                        KV Namespace
env.PRODUCT_NAME ("grok-install")                               Environment Variable
env.GITHUB_OWNER_ORG ("AgentMindCloud")                         Environment Variable
env.PUBLIC_BASE_URL ("https://agentmindcloud.github.io/grok...")  Environment Variable

--dry-run: exiting now.
```

If the KV binding line is missing from this list, section 3.2 / 3.3 is incomplete. Note that `--dry-run` only compiles and inspects local config — it does **not** contact Cloudflare, so it will **not** show wrangler-stored secrets in the binding list and cannot confirm that section 3.4 is done. To verify the three secrets exist, run `npx wrangler secret list` separately (it queries Cloudflare and prints the names of secrets currently set on this Worker). A real `npx wrangler deploy` will surface a missing secret only at runtime, not at deploy time.

When the dry-run looks correct, deploy for real:

```
npx wrangler deploy
```

Success looks like:

```
Total Upload: ~XX KiB / gzip: ~XX KiB
Uploaded grok-install (~Xs)
Deployed grok-install triggers (~Xs)
  https://grok-install.<your-subdomain>.workers.dev
Current Version ID: ...
```

The deployed URL is your Worker. Because `workers_dev = true` in `worker/wrangler.toml`, Cloudflare automatically gives the Worker a public `workers.dev` hostname; you do not need to configure a custom domain to test it.

## 5. Automated deploy via GitHub Actions (recommended)

Every tag push of the form `v*.*.*` triggers `.github/workflows/release.yml`. The job that handles the Worker is `deploy-worker`. It runs `npx wrangler deploy` inside the `worker/` directory and uses the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repo secrets.

### 5.1. Tagging a release

From your local clone (or the GitHub UI's "Create a new release" form, which can create a tag for you):

```
git tag v1.0.0
git push origin v1.0.0
```

The workflow starts immediately. Watch it under the repo's `Actions` tab.

### 5.2. Required repo secrets

Add these in `Settings → Secrets and variables → Actions → New repository secret`:

| Secret name | Value | How to obtain |
|-------------|-------|---------------|
| `CLOUDFLARE_API_TOKEN` | A Cloudflare API token with permission to edit Workers | <https://dash.cloudflare.com/profile/api-tokens> → "Create Token". Use the **"Edit Cloudflare Workers"** template, or a custom token with at minimum: `Account → Workers Scripts → Edit`, `Account → Workers KV Storage → Edit`, and `Account → Account Settings → Read`. |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account id | Visible in the URL bar of <https://dash.cloudflare.com/> after login, or in the sidebar of any zone. |

Token scope: pick "All accounts" if you only have one, or restrict it to the specific account you'll deploy into. Same for zone resources — leave at "All zones" or restrict as you prefer. The token does **not** need any zone permissions; it only operates on the account.

Save each secret. They are write-only — once stored, GitHub will not show you the value again.

### 5.3. What CI does and does NOT do

The `deploy-worker` job uses a skip-if-absent pattern:

- If both `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are set, it deploys the Worker.
- If either is missing, the job runs but logs `CLOUDFLARE_API_TOKEN or CLOUDFLARE_ACCOUNT_ID not configured — skipping Worker deploy.` and exits cleanly. The rest of the release pipeline (wheels, vsix, GitHub Release) is unaffected.

> **Important — CI does NOT bootstrap your Cloudflare account.** The KV namespace binding is already committed in `worker/wrangler.toml`, so CI does not need to create one for the AgentMindCloud production deployment. CI does **not** set the three runtime secrets (`XAI_API_KEY`, `X_CLIENT_ID`, `X_CLIENT_SECRET`) — complete §3.4 on the target Cloudflare account before the first tag push, or the deploy will succeed but the live Worker will return 500s on every endpoint that calls xAI / X. Forks deploying into a fresh Cloudflare account must also complete §3.2 / §3.3.

## 6. Verification and smoke tests

After any deploy (manual or CI), confirm the Worker is live and the bindings resolved.

### 6.1. Health check

From the GitHub Actions logs of the `deploy-worker` job — or from any shell that has `curl` — hit the root path:

```
curl -i https://grok-install.<your-subdomain>.workers.dev/
```

Expected response (handled by `handleHealth` in `worker/src/handlers/api.js`):

```
HTTP/2 200
content-type: application/json
...

{"ok":true,"name":"grok-install","version":"1.0.0","time":"2026-..."}
```

If you get a 1101 / 1102 / 1042 Cloudflare error page instead of JSON, the deploy succeeded but the Worker is crashing at startup — section 3 is incomplete. Jump straight to section 7.

Note: do **not** use `PUBLIC_BASE_URL` (set in `worker/wrangler.toml`) as the Worker URL — that variable is the GitHub Pages site that links INTO this Worker. The Worker itself lives at its `workers.dev` hostname (or a custom route you configure later).

### 6.2. Live logs

Stream logs while you poke the Worker:

```
cd worker
npx wrangler tail
```

You'll see each request and any thrown errors. Hit `Ctrl+C` to stop.

### 6.3. GitHub App provisioning

The `/setup-app` endpoint exists for the one-time GitHub App registration flow (see `worker/src/handlers/manifest.js`). The first time you set up this Worker in a new Cloudflare account, open it in a browser:

```
https://grok-install.<your-subdomain>.workers.dev/setup-app
```

You'll see a page with two buttons — "Register on AgentMindCloud org" and "Register on personal account". Pick the one that matches where the `GITHUB_OWNER_ORG` (currently `AgentMindCloud`) lives. GitHub will redirect you through its App registration flow and POST back to `/api/manifest-callback`, which persists the credentials in KV under `gh-app:credentials`. After that, the mint flow can create repos on your behalf.

You only do this once per Cloudflare account. After credentials are in KV, re-deploys do not affect them.

### 6.4. Full route list

For other endpoints (mint, dashboard, OAuth start/callback, etc.) see `worker/src/index.js` for the full route list. Smoke-testing those requires a real session cookie and is out of scope for a deploy check.

## 7. Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `Error: You are not authenticated.` from wrangler | No Cloudflare credentials available | Run `npx wrangler login`, **or** export `CLOUDFLARE_API_TOKEN` (section 3.1). |
| `Error: More than one account available...` | `account_id` not pinned and no `CLOUDFLARE_ACCOUNT_ID` env var | Either uncomment `account_id` in `worker/wrangler.toml` or export `CLOUDFLARE_ACCOUNT_ID` (section 3.5). |
| `Error: KV namespace 'GROK_INSTALL_KV' is not valid` (or similar binding error at deploy time) | Section 3.2 / 3.3 incomplete or the id in `worker/wrangler.toml` doesn't exist in this account | Re-run `npx wrangler kv namespace create GROK_INSTALL_KV` and paste the new id into `worker/wrangler.toml`. |
| Deploy succeeds, but live requests return 500 with `XAI_API_KEY` or `X_CLIENT_*` in the error | Secrets are not set in **this** Cloudflare account | Re-run section 3.4. Secrets are per-account; if you deployed into a new account, you must set them again there. |
| Live requests return 500 mentioning `GROK_INSTALL_KV` | KV binding present in `wrangler.toml` but the id refers to a deleted namespace | Re-create the namespace (section 3.2) and update the id (section 3.3). |
| Actions tab shows `deploy-worker` ran but skipped with message `CLOUDFLARE_API_TOKEN or CLOUDFLARE_ACCOUNT_ID not configured — skipping Worker deploy.` | One or both repo secrets are missing | Add them under `Settings → Secrets and variables → Actions` (section 5.2). |
| `wrangler.toml ... unknown field 'kv_namespaces'` (or similar parse error) | Indentation / TOML syntax broke when you replaced the commented block | The block must be at the top level, not inside `[vars]`. The lines `[[kv_namespaces]]`, `binding = "GROK_INSTALL_KV"`, `id = "..."` must all start at column 1 with no leading `#`. Compare against the snippet in section 3.3. |
| `/setup-app` shows the form but `/api/manifest-callback` errors on submit | KV not writable, or the redirect URL doesn't match the Worker's actual origin | Confirm `GROK_INSTALL_KV` binding is healthy (section 6.1). Make sure you opened `/setup-app` on the Worker's `workers.dev` URL, not on `PUBLIC_BASE_URL`. |
| New tag pushed but no `deploy-worker` job appears in Actions | Tag does not match `v*.*.*` (e.g. `1.0.0` without the leading `v`, or `v1.0`) | Delete the tag, re-tag as `v1.0.0`, push again. The trigger is `refs/tags/v*.*.*`. |

For anything else, run `npx wrangler tail` (section 6.2) and reproduce the failing request — the error will be logged with a stack trace, and a copy is also persisted to KV under the key `error:<timestamp>` for 7 days (see `persistError` in `worker/src/index.js`).
