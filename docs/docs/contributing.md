---
title: Contributing
description: How to contribute to grok-install — spec changes, CLI fixes, docs, templates.
---

# Contributing

Four places to contribute, matching the four repos in the ecosystem.

| Area        | Repo                                                                                           | What lives there                  |
| ----------- | ---------------------------------------------------------------------------------------------- | --------------------------------- |
| Spec        | [`grok-install`](https://github.com/AgentMindCloud/grok-install)                               | Standard text + examples          |
| Schemas     | [`grok-yaml-standards`](https://github.com/agentmindcloud/grok-yaml-standards)                 | JSON Schemas, versioned           |
| CLI         | [`grok-install-cli`](https://github.com/AgentMindCloud/grok-install-cli)                       | `grok-install` command            |
| Templates   | [`awesome-grok-agents`](https://github.com/AgentMindCloud/awesome-grok-agents)                 | Certified agent templates         |
| Docs        | [`grok-docs`](https://github.com/AgentMindCloud/grok-docs) — this site                         | Everything you're reading         |

## Spec changes

Open a PR against
[`grok-yaml-standards`](https://github.com/agentmindcloud/grok-yaml-standards)
that includes:

1. Schema diff
2. Example YAML using the new field
3. A note under the appropriate version section

Breaking changes bump the major version (`v2.x` → `v3.0`), add a
migration note, and ship with a codemod in the CLI.

## CLI fixes and features

Open an issue on
[`grok-install-cli`](https://github.com/AgentMindCloud/grok-install-cli)
first, tag with `proposal`. We'll discuss scope before you start
coding. Once agreed:

```bash
git clone https://github.com/AgentMindCloud/grok-install-cli
cd grok-install-cli
pip install -e '.[dev]'
pytest
ruff check .
mypy .
```

## Docs fixes

This site is plain Markdown in `docs/`. Click **Edit on GitHub** on any
page to open the source directly. Run locally:

```bash
pip install -r requirements.txt
mkdocs serve
```

Then visit `http://localhost:8000`.

## New templates

Submit to
[`awesome-grok-agents`](https://github.com/AgentMindCloud/awesome-grok-agents)
using the template submission PR template. Your template will be
validated by CI — it must:

- Pass `grok-install validate` with zero errors
- Carry a `grok-security.yaml` that would pass the X-side pre-install
  scan (no `network:*` without justification, no hardcoded secrets,
  approvals gating destructive tools)
- Include a `README.md` with a one-paragraph description
- Include a short demo GIF or screenshot

## Code of conduct

Be kind. Assume good faith. No crypto scams, no spam agents, no
scraping private data. If you're unsure whether your template crosses
a line, ask in the issue tracker before writing code.

## Becoming a maintainer

We accept maintainer nominations after three accepted, non-trivial PRs
to any repo. Maintainers get review rights on their area of focus and
a vote in spec decisions.
