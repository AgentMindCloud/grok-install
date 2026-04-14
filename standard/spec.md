grok-install Specification (v2.7)

Overview
grok-install.yaml is the open standard that lets any developer make their AI agent installable with one click on X using Grok.

File Location
Must be placed at the root of your public GitHub repository:  
`grok-install.yaml`

Version
Current version: 2.7

New in v2.7
- Self-hosted orchestrator option (docker-compose + Grok API)
- Enterprise “Team Workspace” mode for companies
- Audit log for all cross-agent actions

Recommended Template (copy-paste ready)
```yaml
version: "2.7"
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

# Self-Hosted Orchestration & Enterprise (Phase 8 Goal 4 – NEW)
self_hosted:
  enabled: true                    # run your own private orchestrator
  orchestrator: "docker-compose"   # or "kubernetes"
  grok_api_key_env: "GROK_API_KEY" # optional – only needed for private instance

enterprise:
  team_workspace: true             # enables company team mode
  audit_log: true                  # full audit log for all cross-agent actions
  members: ["@team-member1", "@team-member2"]

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
Self-Hosted Orchestration & Enterprise Features

self_hosted.enabled: true → run a private orchestrator using docker-compose + Grok API
enterprise.team_workspace: true → company team mode with shared agents and permissions
enterprise.audit_log: true → automatic audit log for every cross-agent action

How to use
Set the fields above and run docker-compose up with the included orchestrator files (coming in next templates).
Backward Compatibility
All v2.6 files continue to work unchanged.
Only agents that set self_hosted.enabled: true or enterprise.team_workspace: true gain the new features.
Credits (strongly recommended)
YAMLcredits:
  standard: "grok-install"
  author: "@JanSol0s"
  url: "https://github.com/AgentMindCloud/grok-install"
  version: "2.7"
  message: "Powered by grok-install open standard"
Built live with @JanSol0s (Jani) & Grok.
Keep it clean, calm, and precise.
Last updated: April 2026
