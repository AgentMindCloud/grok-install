# agents/simple/

Single-purpose agents. Migrated from [`AgentMindCloud/awesome-grok-agents/templates/`](https://github.com/AgentMindCloud/awesome-grok-agents) per the dedup rule documented in `cli/dedup.py` (exact slug OR identical content hash collapses to one canonical copy).

Each manifest validates against [`spec/v2.14/schemas/bridge.schema.json`](../../spec/v2.14/schemas/bridge.schema.json). Use `grok-install validate agents/simple/` to verify, or `grok-install list-agents agents/` to browse.

## Migrated catalog (10)

| Slug | Summary |
|---|---|
| [`hello-grok`](hello-grok/) | Simplest possible Grok agent. Single agent, single tool. |
| [`reply-engagement-bot`](reply-engagement-bot/) | Watches X mentions and drafts replies behind an approval gate. |
| [`trend-to-thread`](trend-to-thread/) | Monitors X trends and drafts a full thread. |
| [`research-swarm`](research-swarm/) | Researcher + critic + publisher multi-agent swarm. |
| [`code-reviewer`](code-reviewer/) | Reviews GitHub PRs and posts inline comments behind approval. |
| [`thread-ghostwriter`](thread-ghostwriter/) | Turns a rough idea into a tone-matched X thread. |
| [`personal-knowledge`](personal-knowledge/) | Persistent, searchable memory of your X history. |
| [`scientific-discovery`](scientific-discovery/) | Daily brief of new arXiv papers and X discussion around them. |
| [`voice-agent-x`](voice-agent-x/) | Speak a post, review transcript, approve, publish. |
| [`live-event-commentator`](live-event-commentator/) | Real-time X commentary with rate limits and a kill switch. |
