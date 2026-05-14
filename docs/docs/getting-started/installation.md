---
title: Install the CLI
description: Install grok-install, verify the toolchain, and set your env vars.
---

# Install the CLI

## Requirements

| Requirement | Version                                |
| ----------- | -------------------------------------- |
| Python      | 3.11+                                  |
| pip         | 24.0+ (`python -m pip install -U pip`) |
| xAI API key | Free tier works for local dev          |

## Install

=== "pip (recommended)"
    ```bash
    pip install grok-install
    ```

=== "pipx (isolated)"
    ```bash
    pipx install grok-install
    ```

=== "with xAI SDK extras"
    ```bash
    pip install 'grok-install[xai]'
    ```

=== "from source"
    ```bash
    git clone https://github.com/AgentMindCloud/grok-install-cli
    cd grok-install-cli
    pip install -e .
    ```

## Verify

```bash
grok-install --version
```

Expected output:

```
grok-install 2.12.x
```

## Set your API key

Get a key from <https://x.ai>. Then:

=== "bash / zsh"
    ```bash
    export XAI_API_KEY=sk-...
    # Persist it
    echo 'export XAI_API_KEY=sk-...' >> ~/.zshrc
    ```

=== "fish"
    ```fish
    set -Ux XAI_API_KEY sk-...
    ```

=== "Windows (PowerShell)"
    ```powershell
    [Environment]::SetEnvironmentVariable("XAI_API_KEY", "sk-...", "User")
    ```

!!! warning "Never commit keys"
    `grok-install` reads keys from the environment — there's no config
    file. If you put a key in YAML, the **X-side pre-install scan**
    (which runs when a user replies `@grok install this` to a post
    sharing your repo) rejects the agent and blocks the Install button.

## Shell completion (optional)

=== "bash"
    ```bash
    grok-install --install-completion bash
    ```

=== "zsh"
    ```bash
    grok-install --install-completion zsh
    ```

## Next

[Build your first agent →](first-agent.md)
