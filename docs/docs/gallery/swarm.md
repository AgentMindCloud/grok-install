---
title: Swarm templates
description: Collaborative multi-agent systems — researcher, critic, publisher, refiner.
---

# Swarm templates

Multiple agents collaborating, often with conditional loops. The
workflow uses `when:` clauses to route between agents based on prior
output.

## research-swarm

> Researcher + critic + publisher, with a conditional second research pass.

**Pattern:** swarm · **Profile:** standard

The researcher gathers sources, the critic flags weak claims, the
researcher refines only if needed, the publisher compiles the final
brief. The canonical reference for the critic-loop pattern.

[View on GitHub →](https://github.com/AgentMindCloud/awesome-grok-agents/tree/main/templates/research-swarm){ .grok-btn .grok-btn--ghost }

## scientific-discovery

> Daily arXiv + X discussion summaries with a research swarm.

**Pattern:** swarm · **Profile:** standard

Scheduler fires daily, fans out to arXiv + X specialists, synthesizer
composes the digest post.

[View on GitHub →](https://github.com/AgentMindCloud/awesome-grok-agents/tree/main/templates/scientific-discovery){ .grok-btn .grok-btn--ghost }

## When to pick a swarm

- Quality matters more than cost.
- You need iterative refinement (critic loops).
- Different specialists would produce better results than one
  generalist agent (breadth + depth).
- You're okay with the additional orchestration in `grok-workflow.yaml`.

Read the pattern deep-dive: [Multi-agent swarms →](../guides/multi-agent-swarms.md).
