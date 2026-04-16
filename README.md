# grok-install — v2.12
**The official open operating system for AI agents on X**

Install any AI agent with one click directly on X using Grok.

This is the complete living documentation of everything we have built together since the very beginning.

### Core Vision
grok-install is an open standard that lets any developer make their AI agent installable with one click on X.  
Grok acts as the intelligent installer, orchestrator, marketplace, and passive growth engine — while the actual agent code runs on your chosen hosting platform (Railway, Vercel, Docker, etc.).

### All Features Built So Far (v1.0 → v2.12)

**Phase 1–9 Foundation & Scale**
- Simple, versioned `grok-install.yaml` schema in repo root
- Multi-LLM support (Grok, OpenAI, Anthropic, Ollama, custom)
- Environment variable handling with private secret prompting
- Multiple deployment targets (Railway, Vercel, Docker, etc.)
- Enhanced Safety & Verification 2.0 – pre-install deep scan, minimum keys only, “Verified by Grok” badge
- Auto-update all agents command
- Template generator for orchestration patterns
- Improved error recovery and debugging tools

**Phase 10 – Native X Integration & Intelligence Layer**
- Native X Agent Runtime (reply bots, DM handlers, trend monitors)
- Grok Intelligence Layer – function calling, real-time tools, multi-agent swarms
- Advanced Trust & Reputation System – public score, scan history, automated recommendations
- Voice-First Agent Management (basic commands)

**Phase 11 – Passive Growth Engine (fully active)**
- Auto-Welcome: Grok automatically replies to any public GitHub link containing `grok-install.yaml`
- Auto-Share: Beautiful shareable install cards after successful installs
- Auto-Weekly Highlight Thread every Sunday at 20:00 UTC
- Trending & Featured Boost System
- Referral tracking and builder attribution (private DMs + credits)
- Activation controlled by the `promotion:` block in YAML

**Phase 12 – Professional Marketplace & Docs Site**
- Complete premium redesign with glassmorphism, dark mode first, excellent typography
- Dynamic Marketplace sections: Featured Agents, Trending this week, Categories & tags, Live search
- Beautiful agent cards with install counts, Verified badge, and one-click install
- Mobile-first responsive design across index.html and my-agents.html
- Consistent DESIGN-WOW-FACTOR visual language

**Phase 14 – Full Voice & Mobile Experience**
- 20+ natural voice commands (“Hey Grok, show me my agents”, “Hey Grok, update all my agents”, “Hey Grok, orchestrate my agents”, etc.)
- One-tap voice buttons inside the private dashboard
- Seamless voice-to-visual handoff on mobile
- Mobile-first private dashboard redesign with live status, analytics, and quick actions

### How to Use (30 seconds)
1. Add `grok-install.yaml` at the root of your public GitHub repo (copy the template or follow the full spec).
2. Commit and push.
3. Post the GitHub link anywhere on X.
4. Grok will automatically detect it, show the blue “Install with Grok” pill, run a safety scan, and guide you through private setup.

**Pro tip:** Add the `promotion:` block to activate the full Passive Growth Engine for your agent.

### Full Specification
See [standard/spec.md](standard/spec.md) – v2.12 with all blocks and promotion settings.

### Live Demo Agents (all v2.12 ready)
- [Hermes Telegram Dashboard](https://github.com/AgentMindCloud/hermes-telegram-dashboard)
- [Smart Twitter Reply Bot](https://github.com/AgentMindCloud/twitter-reply-bot)
- [Discord AI Moderator](https://github.com/AgentMindCloud/discord-ai-mod)

### Private Dashboard
Type `@grok my agents` or say “Hey Grok, show me my agents” to see your installed agents, live analytics, orchestration view, and voice controls.

### Security & Trust
Every install runs a full automated deep scan. See [SECURITY.md](SECURITY.md) for details.

Built live with @JanSol0s (Jani) & Grok.  
v2.12 – April 2026

Star this repo if you want to help shape the future of open AI agents on X.
