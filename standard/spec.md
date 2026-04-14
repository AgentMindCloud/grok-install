grok-install Specification (v2.5)
Overview
grok-install.yaml is the open standard that lets any developer make their AI agent installable with one click on X using Grok.

File Location
Must be placed at the root of your public GitHub repository:
grok-install.yaml

Version
Current version: 2.5

New in v2.5
• Public Marketplace Insights page (live top agents, growth trends, most-used triggers)
• Private per-agent analytics dashboard (installs, usage, retention, trigger success rate)
• Auto-generated weekly reports sent via Grok DM to builders

version: "2.5"
name: "My Awesome Agent"
description: "Short clear description"
repository: "https://github.com/yourname/my-agent"
category: "telegram"
tags: ["ai", "dashboard", "community"]
featured: true
ecosystem: ["grok", "x", "tesla"]
llm:                          # ← RECOMMENDED: Smart LLM section
provider: "xai"             # "xai" | "openai" | "anthropic" | "ollama" | "custom"
model: "grok-4"             # suggested model for that provider
api_key_env: "GROK_API_KEY" # tells Grok exactly which secret to ask for (only one key)
Analytics & Insights (Phase 8 – NEW)
analytics:
enabled: true               # enables private dashboard + weekly reports
public_insights: true       # shows this agent in Marketplace Insights
Passive Growth Engine (unchanged)
promotion:
auto_welcome: true
share_installs: true
weekly_highlight: true
Deployment (unchanged)
preferred_deploy: ["railway", "render", "fly", "local"]
mode: "simple"
Environment & Prompts (Grok asks privately)
deploy:
env:
TELEGRAM_TOKEN: "Ask the user for their Telegram bot token"
X_API_KEY: "Ask the user for their X API key (optional)"
Safety & Trust (unchanged)
security:
verified_by_grok: true
safety_checklist: true
Developer Experience (unchanged)
update_strategy: "semver"
auto_generate: true
Marketplace & User Experience (unchanged)
shareable_card: true
on_install:
welcome_message: "Thank you for installing! Here are your first commands..."
Community Self-Management (unchanged)
community:
onboard: true
voting_enabled: true
moderation_level: "standard"
Multi-Agent Orchestration (Phase 7 – unchanged)
orchestration:
enabled: true
role: "dashboard"
can_trigger: ["twitter-bot"]
can_be_triggered_by: ["reply-bot"]
triggers:

event: "mention"
action: "update_dashboard"
target_agents: ["hermes"]
event: "new_message"
action: "moderate"
safety:
permission_check: true
approval_required: true
verified_orchestration: true

textHow Analytics Works (Phase 8)
- `analytics.enabled: true` → gives the builder a private per-agent dashboard (installs, usage, retention, trigger success rate)
- `analytics.public_insights: true` → includes this agent in the public Marketplace Insights page
- Grok automatically sends weekly reports via DM to every builder

Use command `@grok my agents` to open your private analytics dashboard.

Backward Compatibility
All v2.4 files continue to work unchanged.
Only agents that set `analytics.enabled: true` gain the new analytics features.

Credits (strongly recommended)
credits:
standard: "grok-install"
author: "@JanSol0s"
url: "https://github.com/AgentMindCloud/grok-install"
version: "2.5"
message: "Powered by grok-install open standard"
