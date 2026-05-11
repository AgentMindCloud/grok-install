---
title: Tool schemas
description: How Grok tools are declared, validated, and invoked by agents.
---

# Tool schemas

Tools are the verbs an agent can use. They're declared by name in
`grok-agent.yaml`, scoped in `grok-security.yaml`, and backed by a
function the runtime resolves at boot.

## Declaring a tool

Inside your agent repo, drop a Python file under `tools/`:

```python
# tools/now.py
from grok_install.tools import tool
from datetime import datetime, timezone

@tool(
    name="now",
    description="Return the current UTC time as an ISO-8601 string.",
    parameters={},
)
def now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")
```

The decorator registers the tool with the runtime and generates the
JSON Schema the model uses to decide when to call it.

## Parameters

```python
@tool(
    name="web_search",
    description="Search the open web via Tavily.",
    parameters={
        "query": {"type": "string", "description": "Natural-language query"},
        "max_results": {"type": "integer", "minimum": 1, "maximum": 20, "default": 5},
    },
    required=["query"],
)
def web_search(query: str, max_results: int = 5) -> list[dict]:
    ...
```

The `parameters` block is a subset of JSON Schema. The runtime validates
the model's arguments before the function ever runs — malformed calls
are returned to the model as errors.

## Return values

Return anything JSON-serializable. Common patterns:

- Plain string → model treats as free-text.
- `list[dict]` → rendered as a numbered table in the conversation log.
- `dict` with an `error:` key → the runtime surfaces it as a tool
  failure, and the agent can retry.

## Wiring to an agent

```yaml
# .grok/grok-agent.yaml
agents:
  - id: greeter
    model: grok-4
    prompt_ref: greeter_system
    tools:
      - now
```

Every name in `tools:` must:

1. Resolve to a registered `@tool` in your `tools/` directory.
2. Appear under `permissions:` in `grok-security.yaml`:
   ```yaml
   permissions:
     - tool:now
   ```

If either check fails, `grok-install validate` errors before you can run.

## Requiring approval

High-impact tools (outbound posts, payments, destructive file ops)
should be human-gated:

```yaml
# .grok/grok-security.yaml
safety_profile: strict
permissions:
  - tool:post_reply
  - network:api.twitter.com
requires_approval:
  - post_reply
```

At runtime, every invocation of `post_reply` pauses the agent and
prompts the operator with the proposed arguments. See
[Safety profiles →](safety-profiles.md).

## Built-in tool library

The runtime ships a standard library you can enable without writing
code:

| Tool              | Purpose                                | Permissions needed            |
| ----------------- | -------------------------------------- | ----------------------------- |
| `now`             | UTC timestamp                          | `tool:now`                    |
| `http_get`        | Fetch a URL                            | `tool:http_get` + `network:*` |
| `web_search`      | Tavily search                          | `tool:web_search` + `network:api.tavily.com` |
| `fetch_mentions`  | Pull X mentions for authed user        | `tool:fetch_mentions` + `network:api.twitter.com` |
| `post_reply`      | Post a reply on X                      | `tool:post_reply` (gate it!)  |
| `fetch_arxiv`     | Query arXiv                            | `tool:fetch_arxiv` + `network:*.arxiv.org` |

Enable one with:

```yaml
tools:
  - web_search
```

```yaml
permissions:
  - tool:web_search
  - network:api.tavily.com
env:
  - TAVILY_API_KEY
```

## Testing tools

`grok-install test` runs the agent with **mocks** for every tool —
useful for CI. Override a mock:

```bash
grok-install test . --mock now=2026-04-17T14:32:00+00:00
```
