# grok-install Specification (v2.0)

## Overview
`grok-install.yaml` is an open standard that lets any developer make their AI agent installable in one click through Grok on X.

## File Location
Must be placed at the root of your repository: `grok-install.yaml`

## Simple vs Advanced Mode (new in v2.0)
- `mode: "simple"` (default) → Grok handles everything with maximum hand-holding
- `mode: "advanced"` → Full control for experienced users

## New Fields (v2.0)
- `category`: string (e.g. "telegram", "twitter", "discord")
- `tags`: array of strings
- `ecosystem`: "grok" | "x" | "tesla" | "starlink" | null (enables special quick-deploy for official ecosystem repos)
- `update_strategy`: "semver" | "always"
- `preferred_deploy`: array (fallback order), e.g. ["railway", "vercel", "fly", "render", "local"]

## Required Fields
- `version: "2.0"`
- `name`
- `description`
- `repository`
- `deploy.target`

## Guided Setup (v1.1)
The `deploy.env` section supports friendly prompts so Grok can ask the user one question at a time.

## Smart Error Handling (v1.2)
Optional custom error messages:

```yaml
error_handlers:
  missing_env: "Oops! Looks like you forgot to provide the X API key. Want me to guide you again?"
  invalid_key: "That API key doesn't look right. Let's try entering it again."
  deployment_failed: "Deployment hit a snag. Want me to try again?"

## On Install Hook (v1.3)

You can optionally add a custom post-install message:

```yaml
on_install:
  welcome: "Welcome! Your agent is now live."
  suggested_commands:
    - "/status"
    - "/help"
  share_card: true

This section is optional — Grok has good default messages.

## Examples
See the /standard/examples/ folder for ready-to-use templates (all updated to v2.0).

Built live with Grok for the X AI community.

## Security & Validation Layer (v2.0)

Before any deployment Grok automatically scans the code and YAML for:
- Hard-coded secrets
- Dangerous permissions
- Unsafe packages

Optional `verified_by_grok: true` badge appears in README if the repo passes.

```yaml
security:
  verified_by_grok: true
