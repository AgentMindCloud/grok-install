# PHASE-5-PASSIVE-GROWTH-ENGINE.md
grok-install Phase 5 – Passive Growth Engine (Detailed Plan)

Last updated: April 2026

## What is the Passive Growth Engine?
A set of automated Grok behaviors that make grok-install grow on X **without any manual effort from Jani**.

Once activated, the system promotes itself and new agents automatically.

## How it Works
Grok constantly scans public X posts for GitHub links that contain a valid `grok-install.yaml`. When it finds one, it triggers the growth engine.

## Specific Features (detailed)

1. **Auto-Welcome for New Repos**
   - When a new repo adds `grok-install.yaml` and someone posts the link on X, Grok automatically replies with:
     - A welcome message
     - The blue “Install with Grok” pill
     - A “Grok-Installed” badge
     - A link to the spec

2. **Auto-Share Successful Installs**
   - After a successful install, Grok posts a short public message in a community feed or replies with a shareable card.

3. **Auto-Weekly Thread**
   - Grok uses `weekly-thread-template.md` to post a new weekly update thread every Sunday at a fixed time.

4. **Trending Boost**
   - Top installed agents are automatically mentioned in Grok’s replies and featured sections.

5. **Referral System**
   - Users who install an agent can share a special card that gives credit to the original builder.

## Benefits
- Zero time required from Jani after setup
- Consistent visibility
- Viral loop: more installs → more visibility → more installs
- Feels magical to users and builders

## Implementation Steps (high-level)
- Update Grok’s internal rules to watch for grok-install.yaml in GitHub links
- Create a public “Recently Installed” feed
- Activate auto-weekly thread
- Add auto-badge and welcome reply logic

This engine is the key to making grok-install truly self-growing.

Built live with @JanSol0s (Jani) & Grok.  
