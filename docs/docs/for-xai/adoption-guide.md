---
title: Adoption guide — for xAI
description: A concrete proposal for making grok-install an official xAI standard. What we're asking for, what we're not.
---

<div class="grok-banner" markdown>
**Official standard candidate.** This page is written for the xAI team.
It describes what it would look like for `grok-install` to become an
officially recognized standard — and what we're *not* asking for.
</div>

# Adoption guide — for xAI

## The 30-second pitch

`grok-install` is the YAML spec that lets any GitHub repo become a
one-click installable AI agent on X. It's been live for four months,
has a working CLI, a certified template gallery, and real users
shipping real agents. We've built it deliberately as **an open
standard**, not as a company, not as a product.

If xAI recognizes it — even lightly — it becomes the default path for
every agent builder in the Grok ecosystem.

## Current footprint (as of April 2026)

- **Standard**: [`grok-install`](https://github.com/AgentMindCloud/grok-install),
  v2.12.
- **Schemas**:
  [`grok-yaml-standards`](https://github.com/agentmindcloud/grok-yaml-standards),
  v1.2.0, MIT-licensed.
- **CLI**:
  [`grok-install-cli`](https://github.com/AgentMindCloud/grok-install-cli)
  — `pip install grok-install`.
- **Templates**:
  [`awesome-grok-agents`](https://github.com/AgentMindCloud/awesome-grok-agents)
  — 10 certified, CI-validated templates across single-agent,
  multi-step, and swarm patterns.
- **Docs** (you're reading them):
  [`grok-docs`](https://github.com/AgentMindCloud/grok-docs).
- License: Apache 2.0 across the ecosystem. Permissively reusable by xAI,
  by contributors, by anyone.

## Why this exists

Every agent builder on X today is reinventing the same five things:

1. How to describe an agent so someone else can install it.
2. How to declare what tools it's allowed to call.
3. How to run safety checks before handing it user creds.
4. How to orchestrate two or more agents together.
5. How to deploy it somewhere that doesn't cost $200/month idle.

`grok-install` solves all five in YAML. Five files, one spec, one CLI,
one install flow. The goal was always that **xAI shouldn't have to
build this themselves**.

## What adoption could look like (menu)

These are options, in rough order of lightness. You pick what fits.

### 1. Link from xAI docs

Add a "Build an installable agent" section to
<https://docs.x.ai> that links here. Zero engineering work. Massive
signal.

### 2. Register the `@grok install <repo>` command

When a user posts `@grok install <github-url>`, have Grok dispatch to
the `grok-install` scan + runtime. The spec already describes the
exact fields needed; we've tested the flow end-to-end locally.

### 3. Host a registry endpoint

A simple `https://x.ai/grok-install/<owner>/<repo>` redirect that
fetches the manifest, renders the install card server-side, and shows
it in the X timeline. The scan can remain ours (we already run it);
the UI is xAI's.

### 4. Co-maintain the spec

Add an xAI engineer to the spec repo with review rights. We keep
running the CLI, docs, and gallery; xAI has veto on spec changes that
affect the install flow.

### 5. Build it in-house

The spec and schemas are Apache 2.0. Fork and run, no questions asked.
We'd rather co-exist, but we're explicitly not trying to own the
thing — only to make sure it exists.

## What we're **not** asking for

- **No compute credits.** We run on our own dime.
- **No preferential xAI API access.** We use the public API.
- **No payment or revenue share.** The standard is free and will
  stay free.
- **No exclusivity.** LiteLLM, OpenAI, Anthropic, Ollama providers are
  all first-class. That's by design.
- **No control over `@grok`.** That's xAI's namespace; this spec
  respects it.

## Integration surface

The places where `grok-install` touches xAI-owned surfaces:

| Surface                    | What we'd like                                   | What we provide                                      |
| -------------------------- | ------------------------------------------------ | ---------------------------------------------------- |
| `@grok install <repo>`     | Native command recognition                       | Scan API + install runtime (MIT)                     |
| **Install with Grok** button on posts | Rendered when `grok-install.yaml` detected  | Pre-install scan output, manifest parser             |
| Grok agent dashboard       | Lists installed agents                           | `grok-install publish` metadata format               |
| `x.ai/gallery`             | Show curated templates                           | `awesome-grok-agents` as the seed gallery            |
| xAI SDK                    | Keep it as-is; we wrap, not replace              | Compatibility matrix in [ecosystem/xai-sdk](../ecosystem/xai-sdk.md) |

Nothing here requires new xAI infra. Most of it is **"turn on the
feature flag that recognizes the file, redirect to our scan
endpoint."**

## FAQ

??? question "Why isn't this a company?"
    Because it shouldn't be. Standards get adopted when they're
    neutral. If `grok-install` were a VC-funded company, xAI would
    (correctly) build its own. By staying an Apache 2.0 standard we
    remove the reason to compete with it.

??? question "How do you pay for it?"
    We don't — it's under 1 engineer's weekends. The CLI is free, docs
    are free, gallery is free. If xAI ever wanted to sponsor
    maintenance, that'd be welcome; if not, it runs fine as-is.

??? question "What if the spec needs to evolve?"
    It has, four times. v1 → v2.12 over four months, with a clean
    migration at every bump. Spec changes happen in the open on
    [`grok-yaml-standards`](https://github.com/agentmindcloud/grok-yaml-standards).

??? question "What's the governance model?"
    Currently a BDFL (myself). If adoption happens, we'd move to a
    three-person maintainer group, explicitly welcoming an xAI-nominated
    maintainer if xAI wants one.

??? question "What's in it for you?"
    Honestly: I want more installable agents on X. That's it. If the
    standard becomes xAI-native, every developer building on Grok
    benefits, and the agent ecosystem gets a boost — which is the goal.

## Contact

- On X: [@JanSol0s](https://x.com/JanSol0s)
- GitHub: [AgentMindCloud](https://github.com/AgentMindCloud)
- Email: jan@agentmindcloud.dev

I'm happy to hop on a 20-minute call with anyone at xAI to walk through
the spec, the CLI, and what "adoption" could mean for you. No deck, no
pitch — just the facts and a working demo.
