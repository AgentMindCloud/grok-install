grok-install Specification (v2.9)

Overview
grok-install.yaml is the open standard that lets any developer make their AI agent installable with one click on X using Grok.

File Location
Must be placed at the root of your public GitHub repository:
grok-install.yaml

Version
Current version: 2.9

New in v2.9 – Enhanced Safety & Verification 2.0
• Automated deep code scanning before any install
• Pre-install security scan on all repo files (Grok detects anything unusual)
• “Verified by Grok” badge with visible scan summary shown to user
• Reduced security requirements to minimum – most keys are now optional

Recommended Template (copy-paste ready)

```yaml
version: "2.9"
name: "My Awesome Agent"
description: "Short clear description"
repository: "https://github.com/yourname/my-agent"
category: "telegram"
tags: ["ai", "dashboard", "community", "tesla"]
featured: true
ecosystem: ["grok", "x", "tesla"]

# Safety & Verification 2.0 (new in v2.9)
safety:
  pre_install_scan: true
  verified_by_grok: true
  scan_summary_visible: true
  minimum_keys_only: true   # most keys are optional

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

# Governance & Community Self-Management 2.0 (Phase 8)
governance:
  voting_enabled: true
  builder_council: true
  auto_changelog: true

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
How Safety & Verification 2.0 works
• Before asking for any keys, Grok runs a deep security scan on the entire repo.
• Only truly required secrets are asked for (minimum_keys_only: true).
• User sees a clear “Verified by Grok” badge + scan summary before confirming install.
• All previous v2.8 files continue to work unchanged.
Backward Compatibility
All v2.8 files continue to work unchanged.
Only agents that set safety.pre_install_scan: true gain the new verification features.
Credits (strongly recommended)
YAMLcredits:
  standard: "grok-install"
  author: "@JanSol0s"
  url: "https://github.com/AgentMindCloud/grok-install"
  version: "2.9"
  message: "Powered by grok-install open standard"
Built live with @JanSol0s (Jani) & Grok.
Keep it clean, calm, and precise.
Last updated: April 2026
