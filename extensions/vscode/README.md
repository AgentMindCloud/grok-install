# GrokInstall YAML — VSCode language support

Syntax highlighting, language configuration, and snippets for `grok-install.yaml`
and the rest of the grok-install standards (`grok-agent`, `grok-config`,
`grok-workflow`, `grok-swarm`, `grok-voice`, …).

This extension lives in-tree at `extensions/vscode/` of the
[grok-install](https://github.com/AgentMindCloud/grok-install) repository.

## What it provides

- A TextMate grammar (`source.yaml.grok`) layered on top of the standard YAML
  grammar. Highlights `apiVersion`, `kind`, `metadata`, `spec`, and the
  recognised `kind:` values (`Agent`, `Workflow`, `Tool`, `Prompt`, `Model`,
  `Memory`, `MCPServer`, `Task`, `Pipeline`, `Policy`, `Dataset`, `Evaluation`,
  `Environment`, `Deployment`).
- A YAML-style language configuration (bracket pairs, indent rules, comment
  syntax).
- Skeleton snippets for the most common documents — `grok-install`,
  `grok-agent`, `grok-config`, `grok-workflow` — plus capability snippets
  (`post_thread`, `reply_to_mention`, `swarm_orchestrator`, `trend_to_thread`,
  `voice_response`).

## File patterns

The grammar and snippets activate for files matching:

- `grok-*.yaml`, `grok-*.yml`
- `.grok/**/*.yaml`, `.grok/**/*.yml`

## Local install

Marketplace publishing wires up in a later phase. To try the extension locally
from the repository checkout:

```
cd extensions/vscode
npx @vscode/vsce package
code --install-extension vscode-grok-yaml-*.vsix
```

## Branding

The extension icon source lives at `icon.svg` in the Cinnabar Glass design
language (see [`/DESIGN_SYSTEM.md`](../../DESIGN_SYSTEM.md)). Marketplace
requires a 128 × 128 PNG at `icon.png`; rasterize before publishing:

```bash
# librsvg — any platform
rsvg-convert -w 128 -h 128 icon.svg -o icon.png

# or Inkscape
inkscape icon.svg --export-type=png --export-width=128 --export-filename=icon.png
```

## License

Apache-2.0. See repository root [`LICENSE`](../../LICENSE).
