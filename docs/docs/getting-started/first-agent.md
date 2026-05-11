---
title: Your first agent (10 min)
description: Build, validate, and run a working Grok agent in ten minutes. Copy-paste friendly.
---

# Your first agent

Estimated time: **10 minutes**. You'll have a working, validated,
locally-running agent when you're done.

## What you'll build

A greeter agent that says hello and tells the user the current time.
It's the simplest possible shape of a `grok-install` agent: one
`grok-install.yaml` at the root, one `.grok/grok-agent.yaml` underneath,
one prompt, one tool, one safety profile.

## Step 1 — Scaffold (30 sec)

```bash
grok-install init hello-grok --template hello-grok
cd hello-grok
```

Look at what got created:

```
hello-grok/
├── grok-install.yaml
└── .grok/
    ├── grok-agent.yaml
    ├── grok-prompts.yaml
    └── grok-security.yaml
```

## Step 2 — Inspect `grok-install.yaml` (1 min)

```yaml
spec: grok-install/v2.12
name: hello-grok
description: The simplest possible Grok agent. Single agent, single tool.
entrypoint: .grok/grok-agent.yaml
model: grok-4
runtime:
  python: ">=3.11"
env:
  - XAI_API_KEY
```

Everything here is [documented in the spec](../v2.12/spec/grok-install-yaml.md).
Notice: no hard-coded keys, no secrets — just the **name** of the env
var the agent will read.

## Step 3 — Inspect `.grok/grok-agent.yaml` (1 min)

```yaml
agents:
  - id: greeter
    model: grok-4
    prompt_ref: greeter_system
    tools:
      - now
    max_turns: 4
```

One agent called `greeter`, using the `grok-4` model, reading its system
prompt from `grok-prompts.yaml`, allowed to call the `now` tool, capped
at 4 turns. [Full spec →](../v2.12/spec/grok-agent-yaml.md)

## Step 4 — Inspect the prompt (30 sec)

`.grok/grok-prompts.yaml`:

```yaml
prompts:
  greeter_system: |
    You are a friendly Grok agent whose only job is to greet the user and,
    if asked, tell them the current time via the `now` tool. Keep replies
    to two sentences.
```

## Step 5 — Inspect security (30 sec)

`.grok/grok-security.yaml`:

```yaml
safety_profile: standard
permissions:
  - tool:now
requires_approval: []
rate_limits:
  tool_calls_per_minute: 30
```

The agent can call `now` and nothing else. No network. No filesystem.
[Safety profiles deep dive →](../guides/safety-profiles.md)

## Step 6 — Validate (5 sec)

```bash
grok-install validate .
```

Expected:

```
✓ grok-install.yaml        schema OK
✓ .grok/grok-agent.yaml    schema OK, 1 agent
✓ .grok/grok-prompts.yaml  schema OK, 1 prompt
✓ .grok/grok-security.yaml schema OK, 1 tool
✓ cross-refs: prompt_ref[greeter_system] ✓, tool[now] ✓
```

## Step 7 — Scan (5 sec)

```bash
grok-install scan .
```

This is the same pre-install scan Grok runs when a user taps **Install
with Grok**. You'll see: profile, permission summary, any network
reach, and verdict.

## Step 8 — Run it (2 min)

```bash
export XAI_API_KEY=sk-...
grok-install run .
```

You'll drop into an interactive session:

```
greeter › hello
Hi there — welcome aboard. It's 14:32 UTC.
greeter › _
```

## Step 9 — Iterate (2 min)

Change the prompt to taste. Edit `.grok/grok-prompts.yaml`, make the
greeter sarcastic:

```yaml
prompts:
  greeter_system: |
    You are a dry, slightly snarky greeter. Still helpful. Two sentences
    max. If asked the time, call `now`.
```

Re-run with `--watch` to hot-reload on save:

```bash
grok-install run . --watch
```

## Step 10 — Publish (1 min)

Commit and push:

```bash
git init
git add .
git commit -m "My first Grok agent"
gh repo create hello-grok --public --source=. --push
```

Post the link on X with a note. Anyone can tap **Install with Grok**.

## Where next

<div class="grok-features" markdown>

<div class="grok-feature" markdown>
### [Deploy it →](deploy.md)
Vercel, Railway, Docker, Replit — pick your target.
</div>

<div class="grok-feature" markdown>
### [Add a second agent →](../guides/multi-agent-swarms.md)
Chain two agents together with `grok-workflow.yaml`.
</div>

<div class="grok-feature" markdown>
### [Give it tools →](../guides/tool-schemas.md)
Web search, page fetch, custom functions.
</div>

</div>
