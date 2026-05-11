# Releasing grok-install

## What this covers

Tag pushes matching `v*.*.*` trigger `.github/workflows/release.yml`, which:

1. Builds the `grok-install` validator wheel on Python 3.11 and 3.12.
2. Builds the VSCode extension `.vsix`.
3. Publishes the `.vsix` to the VSCode Marketplace (skip-if-absent on `VSCE_PAT`).
4. Deploys the Cloudflare Worker via `wrangler` (skip-if-absent on `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`).
5. Creates the GitHub Release with generated notes and attaches the wheel + sdist + `.vsix` files.

**No PyPI publish in v1.0.** The validator is consumed as a Git dependency or
via the wheel attached to each GitHub Release. (A separate `publish-pypi.yml`
workflow exists in this repo and would fire on the `release: published` event
when this workflow creates a GitHub Release; disable it before the first tag
if PyPI publish is not yet intended for this repo.)

## Required repository secrets

Set in **Settings → Secrets and variables → Actions**:

| Secret | Required for | How to get |
|---|---|---|
| `VSCE_PAT` | VSCode Marketplace `.vsix` publish | Sign in at https://marketplace.visualstudio.com/manage → "Personal Access Tokens" → create a token with Marketplace scope `Acquire` + `Manage`. Paste the value into the repo secrets page. |
| `CLOUDFLARE_API_TOKEN` | Worker deploy via wrangler | https://dash.cloudflare.com/profile/api-tokens → "Create Token" → use the "Edit Cloudflare Workers" template, scope to the relevant account. |
| `CLOUDFLARE_ACCOUNT_ID` | Worker deploy (required because `worker/wrangler.toml` does not pin `account_id`) | https://dash.cloudflare.com/ → right sidebar under your account → "Account ID". |

If a secret is unset, the corresponding job logs a skip message and the rest
of the release continues. `build-wheels`, `build-vsix`, and `attach-to-release`
always run.

## Cutting a release

1. Bump `version` in `pyproject.toml` and `extensions/vscode/package.json`.
   Bump `worker/wrangler.toml` only if you also want to mark the worker
   version explicitly (the deploy uses the current source either way).
2. Commit: `git commit -am "chore: bump version to vX.Y.Z"`
3. Tag: `git tag vX.Y.Z -m "vX.Y.Z"`
4. Push: `git push origin main && git push origin vX.Y.Z`
5. Watch the workflow at https://github.com/AgentMindCloud/grok-install-v2/actions
   or via `gh run watch`. Expected jobs:
   - `build-wheels` (2 matrix cells: py3.11, py3.12)
   - `build-vsix`
   - `publish-vsix` (conditional on `VSCE_PAT`)
   - `deploy-worker` (conditional on Cloudflare secrets)
   - `attach-to-release`

## Verifying the release succeeded

- The GitHub Release page for the tag shows generated notes and attached files:
  two `.whl` files (one per Python version), an sdist `.tar.gz`, and the `.vsix`.
- VSCode Marketplace: if `VSCE_PAT` was set, the new version appears at
  https://marketplace.visualstudio.com/items?itemName=AgentMindCloud.vscode-grok-yaml
  within a few minutes of `publish-vsix` completing.
- Cloudflare Worker: if `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` were
  set, `npx wrangler deployments list` from `worker/` shows the new deployment,
  and the Worker URL responds with the new code.
- All Actions jobs are green (or expected skips are logged for missing secrets).

## Rolling back

- Delete the GitHub Release: `gh release delete vX.Y.Z`
- Delete the tag locally and remotely:
  `git tag -d vX.Y.Z && git push --delete origin vX.Y.Z`
- Cloudflare Worker: re-deploy the previous tag by checking out the prior tag
  and running `npx wrangler deploy` from `worker/`, or use the Cloudflare
  dashboard to roll back to a previous deployment.
- VSCode Marketplace: a published version cannot be deleted. Bump the patch
  number and publish a corrected `vX.Y.(Z+1)`.

## Pre-launch checklist

One-time, before the first tag push:

- [ ] `VSCE_PAT` added to Settings → Secrets and variables → Actions
- [ ] `CLOUDFLARE_API_TOKEN` added
- [ ] `CLOUDFLARE_ACCOUNT_ID` added
- [ ] `extensions/vscode/package.json` `publisher` field set (already set to
      `AgentMindCloud` at the time of this writing)
- [ ] `worker/wrangler.toml` `kv_namespaces[].id` replaced from
      `REPLACE_WITH_KV_NAMESPACE_ID` to the real KV namespace id (and any
      other binding ids that may have been added)
- [ ] (Optional) Environments `vscode-marketplace` and `cloudflare-production`
      configured at Settings → Environments with required-reviewer gates if
      manual approval before each publish is desired.
