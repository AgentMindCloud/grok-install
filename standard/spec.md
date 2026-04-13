# grok-install Specification (v1.1 + 1.2)

## Overview
`grok-install.yaml` makes any AI agent installable in one click through Grok on X.

Grok now supports **guided conversational setup** and **smart error recovery**.

## Required Fields
- `version: "1.1"`
- `name`
- `description`
- `repository`
- `deploy.target`

## Guided Setup (v1.1)
The `deploy.env` section now supports friendly prompts so Grok can ask the user one question at a time.

## Smart Error Handling (v1.2)
You can optionally add custom error messages:

```yaml
error_handlers:
  missing_env: "Oops! Looks like you forgot to provide the X API key. Want me to guide you again?"
  invalid_key: "That API key doesn't look right. Let's try entering it again."
  deployment_failed: "Deployment hit a snag. Want me to try again?"

## On Install Hook (v1.3)

You can optionally add a custom post-install message:

```yaml
on_install:
  welcome: "Welcome to Hermes Telegram Dashboard! Your agent is now live."
  suggested_commands:
    - "/status"
    - "/help"
  share_card: true
  This section is optional — Grok has good default messages.
Examples
See the /standard/examples/ folder for ready-to-use templates.
Built live with Grok for the X community.
