# grok-install

> The open standard for Grok agents on X.

![grok-install banner](assets/banner.svg)

## What is this

grok-install is a YAML manifest spec, a Python validator, and a GitHub Action
that turn any AI agent into a one-click install on X. One declarative
`grok-install.yaml` file describes the agent's runtime, prompts, tools, safety
profile, and X integration. The v2.14 schema is locked; eighteen ready-to-fork
templates cover everything from a daily brief bot to a multi-agent research
swarm.

## Quickstart

1. **Install the validator:**

   ```bash
   pip install grok-install
   ```

2. **Validate a manifest:**

   ```bash
   grok-install validate path/to/grok-install.yaml
   ```

3. **Install locally** on macOS, Linux, or Windows with the cross-platform
   runtime — see [xlOS](https://github.com/AgentMindCloud/xlOS) for `xlos install`.

4. **Or install on X.** Push the repo (with `grok-install.yaml` at the root),
   share the link in a post, and reply `@grok install this` to trigger the
   hosted mint + install flow. X runs the pre-install safety scan
   automatically before the **Install with Grok** button appears.

## Templates

Eight production templates live under [`templates/core/`](templates/core/):

- [`AlphaSignalBot.yaml`](templates/core/AlphaSignalBot.yaml) — daily market updates, technical-analysis replies, no financial advice.
- [`AskMe.yaml`](templates/core/AskMe.yaml) — Q&A bot for a topic of your choice.
- [`DailyBrief.yaml`](templates/core/DailyBrief.yaml) — morning summaries on a niche or topic.
- [`DevPilot.yaml`](templates/core/DevPilot.yaml) — API answers and coding tips for developers.
- [`DogeDoughAI.yaml`](templates/core/DogeDoughAI.yaml) — friendly AI for restaurants and local brands.
- [`ShowNotes.yaml`](templates/core/ShowNotes.yaml) — podcast and livestream summaries with timestamps.
- [`VibeReply.yaml`](templates/core/VibeReply.yaml) — light, tone-matched replies.
- [`VisualForge.yaml`](templates/core/VisualForge.yaml) — daily AI art with watermarked output.

Ten community-curated examples live under [`templates/community/`](templates/community/):

- [`code-reviewer.yaml`](templates/community/code-reviewer.yaml) — reviews GitHub PRs with Grok reasoning.
- [`hello-grok.yaml`](templates/community/hello-grok.yaml) — the simplest possible Grok agent.
- [`live-event-commentator.yaml`](templates/community/live-event-commentator.yaml) — X commentary on a live event with rate limits and a kill switch.
- [`personal-knowledge.yaml`](templates/community/personal-knowledge.yaml) — searchable memory of your X history.
- [`reply-engagement-bot.yaml`](templates/community/reply-engagement-bot.yaml) — drafts replies to mentions behind an approval gate.
- [`research-swarm.yaml`](templates/community/research-swarm.yaml) — researcher + critic + publisher swarm.
- [`scientific-discovery.yaml`](templates/community/scientific-discovery.yaml) — daily arXiv brief and the X discussion around it.
- [`thread-ghostwriter.yaml`](templates/community/thread-ghostwriter.yaml) — turns an idea into a polished X thread matched to your voice.
- [`trend-to-thread.yaml`](templates/community/trend-to-thread.yaml) — monitors X trends and drafts a full thread.
- [`voice-agent-x.yaml`](templates/community/voice-agent-x.yaml) — speak a post, review the transcript, approve, publish.

Validate the whole set with `grok-install validate templates/`.

## The standard

The canonical manifest schema is [`spec/v2.14/schema.json`](spec/v2.14/schema.json) —
JSON Schema 2020-12, locked at v2.14. Conformant parsers accept unknown
top-level keys and unknown `extensions:` sub-keys per the backward-compatibility
policy.

Fourteen sibling YAMLs under [`standards/`](standards/) declare reusable agent
components: `grok-agent`, `grok-workflow`, `grok-swarm`, `grok-tools`,
`grok-prompts`, `grok-voice`, `grok-security`, `grok-deploy`, `grok-config`,
`grok-test`, `grok-update`, `grok-docs`, `grok-analytics`, `grok-ui`.

## CLI

The Python CLI in this repo is the *validator*. For the cross-platform runtime
that actually installs `grok-install.yaml` manifests on macOS, Linux, and
Windows, see [xlOS](https://github.com/AgentMindCloud/xlOS).

## Action

Validate `.grok/` agents in CI with the in-tree GitHub Action at
[`action/`](action/). Composite action, Node 20, generates a Grok-Native
Certified SVG badge on `main` pushes. See [`action/README.md`](action/README.md)
for inputs, outputs, and a copy-paste workflow example.

## VSCode extension

Syntax highlighting, language configuration, and snippets for the
`grok-install.yaml` family live at [`extensions/vscode/`](extensions/vscode/).
Marketplace publishing wires up in a later phase; the extension is loadable
from source today.

## Docs

A full documentation site (built from [`docs/`](docs/) with mkdocs-material)
deploys via GitHub Pages. The URL is announced at the v1.0.0 release.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Community templates land via PR with a
passing `grok-install validate` check and a one-line description.

## License

Apache-2.0 — see [LICENSE](LICENSE) and [NOTICE](NOTICE).
