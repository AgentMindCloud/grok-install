# grok-install Specification (v1.1)

## Overview
`grok-install.yaml` makes any AI agent installable in **one click** through Grok on X.

Grok now supports **guided conversational setup** — it will ask users for credentials naturally instead of making them edit files.

## Required Fields
- `version: "1.1"`
- `name`
- `description`
- `repository`
- `deploy.target`

## New in v1.1: Guided env setup
The `deploy.env` section now supports friendly prompts so Grok can guide the user conversationally.

### Recommended (X-first) example:
```yaml
version: "1.1"
name: "Smart Twitter Reply Bot"
description: "AI agent that replies to mentions intelligently using Grok"
repository: "https://github.com/yourusername/twitter-reply-bot"
deploy:
  target: "railway"
  env:
    X_API_KEY:
      prompt: "Paste your X API Key (get it from developer.x.com)"
      example: "x-abc123def456..."
    GROK_API_KEY:
      prompt: "Paste your Grok API Key (from grok.x.ai)"
      example: "gsk_..."
