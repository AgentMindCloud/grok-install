# grok-install Specification (v2.3)
## Phase 7 Update – Multi-Agent Orchestration
This spec now supports linking multiple agents into coordinated workflows.

## Overview
`grok-install.yaml` is the open standard that lets any developer make their AI agent installable with one click on X using Grok.
Version 2.3 (April 2026) adds support for multi-agent orchestration while keeping full backward compatibility with v2.2.

## File Location
Must be placed at the root of your public GitHub repository: `grok-install.yaml`

## Schema
See `grok-install.schema.json` (v2.3) for full validation rules.

## Required Fields
- `version: "2.3"`
- `name`
- `description`
- `repository`

## Core Fields (v2.3)
```yaml
version: "2.3"
name: "My Awesome Agent"
description: "Short clear description"
repository: "https://github.com/yourname/my-agent"
category: "telegram" # telegram | discord | twitter | web | general
tags: ["ai", "dashboard", "community"]
featured: true
ecosystem: ["grok", "x", "tesla"]

# Passive Growth Engine (unchanged from v2.2)
promotion:
  auto_welcome: true
  share_installs: true
  weekly_highlight: true

# Deployment (unchanged)
preferred_deploy: ["railway", "render", "fly", "local"]
mode: "simple" # "simple" or "advanced"

# Environment & Prompts (Grok asks privately)
deploy:
  env:
    TELEGRAM_TOKEN: "Ask the user for their Telegram bot token"
    GROK_API_KEY: "Ask the user for their xAI/Grok API key"

# Safety & Trust (unchanged)
security:
  verified_by_grok: true
  safety_checklist: true

# Developer Experience (unchanged)
update_strategy: "semver"
auto_generate: true

# Marketplace & User Experience (unchanged)
shareable_card: true
on_install:
  welcome_message: "Thank you for installing! Here are your first commands..."

# Community Self-Management (from Wave 4 – unchanged)
community:
  onboard: true
  voting_enabled: true
  moderation_level: "standard"

# NEW: Multi-Agent Orchestration (Phase 7)
orchestration:
  enabled: true                    # set to true to allow this agent to join workflows
  role: "dashboard"                # e.g. "listener", "actor", "dashboard", "moderator"
  can_trigger: ["twitter-bot"]     # list of agent categories this can trigger
  can_be_triggered_by: ["reply-bot"]
  triggers:
    - event: "mention"
      action: "update_dashboard"
How Orchestration Works

orchestration.enabled: true allows Grok to link this agent with others
Use command @grok orchestrate my agents to see and create connections
Grok handles safe handoff and routing between linked agents
Visual flow appears in the private my-agents.html dashboard

Backward Compatibility
All v2.2 files continue to work unchanged.
Only agents that set orchestration.enabled: true gain the new capabilities.
Next Steps for Developers
Add this file to your repo root
Commit & push
Post your repo link on X — Grok will detect it automatically
Try @grok orchestrate my agents after installing multiple agents
Built live with @JanSol0s (Jani) & Grok.
Keep it clean, calm, and precise.
Last updated: April 2026
