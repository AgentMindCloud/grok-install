# Contributing

Thanks for your interest in grok-install. This guide covers the basics.

## Setup

```bash
git clone https://github.com/AgentMindCloud/grok-install-v2.git
cd grok-install-v2
uv sync
```

## Lint and test

```bash
ruff check .
black --check .
mypy --strict cli
pytest tests/
```

## Branches

Use one of these patterns:

- `feature/<short-slug>` for new functionality.
- `fix/<short-slug>` for bug fixes.
- `docs/<short-slug>` for documentation-only changes.

## Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add YAML schema validator
fix: handle empty extensions block
docs: expand quickstart with finance agent
chore: bump ruff to 0.6
```

## Pull requests

- Open against `main`.
- Fill in the PR template.
- Ensure all CI workflows are green.
- One topic per PR.

## Code of conduct

Be respectful, attribute prior work, and keep discussions on-topic.
