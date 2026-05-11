# GrokInstall Validate & Scan — GitHub Action

Validate `.grok/` agent manifests in CI, run the safety scanner, surface results
as workflow annotations + a pinned PR comment, and generate a Grok-Native
Certified SVG badge.

This action lives in-tree at `action/` of the
[grok-install-v2](https://github.com/AgentMindCloud/grok-install-v2) repository.

## Usage

```yaml
name: grok-install
on:
  pull_request:
  push:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    permissions:
      contents: write       # for committing the badge on main
      pull-requests: write  # for posting the PR comment
    steps:
      - uses: actions/checkout@v4
      - uses: AgentMindCloud/grok-install-v2/action@v1
        with:
          working-directory: .
          mode: strict
```

## Inputs

| Input | Default | Description |
|---|---|---|
| `working-directory` | `.` | Repository root that contains `.grok/`. |
| `mode` | `strict` | `strict` (fail on errors) or `warn` (annotate only). |
| `cli-version` | `2.14.0` | Version of `grok-install-cli` to install (npm dist-tag or semver). |
| `visuals-preview` | `false` | Render an HTML visuals preview for each agent. Requires `cli-version >= 2.14.0`. |
| `update-badge` | `true` | Generate `badges/grok-native-certified.svg` and commit it on `main` pushes. |
| `comment-on-pr` | `true` | Post or update a PR comment with the validation + scan report. |
| `github-token` | `''` | Token for PR comments + badge commits. Falls back to `github.token`. |

## Outputs

| Output | Description |
|---|---|
| `passed` | `true` when validate + scan both succeeded under the selected mode. |
| `safety-score` | Numeric safety score 0-100 from the scanner. |
| `report-path` | Absolute path to the generated `report.json`. |
| `badge-path` | Path to the generated SVG badge (relative to `working-directory`). |
| `visuals-preview-url` | URL of the rendered visuals preview when enabled. |

## Modes

- `strict` — the action fails the workflow when validate or scan emits any
  error-level finding. Recommended for default branches and release gates.
- `warn` — the action posts the same annotations + PR comment but never fails.
  Useful for migrating an existing repository onto the standard.

## Layout

```
action/
  action.yml            # composite action manifest (Node 20)
  package.json          # pinned runtime deps for the scripts
  package-lock.json     # exact lockfile (consumed by `npm ci --omit=dev`)
  scripts/
    run.sh              # orchestrator: validate + scan + JSON normalization
    annotations.js      # ::error / ::warning / ::notice + job-summary table
    badge.js            # generates the Grok-Native Certified SVG badge
    comment.js          # posts or updates the pinned PR comment
```

## License

Apache-2.0. Covered by the repository root [`LICENSE`](../LICENSE).
