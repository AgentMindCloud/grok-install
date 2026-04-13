# grok-install Specification (v1.0)

## Overview
`grok-install.yaml` is a simple file that lets any developer make their AI agent installable in one click through Grok on X.

## File Location
Must be placed at the root of your repository: `grok-install.yaml`

## Schema
See `grok-install.schema.json` for full validation rules.

## Required Fields
- `version: "1.0"`
- `name`
- `description`
- `deploy.target`

## Example
```yaml
version: "1.0"
name: "Hermes Telegram Dashboard"
description: "AI-powered Telegram dashboard for your community"
repository: "https://github.com/yourname/hermes"
deploy:
  target: "railway"
  env:
    TELEGRAM_TOKEN: "Ask the user for their Telegram bot token"
    OPENAI_API_KEY: "Ask the user for their OpenAI key"
prompts:
  - key: "TELEGRAM_TOKEN"
    message: "Please paste your Telegram bot token"
  - key: "OPENAI_API_KEY"
    message: "Please paste your OpenAI API key"
