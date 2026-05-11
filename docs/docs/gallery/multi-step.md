---
title: Multi-step templates
description: Sequential pipelines — triage, draft, publish, repeat.
---

# Multi-step templates

Agents chained into a linear pipeline by `grok-workflow.yaml`. Each
step has a narrow job; the workflow wires them together.

## reply-engagement-bot

> Drafts replies to X mentions with an approval gate before posting.

**Pattern:** multi-step · **Profile:** strict

Triage classifies the mention, drafter writes a response, publisher
posts — gated by human approval.

[View on GitHub →](https://github.com/AgentMindCloud/awesome-grok-agents/tree/main/templates/reply-engagement-bot){ .grok-btn .grok-btn--ghost }

## trend-to-thread

> Monitors X trends and generates full threads on demand.

**Pattern:** multi-step · **Profile:** strict

Detector → researcher → thread-writer → reviewer → publisher.

[View on GitHub →](https://github.com/AgentMindCloud/awesome-grok-agents/tree/main/templates/trend-to-thread){ .grok-btn .grok-btn--ghost }

## code-reviewer

> Adds inline comments to GitHub pull requests.

**Pattern:** multi-step · **Profile:** strict

Fetcher pulls the diff, analyzer produces review notes, commenter
posts them inline on the PR.

[View on GitHub →](https://github.com/AgentMindCloud/awesome-grok-agents/tree/main/templates/code-reviewer){ .grok-btn .grok-btn--ghost }

## thread-ghostwriter

> Transforms rough ideas into polished X threads.

**Pattern:** multi-step · **Profile:** strict

Outliner → drafter → editor → reviewer.

[View on GitHub →](https://github.com/AgentMindCloud/awesome-grok-agents/tree/main/templates/thread-ghostwriter){ .grok-btn .grok-btn--ghost }

## personal-knowledge

> Searchable memory index of your X posting history.

**Pattern:** multi-step · **Profile:** standard

Indexer (scheduled) → retriever → summarizer.

[View on GitHub →](https://github.com/AgentMindCloud/awesome-grok-agents/tree/main/templates/personal-knowledge){ .grok-btn .grok-btn--ghost }

## voice-agent-x

> Voice-to-post workflow with a review step.

**Pattern:** multi-step · **Profile:** strict

Transcriber → drafter → reviewer (approval-gated) → publisher.

[View on GitHub →](https://github.com/AgentMindCloud/awesome-grok-agents/tree/main/templates/voice-agent-x){ .grok-btn .grok-btn--ghost }

## live-event-commentator

> Real-time event updates on X.

**Pattern:** multi-step · **Profile:** strict

Feed-watcher → summarizer → scheduler → publisher.

[View on GitHub →](https://github.com/AgentMindCloud/awesome-grok-agents/tree/main/templates/live-event-commentator){ .grok-btn .grok-btn--ghost }

## When to pick multi-step

- You want each agent to do one thing well.
- Your workflow is deterministic top to bottom (with optional `when:`
  gates).
- You need a human approval step somewhere in the middle.
- Cost matters — smaller prompts on each step add up to a smaller bill.
