---
title: grok-install — the open standard for installable AI agents
description: YAML-defined, one-click installable Grok agents for X. Spec reference, CLI guide, live validator, and multi-agent orchestration.
hide:
  - navigation
  - toc
---

<div class="grok-hero" markdown>
<div class="grok-hero__inner" markdown>
<div class="grok-hero__copy" markdown>

<span class="grok-hero__eyebrow">Open standard · v2.14 · 12 standards</span>

# One YAML file. <em>Install any AI agent on X.</em>

<p class="grok-hero__subtitle">
grok-install is the open specification for describing, scanning, and shipping
Grok-powered agents straight from a GitHub repo. Twelve focused YAML standards,
multi-agent swarms, safety profiles, and — new in v2.14 — a
first-class <code>visuals:</code> block with live-preview cards.
</p>

<div class="grok-hero__ctas">
  <a href="getting-started/first-agent/" class="grok-btn grok-btn--primary">
    Build your first agent →
  </a>
  <a href="v2.14/index.md" class="grok-btn grok-btn--ghost">
    Read the v2.14 spec
  </a>
</div>

</div>

<div class="grok-terminal" data-grok-terminal aria-hidden="true">
  <div class="grok-terminal__chrome">
    <span class="grok-terminal__dot grok-terminal__dot--r"></span>
    <span class="grok-terminal__dot grok-terminal__dot--y"></span>
    <span class="grok-terminal__dot grok-terminal__dot--g"></span>
    <span class="grok-terminal__title">~/my-agent</span>
  </div>
  <div class="grok-terminal__body"></div>
</div>

</div>
</div>

## Why grok-install

<div class="grok-features" markdown>

<div class="grok-feature" markdown>
### One-click installable
Any repo with a `grok-install.yaml` becomes installable on X. Paste the link,
tap **Install with Grok**, done.
</div>

<div class="grok-feature" markdown>
### Multi-agent swarms
First-class support for sequential, conditional, and parallel agent
orchestration via `grok-workflow.yaml` — no glue code.
</div>

<div class="grok-feature" markdown>
### Safety profiles
Declare `standard` or `strict`. Approval gates, rate limits, and
permission scopes are enforced by the runtime, not by convention.
</div>

<div class="grok-feature" markdown>
### Multi-LLM
`grok-4` is the default, but drop in OpenAI, Anthropic, Ollama, or any
custom endpoint by changing a single field.
</div>

<div class="grok-feature" markdown>
### Deploy anywhere
Vercel, Railway, Docker, Replit — the CLI generates the config for each.
Run locally with `grok-install run`.
</div>

<div class="grok-feature" markdown>
### Certified templates
Ten production-ready templates in
<a href="https://github.com/AgentMindCloud/awesome-grok-agents">awesome-grok-agents</a>
— each safety-scanned, CI-validated, and copy-paste ready.
</div>

<div class="grok-feature" markdown>
### [Visuals preview · v2.14 →](v2.14/visuals.md)
Drop a `visuals:` block and your install card renders live — in the
playground, in galleries, and on X. WCAG 2.2 AA baked in.
</div>

</div>

## Quick start

<ol class="grok-steps" markdown>

<li markdown>

**Install the CLI**

```bash
pip install grok-install
```

</li>

<li markdown>

**Scaffold a new agent**

```bash
grok-install init my-agent
cd my-agent
```

This creates `grok-install.yaml` + `.grok/` with `grok-agent.yaml`,
`grok-prompts.yaml`, and `grok-security.yaml`.

</li>

<li markdown>

**Run it locally**

```bash
export XAI_API_KEY=sk-...
grok-install run .
```

Your agent is now live on `localhost`. Iterate until you're happy.

</li>

<li markdown>

**Publish on X**

Push the repo, post the link, and tag `@grok`. The runtime scans it,
verifies safety, and shows an **Install with Grok** button to every
reader.

</li>

</ol>

[Try the 10-minute tutorial →](getting-started/first-agent.md){ .grok-btn .grok-btn--ghost }
[Open the playground →](playground/index.md){ .grok-btn .grok-btn--ghost }

## Where to go next

<div class="grok-features" markdown>

<div class="grok-feature" markdown>
### [Full spec reference →](v2.14/index.md)
Every field, every default, every constraint across the **12 standards**
of v2.13 plus the additive `visuals:` block in v2.14. Still need the
five-file v2.12 spec? [Pinned reference →](v2.12/index.md)
</div>

<div class="grok-feature" markdown>
### [CLI reference →](cli/reference.md)
`init`, `validate`, `scan`, `run`, `test`, `deploy`, `install`, `publish`
— with flags and examples.
</div>

<div class="grok-feature" markdown>
### [Multi-agent swarms →](guides/multi-agent-swarms.md)
Patterns for researcher-critic-publisher, triage-draft-review, and
other production flows.
</div>

<div class="grok-feature" markdown>
### [For xAI →](for-xai/adoption-guide.md)
Considering this as an official standard? Read the adoption guide.
</div>

</div>
