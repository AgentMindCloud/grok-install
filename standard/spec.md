# grok-install Specification (v2.2)

## Phase 6 Update – Full Marketplace Activation
This spec now powers the complete X-native Marketplace.  
All browse commands (`@grok show me telegram agents`), dynamic Featured section, and shareable cards are fully active.

## Overview
grok-install.yaml is the open standard that lets any developer make their AI agent installable with one click on X using Grok.

Version 2.2 (April 2026) adds full support for:
- Passive Growth Engine (auto-welcome, auto-share installs, trending)
- Advanced Safety & Trust Layer
- Developer Experience (auto-generate YAML, update all agents)
- Marketplace & User Experience (featured agents, shareable cards)

## File Location
Must be placed at the root of your public GitHub repository: `grok-install.yaml`

## Schema
See `grok-install.schema.json` (v2.2) for full validation rules.

## Required Fields
- `version: "2.2"`
- `name`
- `description`
- `repository`

## Core Fields (v2.2)

```yaml
version: "2.2"
name: "My Awesome Agent"
description: "Short clear description"
repository: "https://github.com/yourname/my-agent"
category: "telegram"                  # telegram | discord | twitter | web | general
tags: ["ai", "dashboard", "community"]
featured: true                        # enables auto-trending & Featured section
ecosystem: ["grok", "x", "tesla"]     # optional

# Passive Growth Engine
promotion:
  auto_welcome: true                  # Grok auto-replies with Install pill when repo is posted
  share_installs: true                # auto-share successful installs in public feed
  weekly_highlight: true              # eligible for weekly thread

# Deployment
preferred_deploy: ["railway", "render", "fly", "local"]  # fallback order
mode: "simple"                        # "simple" or "advanced"

# Environment & Prompts (Grok asks privately)
deploy:
  env:
    TELEGRAM_TOKEN: "Ask the user for their Telegram bot token"
    GROK_API_KEY: "Ask the user for their xAI/Grok API key"

# Safety & Trust
security:
  verified_by_grok: true              # triggers full automated code scan
  safety_checklist: true              # shows visible scan results to users

# Developer Experience
update_strategy: "semver"             # "semver" | "always"
auto_generate: true                   # enables @grok generate grok-install.yaml command

# Marketplace & User Experience
shareable_card: true                  # generates beautiful one-tap share card after install
on_install:
  welcome_message: "Thank you for installing! Here are your first commands..."
How Passive Growth Works
When a public repo adds this file and someone posts the GitHub link on X:

Grok automatically replies with welcome message + blue “Install with Grok” pill
Successful installs are auto-shared in public “Recently Installed” feed
Top agents appear in weekly auto-generated thread

How Marketplace Works (Phase 6)

@grok show me telegram agents → Grok lists verified agents with one-tap install pills
featured: true → appears in dynamic Featured Agents section inside Grok
Shareable cards are generated automatically after every successful install

Next Steps for Developers

Add this file to your repo root
Commit & push
Post your repo link on X — Grok will detect it automatically

Built live with @JanSol0s (Jani) & Grok.
Keep it clean, calm, and precise.
Last updated: April 2026
