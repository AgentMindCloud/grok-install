# grok-install Specification (v2.3)
## Phase 7 Update – Multi-Agent Orchestration + Safety Layer + Smart LLM Support
This spec now supports linking multiple agents into coordinated workflows with triggers and built-in safety controls.  
It also fixes the common issue of Grok asking for too many API keys.

## Overview
`grok-install.yaml` is the open standard that lets any developer make their AI agent installable with one click on X using Grok.  
Version 2.3 (April 2026) adds full multi-agent orchestration while keeping full backward compatibility with v2.2.

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
category: "telegram"
tags: ["ai", "dashboard", "community"]
featured: true
ecosystem: ["grok", "x", "tesla"]

# NEW RECOMMENDED: Smart LLM section (fixes multiple API key prompts)
llm:
  provider: "grok"          # "grok" | "openai" | "anthropic" | "custom"
  model: "grok-4"           # suggested model for that provider
  api_key_env: "GROK_API_KEY"   # tells Grok exactly which secret to ask for

# Passive Growth Engine (unchanged)
promotion:
  auto_welcome: true
  share_installs: true
  weekly_highlight: true

# Deployment (unchanged)
preferred_deploy: ["railway", "render", "fly", "local"]
mode: "simple"

# Environment & Prompts (Grok asks privately)
# The llm: section above makes sure Grok only asks for the one relevant key
deploy:
  env:
    TELEGRAM_TOKEN: "Ask the user for their Telegram bot token"
    X_API_KEY: "Ask the user for their X API key (optional)"

# Safety & Trust (base layer – unchanged)
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

# Multi-Agent Orchestration (Phase 7)
orchestration:
  enabled: true
  role: "dashboard"                # e.g. "listener", "actor", "dashboard", "moderator"
  can_trigger: ["twitter-bot"]
  can_be_triggered_by: ["reply-bot"]
  # Triggers section
  triggers:
    - event: "mention"
      action: "update_dashboard"
      target_agents: ["hermes"]
    - event: "new_message"
      action: "moderate"

  # Safety & Control Layer for Multi-Agent Orchestration
  safety:
    permission_check: true         # Grok automatically checks permissions before any cross-agent action
    approval_required: true        # User must approve each new connection or sensitive trigger
    verified_orchestration: true   # Shows “Verified Orchestration” badge after Grok safety scan
How Orchestration Works

orchestration.enabled: true allows Grok to link this agent with others
The triggers array defines automatic reactions
The new safety block enforces permission checks and user approval
The llm: section ensures Grok asks only for the correct single API key (no more 5 different Grok/xAI prompts)

Use command @grok orchestrate my agents to create and manage connections.
Visual flow map appears in the private my-agents.html dashboard.
Backward Compatibility
All v2.2 files continue to work unchanged.
Only agents that set orchestration.enabled: true gain the new capabilities.
Next Steps for Developers
Add this file to your repo root
Commit & push
After installing multiple agents, try @grok orchestrate my agents
Built live with @JanSol0s (Jani) & Grok.
Keep it clean, calm, and precise.
Last updated: April 2026
