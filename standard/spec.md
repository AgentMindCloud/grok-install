# grok-install Specification (v2.12)

## Overview
`grok-install.yaml` is the open standard that lets any developer make their AI agent installable with **one click** on X using Grok — now with full Native X Agent Runtime and Passive Growth Engine.

## File Location
Must be placed at the **root** of your public GitHub repository: `grok-install.yaml`

## Version
Current version: **2.12**

## What’s New in v2.12 – Phase 11 (Passive Growth Engine)
- Full `promotion:` block that activates automatic discovery, welcoming, sharing, weekly highlights, trending boosts and referral credits.
- Grok now continuously scans public posts for GitHub links containing `grok-install.yaml`.
- Passive Growth Engine activates **only** when the `promotion:` block is present.

## Core Sections from v2.11 (Phase 10) – fully preserved
- Native X Agent Runtime
- Grok Intelligence Layer
- Advanced Trust & Reputation
- Safety & Verification 2.0
- Global Scale & Performance
- Developer Experience & Tooling
- Advanced Orchestration & Triggers
- Agent Marketplace Development
- llm, analytics, self_hosted, enterprise, governance

## New: promotion: block (Phase 11)
```yaml
promotion:
  auto_welcome: true                  # Grok posts welcome + blue “Install with Grok” pill
  auto_share: true                    # Grok posts beautiful shareable card after install
  weekly_highlight: true              # Eligible for Sunday auto-thread
  featured: false                     # Set true for extra marketplace/trending visibility
  builder_credits: "@JanSol0s"        # @mention used in all cards and DMs
  support_link: "https://github.com/sponsors/yourhandle"  # optional Sponsors button

  version: "2.12"
name: "My Awesome Agent"
description: "Short clear description"
repository: "https://github.com/yourname/my-agent"
category: "telegram"
tags: ["ai", "dashboard", "community", "tesla"]
featured: true
ecosystem: ["grok", "x", "tesla"]

# === PHASE 10 BLOCKS (unchanged) ===
x_native_runtime:
  type: "reply-bot" | "dm-handler" | "trend-monitor" | "custom"
  permissions: ["tweet.read", "tweet.write", "dm.read"]
  grok_orchestrator: true
  one_click_x_deploy: true

intelligence_layer:
  function_calling: true
  real_time_tools: true
  multi_agent_swarm: true
  grok_coordinates: true
  ai_suggested_teams: true

reputation:
  public_score: true
  verified_by_grok: true
  scan_history: true
  automated_recommendations: true

safety:
  pre_install_scan: true
  verified_by_grok: true
  scan_summary_visible: true
  minimum_keys_only: true

orchestration:
  enabled: true
  role: "dashboard"
  can_trigger: ["twitter-bot"]
  can_be_triggered_by: ["reply-bot"]
  visual_builder: true
  ai_suggested_patterns: true
  triggers:
    - event: "mention"
      action: "update_dashboard"
      target_agents: ["hermes"]
  safety:
    permission_check: true
    approval_required: true
    verified_orchestration: true

marketplace:
  featured: true
  discovery: true
  insights: true
  shareable_cards: true

llm:
  provider: "xai"
  model: "grok-4"
  api_key_env: "GROK_API_KEY"

analytics:
  enabled: true
  public_insights: true
  privacy:
    collects_personal_data: false
    retention_days: 30
    data_location: "EU"
    third_party_processors: []

self_hosted:
  enabled: true
  orchestrator: "docker-compose"
  grok_api_key_env: "GROK_API_KEY"

enterprise:
  team_workspace: true
  audit_log: true
  members: ["@team-member1", "@team-member2"]

governance:
  voting_enabled: true
  builder_council: true
  auto_changelog: true

# === PHASE 11 NEW BLOCK ===
promotion:
  auto_welcome: true
  auto_share: true
  weekly_highlight: true
  featured: false
  builder_credits: "@JanSol0s"
  support_link: ""

# Credits (strongly recommended)
credits:
  standard: "grok-install"
  author: "@JanSol0s"
  url: "https://github.com/AgentMindCloud/grok-install"
  version: "2.12"
  message: "Powered by grok-install open standard"
