---
title: Templates
description: Ten certified, production-ready agent templates across three orchestration patterns.
---

# Templates

Every template in
[`awesome-grok-agents`](https://github.com/AgentMindCloud/awesome-grok-agents)
is CI-validated, safety-scanned, and ships with a working demo.

Grouped by orchestration pattern:

<div class="grok-features" markdown>

<div class="grok-feature" markdown>
### [Single-agent →](single-agent.md)
One agent, one job. Start here.
</div>

<div class="grok-feature" markdown>
### [Multi-step →](multi-step.md)
Sequential pipelines — triage → draft → publish.
</div>

<div class="grok-feature" markdown>
### [Swarm →](swarm.md)
Collaborative patterns — researcher + critic + publisher.
</div>

</div>

## Install any template locally

```bash
grok-install install AgentMindCloud/<template-name>
```

Or clone from the gallery repo:

```bash
git clone https://github.com/AgentMindCloud/awesome-grok-agents
cd awesome-grok-agents/templates/<template-name>
grok-install run .
```

## Contribute a template

See the
[submission guide](https://github.com/AgentMindCloud/awesome-grok-agents/blob/main/docs/submitting-your-own.md)
in the gallery repo. Your template gets CI-validated and safety-scanned
on every PR.
