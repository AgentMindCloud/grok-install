grok-install Specification (v2.6)

Overview
grok-install.yaml is the open standard that lets any developer make their AI agent installable with one click on X using Grok.

File Location
Must be placed at the root of your public GitHub repository:  
`grok-install.yaml`

Version
Current version: 2.6

New in v2.6
- Curated Community Templates gallery with Verified Orchestration badges  
- Advanced search & filtering inside Grok (@grok show me agents that use Tesla API)  
- “Verified Orchestration” badge for safely linked agent groups

Recommended Template (copy-paste ready)
```yaml
version: "2.6"
name: "My Awesome Agent"
description: "Short clear description"
repository: "https://github.com/yourname/my-agent"
category: "telegram"
tags: ["ai", "dashboard", "community", "tesla"]
featured: true
ecosystem: ["grok", "x", "tesla"]

llm:                          # ← RECOMMENDED
  provider: "xai"
  model: "grok-4"
  api_key_env: "GROK_API_KEY"

# Analytics & Insights (Phase 8)
analytics:
  enabled: true
  public_insights: true

# Advanced Discovery (Phase 8 Goal 2 – NEW)
discovery:
  verified_orchestration: true   # shows “Verified Orchestration” badge

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
Advanced Discovery (Goal 2)

Use category, tags, and ecosystem in your YAML for better visibility
@grok show me agents that use Tesla API now works automatically
discovery.verified_orchestration: true displays the official “Verified Orchestration” badge

How Verified Orchestration Works
Grok runs a safety scan on the orchestration.safety block.
If all checks pass, the badge appears on shareable cards and in search results.
Backward Compatibility
All v2.5 files continue to work unchanged.
Only agents that set discovery.verified_orchestration: true or use advanced tags gain the new discovery features.
Credits (strongly recommended)
YAMLcredits:
  standard: "grok-install"
  author: "@JanSol0s"
  url: "https://github.com/AgentMindCloud/grok-install"
  version: "2.6"
  message: "Powered by grok-install open standard"
Built live with @JanSol0s (Jani) & Grok.
Keep it clean, calm, and precise.
Last updated: April 2026
