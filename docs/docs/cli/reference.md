---
title: CLI reference
description: Every grok-install command — init, validate, scan, run, test, deploy, install, publish.
---

# CLI reference

The `grok-install` CLI parses YAML, scans for safety issues, runs agents
locally, and generates deploy configs for every major target.

## Install

=== "pip"
    ```bash
    pip install grok-install
    ```

=== "pip + xAI extras"
    ```bash
    pip install 'grok-install[xai]'
    ```

=== "from source"
    ```bash
    git clone https://github.com/AgentMindCloud/grok-install-cli
    cd grok-install-cli
    pip install -e .
    ```

Check it's installed:

```bash
grok-install --version
```

## Global flags

| Flag             | Description                                         |
| ---------------- | --------------------------------------------------- |
| `--help`         | Show help for any command.                          |
| `--version`      | Print CLI version.                                  |
| `--log-level`    | `debug` / `info` / `warning` / `error`. Default: `info`. |
| `--no-color`     | Disable ANSI color output.                          |
| `--config PATH`  | Override the `~/.grok/config.toml` path.            |

## Commands

### `grok-install init`

Scaffolds a new agent directory with the five-file layout pre-populated.

```bash
grok-install init <name> [--template <name>] [--mode simple|advanced]
```

| Flag         | Description                                                     |
| ------------ | --------------------------------------------------------------- |
| `--template` | Seed from a template in `awesome-grok-agents`. Default: `hello-grok`. |
| `--mode`     | `simple` (skip workflow file) or `advanced` (full layout).      |

Example:

```bash
grok-install init my-reply-bot --template reply-engagement-bot
```

### `grok-install validate`

Validates every `grok-*.yaml` file against its schema plus cross-file
references (tool permissions, prompt refs, workflow agent ids).

```bash
grok-install validate [PATH]
```

Exit codes: `0` success, `1` validation error, `2` I/O error.

### Pre-install scan (X-side, automatic)

There is no local `grok-install scan` subcommand in the shipped CLI.
The pre-install safety scan — tool permissions, network grants, bundled
secrets, and third-party dependencies — runs **on X's side** when a
user replies `@grok install this` to a post that shares your repo. A
clean scan reveals the **Install with Grok** button; a failing scan
blocks it.

For repo-level CI checks, use the in-tree
[GitHub Action](https://github.com/AgentMindCloud/grok-install/tree/main/action),
which today wraps `grok-install validate` against the v2.14 schema.

### `grok-install run`

Executes the agent locally. Reads env vars, boots the runtime, and
drops you into an interactive session (or runs the scheduled job once
if `schedule:` is set).

```bash
grok-install run [PATH] [--once] [--watch]
```

| Flag      | Description                                                    |
| --------- | -------------------------------------------------------------- |
| `--once`  | Run one iteration and exit. Useful for scheduled agents.       |
| `--watch` | Restart on file change. Your iteration loop.                   |

### `grok-install test`

Dry-run with mock tools. No network, no API keys, no side effects —
just verifies control flow and prompt rendering.

```bash
grok-install test [PATH] [--input path/to/fixture.json]
```

### `grok-install deploy`

Generates deployment artifacts for the target of your choice. Does not
push — you still commit the generated files yourself.

```bash
grok-install deploy [PATH] --target vercel|railway|docker|replit
```

=== "Vercel"
    Emits `vercel.json` + a `/api/agent.py` handler.

=== "Railway"
    Emits `railway.json`, `Procfile`, and `runtime.txt`.

=== "Docker"
    Emits `Dockerfile` + `.dockerignore` targeting `python:3.11-slim`.

=== "Replit"
    Emits `.replit` + `replit.nix`.

### `grok-install install`

The inverse of `publish`. Clone any remote agent repo, run the safety
scan, and execute it — the same flow Grok runs when a user taps
**Install with Grok** on X.

```bash
grok-install install <github-url-or-owner/repo>
```

Example:

```bash
grok-install install AgentMindCloud/hello-grok
```

### `grok-install publish`

Outputs the metadata block required for submission to
[`awesome-grok-agents`](https://github.com/AgentMindCloud/awesome-grok-agents).
Prints to stdout; pipe into a PR body.

```bash
grok-install publish [PATH] > metadata.json
```

## Python API

The CLI is a thin wrapper around the `grok_install` Python package.
Useful if you want to embed validation or scanning in another tool.

```python
from grok_install import validate, scan, load

spec = load("./my-agent")
report = validate(spec)          # raises on hard errors
findings = scan(spec)             # returns list[Finding]
```

See the [source repo](https://github.com/AgentMindCloud/grok-install-cli)
for the full surface.

## Troubleshooting

| Symptom                                          | Fix                                                               |
| ------------------------------------------------ | ----------------------------------------------------------------- |
| `Tool 'x' used by agent but not in permissions`  | Add `tool:x` to `grok-security.yaml` → `permissions`.             |
| `Prompt 'y' referenced but not defined`          | Add a `y:` key under `prompts:` in `grok-prompts.yaml`.           |
| `XAI_API_KEY is not set`                         | `export XAI_API_KEY=sk-...` or add it to `.env`; don't commit.    |
| `ConnectError: Permission denied for host z`     | Add `network:z` to `grok-security.yaml`.                          |
| `Schedule.interval parse error`                  | Use a duration literal: `30s`, `5m`, `2h`, `1d`.                  |
