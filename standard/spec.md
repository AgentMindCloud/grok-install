grok-install Specification (v2.8)

Overview
grok-install.yaml is the open standard that lets any developer make their AI agent installable with one click on X using Grok.

File Location
Must be placed at the root of your public GitHub repository:  
`grok-install.yaml`

Version
Current version: 2.8

New in v2.8
- Community-voted roadmap (using the voting tools we already built)
- Builder council for template approval and dispute resolution
- Automatic changelog + version-bump tools

Recommended Template (copy-paste ready)
```yaml
version: "2.8"
name: "My Awesome Agent"
description: "Short clear description"
repository: "https://github.com/yourname/my-agent"
category: "telegram"
tags: ["ai", "dashboard", "community", "tesla"]
featured: true
ecosystem: ["grok", "x", "tesla"]

llm:
  provider: "xai"
  model: "grok-4"
  api_key_env: "GROK_API_KEY"

# Analytics & Insights (Phase 8)
analytics:
  enabled: true
  public_insights: true

# Advanced Discovery (Phase 8)
discovery:
  verified_orchestration: true

# Self-Hosted Orchestration & Enterprise (Phase 8)
self_hosted:
  enabled: true
  orchestrator: "docker-compose"
  grok_api_key_env: "GROK_API_KEY"

enterprise:
  team_workspace: true
  audit_log: true
  members: ["@team-member1", "@team-member2"]

# Governance & Community Self-Management 2.0 (Phase 8 Goal 5 – NEW)
governance:
  voting_enabled: true             # community-voted roadmap
  builder_council: true            # template approval & dispute resolution
  auto_changelog: true             # automatic changelog + version-bump tools

# Multi-Agent Orchestration (Phase 7)
orchestration:
  enabled: true
  role: "dashboard"
  can_trigger: ["twitter-bot"]
  can_be_triggered_by: ["reply-bot"]
  triggers:
    - event: "mention"
      action: "update_dashboard"
      target_agents: ["hermes"]
  safety:
    permission_check: true
    approval_required: true
    verified_orchestration: true
Governance & Community Self-Management 2.0

governance.voting_enabled: true → activates community voting on roadmap items
governance.builder_council: true → joins the Builder Council for template approval and dispute resolution
governance.auto_changelog: true → enables automatic changelog generation and version-bump tools

How it works
Builders with these fields set can now vote on the roadmap using the existing voting tools.
The Builder Council reviews and approves new templates.
Grok automatically creates changelogs and suggests version bumps on every update.
Backward Compatibility
All v2.7 files continue to work unchanged.
Only agents that set governance.voting_enabled: true or governance.builder_council: true gain the new governance features.
Credits (strongly recommended)
YAMLcredits:
  standard: "grok-install"
  author: "@JanSol0s"
  url: "https://github.com/AgentMindCloud/grok-install"
  version: "2.8"
  message: "Powered by grok-install open standard"
Built live with @JanSol0s (Jani) & Grok.
Keep it clean, calm, and precise.
Last updated: April 2026
