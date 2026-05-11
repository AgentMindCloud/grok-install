---
title: LiteLLM
description: Run grok-install agents against OpenAI, Anthropic, Ollama, or any LiteLLM-supported provider.
---

# LiteLLM

[LiteLLM](https://github.com/BerriAI/litellm) gives `grok-install`
access to ~100+ providers through a unified API. Useful when:

- You want to compare model families on the same agent.
- Your org standardizes on a different provider.
- You run a local model via Ollama for dev.

## Installation

```bash
pip install grok-install litellm
```

## Configure the agent

```yaml
# grok-install.yaml
llm:
  provider: litellm
  model: openai/gpt-4o-mini
```

The `provider: litellm` tells the runtime to route completions through
the LiteLLM client. The `model:` field is a LiteLLM model identifier:

| Provider         | Example `model`                        |
| ---------------- | -------------------------------------- |
| OpenAI           | `openai/gpt-4o-mini`                   |
| Anthropic        | `anthropic/claude-sonnet-4-6`          |
| Ollama (local)   | `ollama/llama3.3`                      |
| Azure OpenAI     | `azure/my-deployment-id`               |
| Groq             | `groq/llama-3.3-70b-versatile`         |

## Env vars

LiteLLM reads provider creds from the env. Declare them in
`grok-install.yaml` so the install flow prompts the user:

```yaml
env:
  - OPENAI_API_KEY
```

## Mixing providers across agents

```yaml
agents:
  - id: researcher
    model: openai/gpt-4o        # OpenAI for heavy lifting
  - id: critic
    model: anthropic/claude-sonnet-4-6   # different family for diversity
  - id: publisher
    model: ollama/llama3.3      # local, cheap, fast for the final step
```

Every agent is routed through LiteLLM; each model identifier gets its
own provider credentials from the env.

## Cost and latency

LiteLLM adds a thin wrapping layer (~1–3ms). Not a concern for normal
agent workloads. If you're invoking the same provider at high volume,
prefer `provider: xai` (or the provider-native SDK) to bypass the
router.
