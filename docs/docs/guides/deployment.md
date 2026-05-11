---
title: Deployment
description: Production deployment patterns — secrets, logs, observability, rollback.
---

# Deployment

This guide goes beyond "run `deploy --target`". It covers the
operational pieces you need for real traffic.

See [Getting started → Deploy](../getting-started/deploy.md) first for
the per-target quickstart.

## Secret management

Rule: **no secrets in YAML**. The pre-install scanner fails the build
if it sees anything that looks like a key.

- **Dev**: `export XAI_API_KEY=...` in your shell, or `.env` (gitignored).
- **Vercel / Netlify**: Platform env var dashboard.
- **Railway / Render**: Service-level env vars.
- **Docker**: `--env-file` at run time, or inject via orchestrator
  (Kubernetes secrets, Nomad, ECS task definitions).
- **CI (GitHub Actions)**: `secrets.XAI_API_KEY` → jobs that call
  `grok-install scan` or `grok-install test`.

Every key in `grok-install.yaml` → `env:` must resolve at agent boot or
the runtime refuses to start.

## Logs

The runtime emits structured JSON to stdout. Minimal shape:

```json
{"ts":"2026-04-17T14:32:00Z","level":"info","event":"agent.tool.call","agent":"greeter","tool":"now","dur_ms":3}
```

Pipe to whatever your platform aggregates (Vercel Logs, Railway Logs,
Datadog, Loki, Cloud Logging). All runtime events are
`grok.*`-prefixed, so a single filter separates agent traffic from
framework noise.

## Scheduled agents

If `grok-install.yaml` declares:

```yaml
schedule:
  interval: 5m
```

...the agent boots, runs one iteration, and exits. Your platform's
scheduler ticks it. Generated deploy configs wire this for you on
Railway and Vercel Cron; Docker deployments need an external scheduler
(cron, systemd timer, Kubernetes CronJob).

## Cold start

| Platform | Typical cold start | Notes                                            |
| -------- | ------------------ | ------------------------------------------------ |
| Vercel   | ~1.5s              | Use `grok-4-mini` for sub-second first-token.    |
| Railway  | None (warm)        | Always-on dyno; pay for idle time.               |
| Docker   | Depends            | You own the scaling story.                       |
| Replit   | ~3s                | Good for personal, not for production traffic.   |

## Rollback

Agents are pure YAML + a Python tool directory. To roll back, revert
the commit and redeploy. The runtime doesn't hold onto state across
versions unless you explicitly write to a persistent store.

If you need blue-green behavior: deploy the new version to a second
endpoint, smoke-test with `grok-install install <repo>@<sha>` locally,
then swap the user-facing route.

## Observability

Add your own spans inside tools:

```python
from grok_install.obs import span

@tool(name="web_search", ...)
def web_search(query: str):
    with span("web_search.tavily", query_len=len(query)):
        return _tavily(query)
```

Spans emit to stdout as JSON by default. Export to OTel with:

```bash
export GROK_OBS_EXPORTER=otel
export OTEL_EXPORTER_OTLP_ENDPOINT=https://...
```

## Cost guardrails

Three levers, all in `grok-security.yaml`:

```yaml
rate_limits:
  tool_calls_per_minute: 30
  web_fetches_per_run: 60
  total_tokens_per_run: 100000
```

And one in `grok-agent.yaml` — `max_turns: N` caps runaway
reason-then-call loops at the conversation level.

## Zero-downtime config changes

Most edits are safe to hot-deploy. The exceptions:

| Change                                             | Safe? | Why                                              |
| -------------------------------------------------- | :---: | ------------------------------------------------ |
| Prompt text                                        | ✓     | Reloaded on next invocation.                     |
| Tool added + permission added                      | ✓     | New capability, no existing behavior broken.     |
| Tool removed from `permissions:`                   | ✗     | In-flight runs referencing the tool will 500.    |
| `spec:` bumped across minor version                | ✗     | Re-validate in staging first.                    |
| `safety_profile` strict → standard                 | ✗     | Re-review the scan output before shipping.       |
