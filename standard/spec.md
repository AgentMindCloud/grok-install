# grok-install Specification (v2.1)

## Overview
`grok-install.yaml` is the open standard that lets any developer make their AI agent installable with **one click** through Grok on X.

Grok handles everything else: guided conversational setup (it asks the user nicely for keys), error recovery, auto-updates, voice install, one-command clone, shareable cards, and special quick-deploy flows for Musk ecosystem projects (Tesla, Starlink, xAI, Optimus).

## File Location
Must be placed at the **root** of your repository: `grok-install.yaml`

## Simple vs Advanced Mode
- `mode: "simple"` (default) — Grok handles everything with maximum hand-holding  
- `mode: "advanced"` — Full control for experienced users

## New Fields (v2.1)
- `category`: string (e.g. "telegram", "twitter", "discord") — helps Grok show your agent in the right marketplace searches  
- `tags`: array of strings — improves discoverability  
- `ecosystem`: array (e.g. `["grok", "x", "tesla", "starlink", "xai", "optimus"]`) — enables special quick-deploy and auth flows  
- `update_strategy`: "semver" (recommended) or "always"  
- `preferred_deploy`: array with fallback order, e.g. `["railway", "vercel", "fly", "render", "local"]`

## Required Fields
- `version: "2.1"`
- `name`
- `description`
- `repository`
- `deploy.target`

## deploy Section
```yaml
deploy:
  target: "railway"
  env:
    X_API_KEY: "Ask the user for their X API key"
    GROK_API_KEY: "Ask the user for their Grok API key"
YAMLprompts:
  - key: "X_API_KEY"
    message: "Please paste your X API key:"
  - key: "GROK_API_KEY"
    message: "Please paste your Grok API key:"
Optional advanced sections:
YAMLerror_handlers:
  missing_env: "Oops! Looks like you forgot to provide the X API key. Want me to guide you again?"

on_install:
  welcome: "Welcome! Your agent is now live."
  suggested_commands:
    - "/status"
    - "/help"
  share_card: true

security:
  verified_by_grok: true   # Grok will run a quick safety scan
Optional Safety Checklist (Phase 4 – Security & Trust)
Add this to your YAML for the “Verified by Grok” badge:
YAMLsafety_checklist:
  - no_hardcoded_secrets
  - no_dangerous_permissions
  - uses_official_sdks
Passive Growth & Wow Features
Add the Featured in Grok and Grok-Installed badges to your README.
When anyone posts your GitHub link on X, Grok automatically replies with the blue "Install with Grok" pill.
Voice install: “Hey Grok, install [your agent name]”
One-command clone: Post any GitHub link → Grok can auto-generate basic YAML if missing.
Simple Install Counter Badge (Phase 4 – Analytics)
Markdown<image-card alt="Installs" src="https://img.shields.io/badge/Installs-247-00f0ff?style=for-the-badge" ></image-card>
Examples
See the three demo repos (all updated to v2.1):

hermes-telegram-dashboard
twitter-reply-bot
discord-ai-mod

Full docs: https://agentmindcloud.github.io/grok-install/
Phase 4 Status

Launch & Visibility: done
Security & Trust layer: added
Ecosystem Expansion: documented
Analytics & Feedback Loop: started
Adoption Push: postponed until after launch

Built live with @JanSol0s (Jani Starck) and Grok for the X AI community.
Last updated: April 2026
