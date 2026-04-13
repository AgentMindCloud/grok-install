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

## deploy Section + Ecosystem Expansion (Goal 3)
```yaml
deploy:
  target: "railway"
  preferred_deploy: ["railway", "vercel", "fly", "render", "local"]
Supported deployment targets (v2.1):

Railway
Vercel
Fly.io
Render
Local Docker

Private Prompts
YAMLprompts:
  - key: "GROK_API_KEY"
    message: "Please paste your Grok / xAI API key (this stays private)"
Optional advanced sections:
YAMLerror_handlers:
  missing_env: "Oops! Looks like you forgot to provide the key. Want me to guide you again?"

on_install:
  welcome: "Welcome! Your agent is now live."
  suggested_commands:
    - "/status"
    - "/help"
  share_card: true

safety_checklist:
  - no_hardcoded_secrets
  - uses_official_sdks
  - no_dangerous_permissions
Passive Growth & Wow Features
Add the Featured in Grok and Grok-Installed badges to your README.
All secrets are requested privately by Grok.
Voice install: “Hey Grok, install [your agent name]”
One-command clone: Post any GitHub link → Grok can auto-generate basic YAML if missing.
Examples
See the three demo repos (all updated to v2.1).
Full docs: https://agentmindcloud.github.io/grok-install/
Phase 4 Status

Launch & Visibility: done
Security & Trust: done
Ecosystem Expansion: done
Analytics & Feedback Loop: done
Adoption Push: postponed

Built live with @JanSol0s (Jani Starck) and Grok for the X AI community.
Last updated: April 2026
