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
- `ecosystem`: array (e.g. `["grok", "x", "tesla", "starlink", "xai", "optimus"]`) — enables special quick-deploy and auth flows for official Musk-related projects. Grok will offer the correct login/deployment automatically.  
- `update_strategy`: "semver" (recommended) or "always"  
- `preferred_deploy`: array with fallback order, e.g. `["railway", "vercel", "fly", "render", "local"]`

## Required Fields
- `version: "2.1"`
- `name`
- `description`
- `repository`
- `deploy.target`

## deploy Section
Tells Grok where and how to deploy your agent.

```yaml
deploy:
  target: "railway"
  env:
    X_API_KEY: "Ask the user for their X API key"
    GROK_API_KEY: "Ask the user for their Grok API key"
    prompts:
  - key: "X_API_KEY"
    message: "Please paste your X API key:"
  - key: "GROK_API_KEY"
    message: "Please paste your Grok API key:"

    error_handlers:
  missing_env: "Oops! Looks like you forgot to provide the X API key. Want me to guide you again?"

on_install:
  welcome: "Welcome! Your agent is now live."
  suggested_commands:
    - "/status"
    - "/help"
  share_card: true

security:
  verified_by_grok: true   # Grok will run a quick safety scan

  Passive Growth & Wow Features

Add the Featured in Grok and Grok-Installed badges (see index.html) to your README.
When anyone posts your GitHub link on X, Grok automatically replies with the blue "Install with Grok" pill.
Voice install: Users can say “Hey Grok, install [your agent name]”
One-command clone: Post any GitHub link → Grok can auto-generate basic YAML if missing.

Examples
See the three demo repos and docs/voice-and-clone-examples.md.
Built live with @JanSol0s (Jani Starck) and Grok for the X AI community.
Last updated: April 2026
