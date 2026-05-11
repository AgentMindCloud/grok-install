---
title: Deploy to production
description: Ship your agent to Vercel, Railway, Docker, or Replit — config generated for you.
---

# Deploy to production

`grok-install deploy` generates a deployment config for the target you
pick. It does **not** push — you commit the generated files yourself and
trust your platform of choice.

## Pick a target

| Target  | Best for                               | Cold start | Schedules |
| ------- | -------------------------------------- | ---------- | --------- |
| Vercel  | HTTP agents, webhook handlers          | ~1.5s      | Cron      |
| Railway | Long-running schedulers, scrapers      | persistent | Built-in  |
| Docker  | Self-hosted, on-prem, custom K8s       | depends    | External  |
| Replit  | Hackathons, low-stakes shared envs     | ~3s        | Replit Cron |

## Vercel

```bash
grok-install deploy . --target vercel
```

Emits:

- `vercel.json` — route config
- `api/agent.py` — Vercel Python runtime handler
- `requirements.txt` — pinned deps

Push and deploy:

```bash
git add vercel.json api/ requirements.txt
git commit -m "deploy: vercel"
vercel --prod
```

Set `XAI_API_KEY` in the Vercel dashboard under **Settings → Environment
Variables**. Any other env var from `grok-install.yaml` → `env:` needs
to be added here too.

## Railway

```bash
grok-install deploy . --target railway
```

Emits `railway.json`, `Procfile`, `runtime.txt`.

```bash
railway login
railway link
railway up
```

For scheduled agents (`schedule.interval: 5m`) Railway's built-in cron
picks up the `worker:` process in the Procfile automatically.

## Docker

```bash
grok-install deploy . --target docker
docker build -t my-agent .
docker run --rm -e XAI_API_KEY=$XAI_API_KEY my-agent
```

The generated `Dockerfile` targets `python:3.11-slim` with a non-root
user and a read-only filesystem by default. If your agent writes to
disk, flip `--read-only` off in your run command.

## Replit

```bash
grok-install deploy . --target replit
```

Commit, then click **Import from GitHub** in Replit. The `.replit` file
pins the run command.

## Common deployment pitfalls

!!! failure "Missing env var in the platform"
    Every name in `grok-install.yaml` → `env:` must also exist in your
    platform's secret manager, or the agent refuses to boot.

!!! failure "Schedule not firing"
    Railway + Vercel require the schedule to be configured in *their*
    system too. `schedule:` in YAML is the declaration; the platform
    still needs to actually tick the clock.

!!! failure "Network permission denied in production"
    `grok-security.yaml` is enforced identically in dev and prod. If a
    tool talks to a new host, add it to `permissions:` and redeploy.
