# grok-install — Comprehensive File Inventory & Size Audit

| | |
|---|---|
| **Repository** | `AgentMindCloud/grok-install` |
| **Audit target** | `main` branch |
| **Commit audited** | `7fb4294775e7fe53ed140539282be7288c41b815` |
| **Commit subject** | `chore(release): finalize v1.0.0 preparation (PyPI decision, CHANGELOG, version reporting) (#25)` |
| **Commit date** | 2026-05-15 |
| **Audit date** | 2026-05-15 |
| **Method** | `git ls-tree -r --long origin/main` for authoritative blob sizes; `git log -1 --format=%cs origin/main -- <path>` for last-commit date per file; full content inspection by 6 parallel agents. Sizes are exact git blob byte counts. |

---

## Summary

| Metric | Value |
|---|---|
| **Total files** | **227** |
| **Total size** | **886,668 bytes** (≈ 865.89 KiB ≈ 0.85 MiB) |
| Date range (last-commit) | 2026-05-11 → 2026-05-15 |
| HTML files | 4 (`website/index.html`, `website/standard.html`, `website/templates.html`, `docs/overrides/main.html`) |
| JavaScript files (total) | 23 — of which **18 are Worker JS** (`worker/**.js`); 3 are docs frontend JS; 4 are action scripts (3 `.js` + 1 `.sh`) |
| Markdown files | 71 |
| JSON files | 47 (34 are JSON Schemas under `docs/docs/assets/schemas/`) |
| YAML files (`.yaml`/`.yml`) | 47 |
| Python files | 11 (4 in `src/grok_install/`, 7 in `tests/`) |
| CSS files | 3 (`website/style.css`, `docs/docs/stylesheets/extra.css`, `assets/brand/tokens.css`) |
| Web fonts (`.woff2`) | 3 (all in `website/fonts/`) |
| SVG files | 3 (`assets/banner.svg`, `docs/docs/assets/img/favicon.svg`, `docs/docs/assets/img/logo.svg`) |
| Docs site files (`docs/`) | 94 (60 prose/asset/config + 34 schema JSON) |

### Size by top-level group

| Group | Files | Bytes |
|---|---:|---:|
| `(root)` | 10 | 30,701 |
| `.github/` | 9 | 13,626 |
| `action/` | 8 | 38,656 |
| `assets/` | 4 | 10,996 |
| `docs/` (prose/asset/config) | 60 | 229,606 |
| `docs/docs/assets/schemas/` | 34 | 218,905 |
| `extensions/` | 13 | 14,218 |
| `spec/` | 5 | 6,964 |
| `src/` | 5 | 7,351 |
| `standards/` | 14 | 14,356 |
| `templates/` | 20 | 26,766 |
| `tests/` | 15 | 8,579 |
| `website/` | 7 | 92,815 |
| `worker/` | 23 | 173,129 |
| **TOTAL** | **227** | **886,668** |

---

## Complete File Inventory (grouped by folder)

> Every one of the 227 tracked files on `main`, with exact git blob size in bytes and the date of the last commit that touched it.

### `(root)` — 10 files, 30,701 bytes

| Path | Size (bytes) | Last commit |
|---|---:|---|
| `.editorconfig` | 247 | 2026-05-11 |
| `.gitignore` | 898 | 2026-05-11 |
| `CHANGELOG.md` | 3,853 | 2026-05-15 |
| `CONTRIBUTING.md` | 921 | 2026-05-14 |
| `LICENSE` | 11,357 | 2026-05-11 |
| `NOTICE` | 195 | 2026-05-11 |
| `README.md` | 5,150 | 2026-05-15 |
| `RELEASING.md` | 5,481 | 2026-05-15 |
| `SECURITY.md` | 865 | 2026-05-14 |
| `pyproject.toml` | 1,734 | 2026-05-15 |

### `.github/` — 9 files, 13,626 bytes

| Path | Size (bytes) | Last commit |
|---|---:|---|
| `.github/CODEOWNERS` | 12 | 2026-05-11 |
| `.github/ISSUE_TEMPLATE/bug_report.md` | 440 | 2026-05-11 |
| `.github/ISSUE_TEMPLATE/feature_request.md` | 313 | 2026-05-11 |
| `.github/PULL_REQUEST_TEMPLATE.md` | 417 | 2026-05-11 |
| `.github/workflows/lint.yml` | 449 | 2026-05-11 |
| `.github/workflows/pages.yml` | 2,281 | 2026-05-11 |
| `.github/workflows/release.yml` | 7,941 | 2026-05-11 |
| `.github/workflows/test.yml` | 1,313 | 2026-05-11 |
| `.github/workflows/validate-templates.yml` | 460 | 2026-05-11 |

### `action/` — 8 files, 38,656 bytes

| Path | Size (bytes) | Last commit |
|---|---:|---|
| `action/README.md` | 2,851 | 2026-05-14 |
| `action/action.yml` | 6,215 | 2026-05-11 |
| `action/package-lock.json` | 13,228 | 2026-05-11 |
| `action/package.json` | 757 | 2026-05-14 |
| `action/scripts/annotations.js` | 3,331 | 2026-05-11 |
| `action/scripts/badge.js` | 3,645 | 2026-05-11 |
| `action/scripts/comment.js` | 3,992 | 2026-05-11 |
| `action/scripts/run.sh` | 4,637 | 2026-05-11 |

### `assets/` — 4 files, 10,996 bytes

| Path | Size (bytes) | Last commit |
|---|---:|---|
| `assets/banner.svg` | 6,323 | 2026-05-14 |
| `assets/brand/CINNABAR-GLASS.md` | 3,934 | 2026-05-14 |
| `assets/brand/tokens.css` | 371 | 2026-05-14 |
| `assets/brand/tokens.json` | 368 | 2026-05-14 |

### `docs/` — 60 files, 229,606 bytes

| Path | Size (bytes) | Last commit |
|---|---:|---|
| `docs/docs/assets/img/favicon.svg` | 338 | 2026-05-11 |
| `docs/docs/assets/img/logo.svg` | 702 | 2026-05-11 |
| `docs/docs/cli/reference.md` | 5,717 | 2026-05-11 |
| `docs/docs/contributing.md` | 2,966 | 2026-05-11 |
| `docs/docs/ecosystem/index.md` | 745 | 2026-05-11 |
| `docs/docs/ecosystem/litellm.md` | 2,000 | 2026-05-11 |
| `docs/docs/ecosystem/semantic-kernel.md` | 2,109 | 2026-05-11 |
| `docs/docs/ecosystem/xai-sdk.md` | 1,969 | 2026-05-11 |
| `docs/docs/for-xai/adoption-guide.md` | 6,586 | 2026-05-11 |
| `docs/docs/gallery/index.md` | 1,268 | 2026-05-11 |
| `docs/docs/gallery/multi-step.md` | 2,907 | 2026-05-11 |
| `docs/docs/gallery/single-agent.md` | 1,161 | 2026-05-11 |
| `docs/docs/gallery/swarm.md` | 1,509 | 2026-05-11 |
| `docs/docs/getting-started/deploy.md` | 2,717 | 2026-05-11 |
| `docs/docs/getting-started/first-agent.md` | 4,151 | 2026-05-11 |
| `docs/docs/getting-started/index.md` | 683 | 2026-05-11 |
| `docs/docs/getting-started/installation.md` | 1,721 | 2026-05-15 |
| `docs/docs/guides/deployment.md` | 4,229 | 2026-05-11 |
| `docs/docs/guides/index.md` | 976 | 2026-05-11 |
| `docs/docs/guides/multi-agent-swarms.md` | 4,885 | 2026-05-11 |
| `docs/docs/guides/safety-profiles.md` | 4,170 | 2026-05-11 |
| `docs/docs/guides/tool-schemas.md` | 3,797 | 2026-05-11 |
| `docs/docs/guides/x-integration.md` | 4,802 | 2026-05-11 |
| `docs/docs/index.md` | 4,748 | 2026-05-11 |
| `docs/docs/javascripts/extra.js` | 5,127 | 2026-05-11 |
| `docs/docs/javascripts/playground.js` | 24,686 | 2026-05-11 |
| `docs/docs/playground/index.md` | 4,735 | 2026-05-11 |
| `docs/docs/playground/v2.14.md` | 3,887 | 2026-05-11 |
| `docs/docs/robots.txt` | 87 | 2026-05-11 |
| `docs/docs/stylesheets/extra.css` | 20,444 | 2026-05-11 |
| `docs/docs/v2.12/index.md` | 2,857 | 2026-05-11 |
| `docs/docs/v2.12/spec/grok-agent-yaml.md` | 2,963 | 2026-05-11 |
| `docs/docs/v2.12/spec/grok-install-yaml.md` | 4,265 | 2026-05-11 |
| `docs/docs/v2.12/spec/grok-prompts-yaml.md` | 3,092 | 2026-05-11 |
| `docs/docs/v2.12/spec/grok-security-yaml.md` | 4,212 | 2026-05-11 |
| `docs/docs/v2.12/spec/grok-workflow-yaml.md` | 3,944 | 2026-05-11 |
| `docs/docs/v2.12/spec/index.md` | 3,219 | 2026-05-11 |
| `docs/docs/v2.13/index.md` | 3,492 | 2026-05-11 |
| `docs/docs/v2.13/migration-from-v2.12.md` | 3,396 | 2026-05-11 |
| `docs/docs/v2.13/release-notes.md` | 2,752 | 2026-05-11 |
| `docs/docs/v2.13/spec/grok-agent-yaml.md` | 2,808 | 2026-05-11 |
| `docs/docs/v2.13/spec/grok-analytics-yaml.md` | 3,237 | 2026-05-11 |
| `docs/docs/v2.13/spec/grok-config-yaml.md` | 3,737 | 2026-05-11 |
| `docs/docs/v2.13/spec/grok-deploy-yaml.md` | 4,060 | 2026-05-11 |
| `docs/docs/v2.13/spec/grok-docs-yaml.md` | 3,219 | 2026-05-11 |
| `docs/docs/v2.13/spec/grok-prompts-yaml.md` | 2,745 | 2026-05-11 |
| `docs/docs/v2.13/spec/grok-security-yaml.md` | 3,918 | 2026-05-11 |
| `docs/docs/v2.13/spec/grok-test-yaml.md` | 3,669 | 2026-05-11 |
| `docs/docs/v2.13/spec/grok-tools-yaml.md` | 3,817 | 2026-05-11 |
| `docs/docs/v2.13/spec/grok-ui-yaml.md` | 3,057 | 2026-05-11 |
| `docs/docs/v2.13/spec/grok-update-yaml.md` | 3,367 | 2026-05-11 |
| `docs/docs/v2.13/spec/grok-workflow-yaml.md` | 3,775 | 2026-05-11 |
| `docs/docs/v2.13/spec/index.md` | 2,549 | 2026-05-11 |
| `docs/docs/v2.14/accessibility.md` | 4,703 | 2026-05-11 |
| `docs/docs/v2.14/index.md` | 2,414 | 2026-05-11 |
| `docs/docs/v2.14/migration.md` | 2,685 | 2026-05-11 |
| `docs/docs/v2.14/visuals.md` | 7,861 | 2026-05-11 |
| `docs/mkdocs.yml` | 6,633 | 2026-05-14 |
| `docs/overrides/main.html` | 1,080 | 2026-05-11 |
| `docs/requirements.txt` | 258 | 2026-05-11 |

### `docs/docs/assets/schemas/` — 34 files, 218,905 bytes

| Path | Size (bytes) | Last commit |
|---|---:|---|
| `docs/docs/assets/schemas/latest/grok-agent.json` | 10,297 | 2026-05-11 |
| `docs/docs/assets/schemas/latest/grok-analytics.json` | 6,363 | 2026-05-11 |
| `docs/docs/assets/schemas/latest/grok-config.json` | 7,301 | 2026-05-11 |
| `docs/docs/assets/schemas/latest/grok-deploy.json` | 9,092 | 2026-05-11 |
| `docs/docs/assets/schemas/latest/grok-docs.json` | 5,127 | 2026-05-11 |
| `docs/docs/assets/schemas/latest/grok-prompts.json` | 4,546 | 2026-05-11 |
| `docs/docs/assets/schemas/latest/grok-security.json` | 5,998 | 2026-05-11 |
| `docs/docs/assets/schemas/latest/grok-swarm.json` | 5,881 | 2026-05-11 |
| `docs/docs/assets/schemas/latest/grok-test.json` | 5,052 | 2026-05-11 |
| `docs/docs/assets/schemas/latest/grok-tools.json` | 7,224 | 2026-05-11 |
| `docs/docs/assets/schemas/latest/grok-ui.json` | 9,555 | 2026-05-11 |
| `docs/docs/assets/schemas/latest/grok-update.json` | 4,664 | 2026-05-11 |
| `docs/docs/assets/schemas/latest/grok-voice.json` | 8,476 | 2026-05-11 |
| `docs/docs/assets/schemas/latest/grok-workflow.json` | 13,433 | 2026-05-11 |
| `docs/docs/assets/schemas/v2.0.0/grok-agent.json` | 10,297 | 2026-05-11 |
| `docs/docs/assets/schemas/v2.0.0/grok-analytics.json` | 6,363 | 2026-05-11 |
| `docs/docs/assets/schemas/v2.0.0/grok-config.json` | 7,301 | 2026-05-11 |
| `docs/docs/assets/schemas/v2.0.0/grok-deploy.json` | 9,092 | 2026-05-11 |
| `docs/docs/assets/schemas/v2.0.0/grok-docs.json` | 5,127 | 2026-05-11 |
| `docs/docs/assets/schemas/v2.0.0/grok-prompts.json` | 4,546 | 2026-05-11 |
| `docs/docs/assets/schemas/v2.0.0/grok-security.json` | 5,998 | 2026-05-11 |
| `docs/docs/assets/schemas/v2.0.0/grok-swarm.json` | 5,881 | 2026-05-11 |
| `docs/docs/assets/schemas/v2.0.0/grok-test.json` | 5,052 | 2026-05-11 |
| `docs/docs/assets/schemas/v2.0.0/grok-tools.json` | 7,224 | 2026-05-11 |
| `docs/docs/assets/schemas/v2.0.0/grok-ui.json` | 9,555 | 2026-05-11 |
| `docs/docs/assets/schemas/v2.0.0/grok-update.json` | 4,664 | 2026-05-11 |
| `docs/docs/assets/schemas/v2.0.0/grok-voice.json` | 8,476 | 2026-05-11 |
| `docs/docs/assets/schemas/v2.0.0/grok-workflow.json` | 13,433 | 2026-05-11 |
| `docs/docs/assets/schemas/v2.12/grok-agent.schema.json` | 1,404 | 2026-05-11 |
| `docs/docs/assets/schemas/v2.12/grok-install.schema.json` | 1,832 | 2026-05-11 |
| `docs/docs/assets/schemas/v2.12/grok-prompts.schema.json` | 626 | 2026-05-11 |
| `docs/docs/assets/schemas/v2.12/grok-security.schema.json` | 1,395 | 2026-05-11 |
| `docs/docs/assets/schemas/v2.12/grok-workflow.schema.json` | 1,467 | 2026-05-11 |
| `docs/docs/assets/schemas/v2.14/grok-visuals.schema.json` | 6,163 | 2026-05-11 |

### `extensions/` — 13 files, 14,218 bytes

| Path | Size (bytes) | Last commit |
|---|---:|---|
| `extensions/vscode/README.md` | 1,531 | 2026-05-14 |
| `extensions/vscode/language-configuration.json` | 602 | 2026-05-11 |
| `extensions/vscode/package.json` | 1,955 | 2026-05-14 |
| `extensions/vscode/snippets/grok-agent.json` | 1,645 | 2026-05-11 |
| `extensions/vscode/snippets/grok-config.json` | 1,242 | 2026-05-11 |
| `extensions/vscode/snippets/grok-install.json` | 2,000 | 2026-05-11 |
| `extensions/vscode/snippets/grok-workflow.json` | 1,842 | 2026-05-11 |
| `extensions/vscode/snippets/post_thread.code-snippets` | 334 | 2026-05-11 |
| `extensions/vscode/snippets/reply_to_mention.code-snippets` | 453 | 2026-05-11 |
| `extensions/vscode/snippets/swarm_orchestrator.code-snippets` | 835 | 2026-05-11 |
| `extensions/vscode/snippets/trend_to_thread.code-snippets` | 538 | 2026-05-11 |
| `extensions/vscode/snippets/voice_response.code-snippets` | 591 | 2026-05-11 |
| `extensions/vscode/syntaxes/grok-yaml.tmLanguage.json` | 650 | 2026-05-11 |

### `spec/` — 5 files, 6,964 bytes

| Path | Size (bytes) | Last commit |
|---|---:|---|
| `spec/README.md` | 176 | 2026-05-11 |
| `spec/v2.14/README.md` | 228 | 2026-05-11 |
| `spec/v2.14/extensions/README.md` | 998 | 2026-05-11 |
| `spec/v2.14/grok-install.yaml` | 1,359 | 2026-05-14 |
| `spec/v2.14/schema.json` | 4,203 | 2026-05-11 |

### `src/` — 5 files, 7,351 bytes

| Path | Size (bytes) | Last commit |
|---|---:|---|
| `src/grok_install/README.md` | 398 | 2026-05-11 |
| `src/grok_install/__init__.py` | 55 | 2026-05-15 |
| `src/grok_install/_utils.py` | 1,774 | 2026-05-11 |
| `src/grok_install/main.py` | 670 | 2026-05-11 |
| `src/grok_install/validate.py` | 4,454 | 2026-05-11 |

### `standards/` — 14 files, 14,356 bytes

| Path | Size (bytes) | Last commit |
|---|---:|---|
| `standards/grok-agent.yaml` | 687 | 2026-05-11 |
| `standards/grok-analytics.yaml` | 1,218 | 2026-05-11 |
| `standards/grok-config.yaml` | 918 | 2026-05-11 |
| `standards/grok-deploy.yaml` | 1,557 | 2026-05-11 |
| `standards/grok-docs.yaml` | 524 | 2026-05-11 |
| `standards/grok-prompts.yaml` | 845 | 2026-05-11 |
| `standards/grok-security.yaml` | 484 | 2026-05-11 |
| `standards/grok-swarm.yaml` | 1,105 | 2026-05-11 |
| `standards/grok-test.yaml` | 769 | 2026-05-11 |
| `standards/grok-tools.yaml` | 1,993 | 2026-05-11 |
| `standards/grok-ui.yaml` | 1,578 | 2026-05-11 |
| `standards/grok-update.yaml` | 659 | 2026-05-11 |
| `standards/grok-voice.yaml` | 1,029 | 2026-05-11 |
| `standards/grok-workflow.yaml` | 990 | 2026-05-11 |

### `templates/` — 20 files, 26,766 bytes

| Path | Size (bytes) | Last commit |
|---|---:|---|
| `templates/README.md` | 364 | 2026-05-11 |
| `templates/community/README.md` | 1,236 | 2026-05-11 |
| `templates/community/code-reviewer.yaml` | 1,063 | 2026-05-11 |
| `templates/community/hello-grok.yaml` | 473 | 2026-05-11 |
| `templates/community/live-event-commentator.yaml` | 378 | 2026-05-11 |
| `templates/community/personal-knowledge.yaml` | 363 | 2026-05-11 |
| `templates/community/reply-engagement-bot.yaml` | 424 | 2026-05-11 |
| `templates/community/research-swarm.yaml` | 300 | 2026-05-11 |
| `templates/community/scientific-discovery.yaml` | 352 | 2026-05-11 |
| `templates/community/thread-ghostwriter.yaml` | 1,173 | 2026-05-11 |
| `templates/community/trend-to-thread.yaml` | 1,159 | 2026-05-11 |
| `templates/community/voice-agent-x.yaml` | 1,341 | 2026-05-11 |
| `templates/core/AlphaSignalBot.yaml` | 2,278 | 2026-05-14 |
| `templates/core/AskMe.yaml` | 2,256 | 2026-05-14 |
| `templates/core/DailyBrief.yaml` | 2,257 | 2026-05-14 |
| `templates/core/DevPilot.yaml` | 2,256 | 2026-05-14 |
| `templates/core/DogeDoughAI.yaml` | 2,290 | 2026-05-14 |
| `templates/core/ShowNotes.yaml` | 2,261 | 2026-05-14 |
| `templates/core/VibeReply.yaml` | 2,269 | 2026-05-14 |
| `templates/core/VisualForge.yaml` | 2,273 | 2026-05-14 |

### `tests/` — 15 files, 8,579 bytes

| Path | Size (bytes) | Last commit |
|---|---:|---|
| `tests/README.md` | 140 | 2026-05-11 |
| `tests/__init__.py` | 0 | 2026-05-11 |
| `tests/conftest.py` | 192 | 2026-05-11 |
| `tests/fixtures/invalid_bad_slug.yaml` | 162 | 2026-05-11 |
| `tests/fixtures/invalid_bad_target.yaml` | 171 | 2026-05-11 |
| `tests/fixtures/invalid_missing_version.yaml` | 138 | 2026-05-11 |
| `tests/fixtures/invalid_wrong_version.yaml` | 163 | 2026-05-11 |
| `tests/fixtures/valid_full.yaml` | 730 | 2026-05-11 |
| `tests/fixtures/valid_minimal.yaml` | 162 | 2026-05-11 |
| `tests/fixtures/valid_unknown_extension.yaml` | 235 | 2026-05-11 |
| `tests/test_cli.py` | 821 | 2026-05-15 |
| `tests/test_core_templates.py` | 639 | 2026-05-11 |
| `tests/test_standards.py` | 775 | 2026-05-11 |
| `tests/test_templates.py` | 787 | 2026-05-11 |
| `tests/test_validate.py` | 3,464 | 2026-05-11 |

### `website/` — 7 files, 92,815 bytes

| Path | Size (bytes) | Last commit |
|---|---:|---|
| `website/fonts/IBMPlexMono-Bold.woff2` | 14,908 | 2026-05-11 |
| `website/fonts/IBMPlexMono-Regular.woff2` | 14,708 | 2026-05-11 |
| `website/fonts/InstrumentSerif-Italic.woff2` | 22,128 | 2026-05-11 |
| `website/index.html` | 6,866 | 2026-05-14 |
| `website/standard.html` | 9,885 | 2026-05-14 |
| `website/style.css` | 13,628 | 2026-05-11 |
| `website/templates.html` | 10,692 | 2026-05-14 |

### `worker/` — 23 files, 173,129 bytes

| Path | Size (bytes) | Last commit |
|---|---:|---|
| `worker/DEPLOY.md` | 17,348 | 2026-05-15 |
| `worker/README.md` | 1,130 | 2026-05-15 |
| `worker/package-lock.json` | 51,849 | 2026-05-15 |
| `worker/package.json` | 416 | 2026-05-15 |
| `worker/src/handlers/api.js` | 27,466 | 2026-05-15 |
| `worker/src/handlers/auth.js` | 6,559 | 2026-05-11 |
| `worker/src/handlers/dashboard.js` | 15,762 | 2026-05-11 |
| `worker/src/handlers/manifest.js` | 5,365 | 2026-05-11 |
| `worker/src/index.js` | 5,968 | 2026-05-11 |
| `worker/src/lib/genesis.js` | 1,740 | 2026-05-11 |
| `worker/src/lib/github.js` | 8,239 | 2026-05-11 |
| `worker/src/lib/kv.js` | 1,465 | 2026-05-11 |
| `worker/src/lib/logger.js` | 687 | 2026-05-11 |
| `worker/src/lib/mascots.js` | 2,999 | 2026-05-11 |
| `worker/src/lib/pkce.js` | 911 | 2026-05-11 |
| `worker/src/lib/prompts.js` | 2,673 | 2026-05-15 |
| `worker/src/lib/repo-template.js` | 9,124 | 2026-05-11 |
| `worker/src/lib/response.js` | 1,689 | 2026-05-11 |
| `worker/src/lib/session.js` | 2,200 | 2026-05-11 |
| `worker/src/lib/x-api.js` | 1,501 | 2026-05-11 |
| `worker/src/lib/xai.js` | 4,333 | 2026-05-11 |
| `worker/src/lib/yaml-validator.js` | 666 | 2026-05-14 |
| `worker/wrangler.toml` | 3,039 | 2026-05-15 |


---

## Key Directories — Detailed View

### website/ and assets/

| Path | Size (bytes) | Last commit | Description |
|---|---:|---|---|
| `assets/banner.svg` | 6,323 | 2026-05-14 | Complete 2400×1000 SVG README/social banner: dark "void" background with layered amber/cinnabar radial gradients, a radial "nucleus" burst, a metallic "grok-install" wordmark with glow filter, tagline, stats panel ("SPEC v2.14 · 8 TEMPLATES · MINT-AS-A-SERVICE · APACHE 2.0"), italic footer. Used as favicon/hero image by the HTML pages. |
| `assets/brand/CINNABAR-GLASS.md` | 3,934 | 2026-05-14 | Full "Cinnabar Glass v1.1" brand/visual-identity guide for `grok-install` + `xlOS`: 5 canonical color tokens, hero gradient, atmospheric-background rules, typography scale, readability minimums, glass-surface CSS, CTA spec. States it must stay identical in both repos. |
| `assets/brand/tokens.css` | 371 | 2026-05-14 | Small `:root` CSS custom-property file defining the 5 brand colors, hero gradient, and display/mono font stacks. |
| `assets/brand/tokens.json` | 368 | 2026-05-14 | JSON mirror of the brand tokens (colors, hero gradient, fonts) plus `"version": "1.0.0"` (doc is v1.1 — minor drift). |
| `website/fonts/IBMPlexMono-Bold.woff2` | 14,908 | 2026-05-11 | Binary WOFF2 web font (IBM Plex Mono, bold) — referenced by `style.css`, preloaded by HTML pages. |
| `website/fonts/IBMPlexMono-Regular.woff2` | 14,708 | 2026-05-11 | Binary WOFF2 web font (IBM Plex Mono, regular) — referenced by `style.css`. |
| `website/fonts/InstrumentSerif-Italic.woff2` | 22,128 | 2026-05-11 | Binary WOFF2 web font (Instrument Serif, italic) — referenced by `style.css`, preloaded by HTML pages. |
| `website/index.html` | 6,866 | 2026-05-14 | Landing page (Plate N° 01). Complete, polished: full head, animated background SVG, nav, hero banner, quickstart code block, interactive "MINT YOUR AGENT" CTA with ~70 lines inline JS (clipboard copy + fallback), 3-card grid, footer. References `style.css`, all 3 fonts, `assets/banner.svg`. Not a stub. |
| `website/standard.html` | 9,885 | 2026-05-14 | v2.14 spec page (Plate N° 02). Complete: shared chrome, intro, 3-card "Core Spec" grid linking GitHub spec files, the 14 "Magic Standards" list, validate code block, "Extensions Block" explainer. No JS (none needed). |
| `website/style.css` | 13,628 | 2026-05-11 | Complete 643-line stylesheet ("Residual Frequencies" landing system): self-hosted @font-face, dark "Cinnabar" palette (differs from `assets/brand`), reset, animated background curves, registration crosses, nav/header/card/footer, mint-CTA terminal states, reduced-motion + mobile media queries. Cohesive and finished. |
| `website/templates.html` | 10,692 | 2026-05-14 | Templates catalog (Plate N° 03). Complete: shared chrome, 8 "Core Templates" cards + 10 "Community Templates" cards (matches 8/10/18 claims), each linking GitHub YAML. No JS. |

**Notes / anomalies**

- **`website/safe-agent-builder.html` and `website/dashboard.html` are ABSENT.** They do not exist anywhere in `website/` on `main` (7fb4294). The complete contents of `website/` are exactly: `index.html`, `standard.html`, `templates.html`, `style.css`, and `fonts/` (3 `.woff2`). No redirect, stub, or placeholder for either expected file exists.
- **No empty, truncated, or near-empty files.** All 8 text files parse as complete, well-formed documents with proper closing tags/braces; no merge markers, no redirect-only HTML shells, no lost-content indicators. The 3 `.woff2` files are plausibly sized real binary fonts.
- **Two unrelated design-token systems coexist:** `assets/brand/tokens.css|json` + `CINNABAR-GLASS.md` define a "Cinnabar Glass" palette/Geist font, but the shipped `website/style.css` uses a *different* "Residual Frequencies / Cinnabar" palette (Instrument Serif + IBM Plex Mono) and does **not** consume `assets/brand/tokens.css`. Design-system divergence, not data loss.
- **Brand version drift:** `CINNABAR-GLASS.md` labeled v1.1 while `assets/brand/tokens.json` reports `"version": "1.0.0"`. Cosmetic only.


### worker/

The Cloudflare Worker is the hosted "mint flow" backend for grok-install: a single ES-module Worker (`src/index.js`) doing manual path-based routing to handler modules, backed by one KV namespace (`GROK_INSTALL_KV`) and wrangler secrets (`XAI_API_KEY`, `X_CLIENT_ID`, `X_CLIENT_SECRET`). GitHub App credentials are provisioned at runtime via `/setup-app` into KV.

| Path | Size (bytes) | Last commit | Description |
|---|---:|---|---|
| `worker/DEPLOY.md` | 17,348 | 2026-05-15 | Thorough deployment runbook: prerequisites, Cloudflare KV/secret setup, manual + tag-driven CI deploy, verification, large troubleshooting table. Consistent with `wrangler.toml`. |
| `worker/README.md` | 1,130 | 2026-05-15 | Short Worker overview: local dev, deploy command, required secrets, KV binding, schema reference. Defers detail to DEPLOY.md. |
| `worker/package-lock.json` | 51,849 | 2026-05-15 | npm lockfile (lockfileVersion 3, ~1597 lines) for ajv, ajv-formats, js-yaml, wrangler. |
| `worker/package.json` | 416 | 2026-05-15 | Manifest `grok-install-worker` v1.0.0; deps ajv ^8.17.1, ajv-formats ^3.0.1, js-yaml ^4.1.0; devDep wrangler ^4.86.0; scripts dev/deploy/tail. |
| `worker/src/index.js` | 5,968 | 2026-05-11 | Worker entrypoint/router. `fetch` wraps `route()` in try/catch, persists errors to KV (7-day TTL) + logs; `route()` is an explicit pathname+method if-ladder dispatching all handlers; CORS preflight; 404 fallback. |
| `worker/src/handlers/api.js` | 27,466 | 2026-05-15 | Largest handler. Public + session API: health, stats, wall, mint lookup, profile analysis (xAI grok-4), mascot image gen, **mint** (creates GitHub repo, commits templated files, validates YAML vs v2.14, stores mint record), star-template, rate-limited live agent tester, dynamic SVG/PNG generators. |
| `worker/src/handlers/auth.js` | 6,559 | 2026-05-11 | OAuth handlers: X (Twitter) PKCE OAuth 2.0 start/callback (creates session), GitHub OAuth start/callback (attaches GH token), logout. Open-redirect protection via `safeReturn`. |
| `worker/src/handlers/dashboard.js` | 15,762 | 2026-05-11 | Owner-dashboard API (18 handlers): agents list, overview, analytics + CSV export, feature toggles, memory.md get/post, settings get/patch, YAML download, update check/trigger, commit history, pause/resume/delete. Ownership-checked; mutations regenerate & commit `grok-install.yaml`. |
| `worker/src/handlers/manifest.js` | 5,365 | 2026-05-11 | GitHub App provisioning. `/setup-app` serves an embedded HTML page with two manifest-POST forms; `/api/manifest-callback` exchanges the manifest code, stores credentials in KV, returns an embedded HTML confirmation page. |
| `worker/src/lib/genesis.js` | 1,740 | 2026-05-11 | Genesis ID generation: KV-backed total counter → base32 + 5 random chars (`GA-XXXXXXXX`); daily counter; aggregate `getStats`. |
| `worker/src/lib/github.js` | 8,239 | 2026-05-11 | GitHub REST client: OAuth code exchange, get user, create repo, full git-data commit pipeline (blob/tree/commit/ref), file contents, list commits, star repo, App JWT signing (RS256 via WebCrypto), manifest-code conversion. |
| `worker/src/lib/kv.js` | 1,465 | 2026-05-11 | Thin KV wrapper: get (JSON-parse w/ raw fallback), getText, put (TTL opt), delete, paginated list, increment, increment-with-TTL. |
| `worker/src/lib/logger.js` | 687 | 2026-05-11 | Structured JSON console logging (info/warn/error) + `requestContext` (requestId from cf-ray, method, path). |
| `worker/src/lib/mascots.js` | 2,999 | 2026-05-11 | 8 mascot-style prompt templates with `{voice}`/`{domains}` substitution; style validation; X-intent-tweet fallback URL builder. |
| `worker/src/lib/pkce.js` | 911 | 2026-05-11 | OAuth PKCE helpers: random state, code verifier, SHA-256 S256 challenge, combined `generatePkce`. |
| `worker/src/lib/prompts.js` | 2,673 | 2026-05-15 | xAI prompt builders: evidence-based profile-analyzer prompt, sample-reply prompt, safe neutral fallbacks. |
| `worker/src/lib/repo-template.js` | 9,124 | 2026-05-11 | Generates the minted repo's files: v2.14 `grok-install.yaml` (tool allowlist enforcement), README, canonical SAFETY.md, badge.svg, empty memory.md, Apache LICENSE. |
| `worker/src/lib/response.js` | 1,689 | 2026-05-11 | HTTP response helpers with shared CORS headers: json/text/html/redirect/error/preflight/attachment. |
| `worker/src/lib/session.js` | 2,200 | 2026-05-11 | KV-backed sessions (2h TTL): create/load/save, attach GitHub, delete, `requireSession`, session-id from header or query param. |
| `worker/src/lib/x-api.js` | 1,501 | 2026-05-11 | X (Twitter) API v2 client: `xGetMe`, `xGetUserByUsername`, `xGetUserPosts` (returns `[]` on non-2xx), opt-out tweet builder. |
| `worker/src/lib/xai.js` | 4,333 | 2026-05-11 | xAI Grok API client: chat (JSON/text/multi-turn) with retry/backoff on 5xx, JSON-repair retry, image generation. |
| `worker/src/lib/yaml-validator.js` | 666 | 2026-05-14 | Validates emitted YAML against `spec/v2.14/schema.json` using Ajv 2020 + ajv-formats + js-yaml. (Import path resolves correctly to the existing 4,203-byte schema.) |
| `worker/wrangler.toml` | 3,039 | 2026-05-15 | Worker config: `main=src/index.js`, nodejs_compat, `workers_dev=true`; `[vars]` PRODUCT_NAME/GITHUB_OWNER_ORG/PUBLIC_BASE_URL; committed KV binding `GROK_INSTALL_KV`; extensive secret/deploy comments. |

**Handlers & how the safe-agent-builder / dashboard pages are served**

The Worker does **not** serve `safe-agent-builder.html` or `dashboard.html` itself and contains no HTML template for them. Those pages are static assets hosted **separately on GitHub Pages** at `env.PUBLIC_BASE_URL` (`https://agentmindcloud.github.io/grok-install`). The Worker only **references them by URL** (redirect targets / links in JSON). DEPLOY.md states this explicitly ("`PUBLIC_BASE_URL` points at the GitHub Pages site, NOT at the Worker itself").

- **safe-agent-builder.html** — built by `builderUrl(env, params)` in `auth.js` as `${env.PUBLIC_BASE_URL}/safe-agent-builder.html` + query string. The Worker only **302-redirects the browser there**: after X-OAuth callback (`auth.js:104-107`), as the default post-login `return` (`auth.js:42`), after GitHub OAuth (`auth.js:115`, `:167`), and on logout (`auth.js:182`). The string in `api.js:569` is only a comment.
- **dashboard.html** — appears once, in `api.js`: a successful mint returns JSON with `dashboardUrl = ${env.PUBLIC_BASE_URL}/dashboard.html?genesis=${genesisId}` (`api.js:541`). It is a **link handed back to the client**, not served by the Worker. `dashboard.js` only implements the JSON `/api/dashboard/*` endpoints the static page calls via XHR.
- The only HTML the Worker itself generates is in `manifest.js` (`/setup-app`, `/api/manifest-callback`) — unrelated embedded template strings.

So the missing static files are expected to live in the repo's `website/` directory (served by GitHub Pages), outside `worker/` scope; the Worker integrates with them purely by redirect (builder) and by returning a URL string (dashboard).

**Notes / anomalies**

- No truncation, stubs, TODO/FIXME, empty files, or merge-conflict markers in any of the 23 files. Imports resolve.
- Small-but-complete single-purpose utilities: `pkce.js`, `logger.js`, `yaml-validator.js`, `kv.js`, `x-api.js`, `genesis.js`, `response.js` — by design, fully implemented, not stubs.
- Version axes differ (cosmetic): Worker package `1.0.0`, minted spec `2.14`, mint record/dashboard default template `1.5.0` — distinct namespaces, not a defect.
- Deliberate security posture worth flagging: `api.js` `handleMint` only logs a warning and mints anyway when the leaked-secret regex matches ("minting anyway per scanner-off policy", `api.js:437-439`); CORS fully open (`Access-Control-Allow-Origin: *`).
- Correct operation depends on the separately-hosted `website/` static pages existing at `PUBLIC_BASE_URL`; the Worker cannot be audited end-to-end in isolation.


### action/, .github/, and root files

| Path | Size (bytes) | Last commit | Description |
|---|---:|---|---|
| `.editorconfig` | 247 | 2026-05-11 | EditorConfig root: UTF-8/LF/final-newline, 4-space default, 2-space for json/yml/yaml/md/toml, tabs for Makefile. |
| `.github/CODEOWNERS` | 12 | 2026-05-11 | Single rule `* @JanSol0s` (all files → that owner). |
| `.github/ISSUE_TEMPLATE/bug_report.md` | 440 | 2026-05-11 | Bug-report issue template (label: bug): Describe/Reproduction/Expected/Actual/Environment/Context. |
| `.github/ISSUE_TEMPLATE/feature_request.md` | 313 | 2026-05-11 | Feature-request issue template (label: enhancement): Problem/Proposed/Alternatives/Context. |
| `.github/PULL_REQUEST_TEMPLATE.md` | 417 | 2026-05-11 | PR template: Summary, "Decisions touched" (refs external `ecosystem-redesign/DECISIONS.md`), lint/test/docs checklist. |
| `.github/workflows/lint.yml` | 449 | 2026-05-11 | CI lint (push-main + PR): `.[dev]` on py3.11, runs `ruff check`, `black --check`, `mypy --strict src/grok_install`. |
| `.github/workflows/pages.yml` | 2,281 | 2026-05-11 | Deploys GitHub Pages on main pushes touching website/docs/assets: mkdocs `--strict` → `_site/docs`, copies `website/` flat + `assets/`, deploy-pages. |
| `.github/workflows/release.yml` | 7,941 | 2026-05-11 | Tag-only (`v*.*.*`) pipeline: build-wheels (py3.11/3.12 + smoke), build-vsix, publish-vsix (skip w/o VSCE_PAT), deploy-worker (skip w/o CF secrets), attach-to-release. No PyPI publish. |
| `.github/workflows/test.yml` | 1,313 | 2026-05-11 | Tests (push-main + PR): pytest matrix ubuntu/macos/windows × py3.11/3.12, plus `wheel-smoke` job validating a fixture from outside the source tree. |
| `.github/workflows/validate-templates.yml` | 460 | 2026-05-11 | PR workflow (paths templates/spec/src): installs CLI, runs `grok-install validate templates/`. |
| `.gitignore` | 898 | 2026-05-11 | Standard ignores: Python, Node, IDE, OS, logs, mkdocs `docs/site/`, `.scratch/`. |
| `CHANGELOG.md` | 3,853 | 2026-05-15 | Keep-a-Changelog/SemVer. Empty `[Unreleased]`; detailed `[1.0.0] — 2026-05-15` first-production-release section. |
| `CONTRIBUTING.md` | 921 | 2026-05-14 | Contributor guide: `uv sync`, lint/test commands, branch naming, Conventional Commits, PR rules. |
| `LICENSE` | 11,357 | 2026-05-11 | Full Apache License 2.0 text (complete, 201 lines). |
| `NOTICE` | 195 | 2026-05-11 | Apache NOTICE: "grok-install-v2 (working name; ships as grok-install at v1.0 …)", © 2026 AgentMindCloud. |
| `README.md` | 5,150 | 2026-05-15 | Project overview: what it is, quickstart (GitHub-only install, PyPI deferred), 8 core + 10 community templates, v2.14 standard, CLI vs xlOS, Action, VSCode ext, docs, license. |
| `RELEASING.md` | 5,481 | 2026-05-15 | Release runbook: tag-driven steps, deferred-PyPI rationale, required secrets table, version-bump list, verification, rollback, pre-launch checklist. |
| `SECURITY.md` | 865 | 2026-05-14 | Security policy: supported 1.x, private disclosure via GH Security Advisories, 72h ack / 14-day fix SLA, in-scope surfaces. |
| `action/README.md` | 2,851 | 2026-05-14 | Docs for the in-tree GitHub Action: usage YAML, inputs/outputs tables, strict vs warn, layout. Documents `cli-version` default `2.14.0`. |
| `action/action.yml` | 6,215 | 2026-05-11 | Composite action "GrokInstall Validate & Scan" — see interface note below. |
| `action/package-lock.json` | 13,228 | 2026-05-11 | npm lockfile (v3) for the action's runtime deps; consumed by `npm ci --omit=dev`. |
| `action/package.json` | 757 | 2026-05-14 | Action manifest: private, Node ≥20, deps `@actions/core` 1.11.1, `@actions/github` 6.0.1, `@octokit/rest` 20.1.2, with http-client/undici overrides. |
| `action/scripts/annotations.js` | 3,331 | 2026-05-11 | Reads normalized `report.json`, emits `::error/::warning/::notice` workflow commands (severity downgraded in warn mode) + writes a Markdown job-summary table. |
| `action/scripts/badge.js` | 3,645 | 2026-05-11 | Generates a self-contained brand-colored SVG at `badges/grok-native-certified.svg` (CERTIFIED/PASS/FAIL); sets `badge-path` output. |
| `action/scripts/comment.js` | 3,992 | 2026-05-11 | Posts/updates a single pinned PR comment (located via hidden HTML marker), renders status/score badges + findings table via Octokit. |
| `action/scripts/run.sh` | 4,637 | 2026-05-11 | Orchestrator: runs `grok-install validate`/`scan --json`, normalizes (or wraps non-JSON) into `report.json`, exports passed/safety-score/report-path/visuals-preview-url. Never exits non-zero on CLI failure. |
| `pyproject.toml` | 1,734 | 2026-05-15 | Python packaging (hatchling): `grok-install` v1.0.0, py ≥3.11, deps click/jsonschema/rich/pyyaml, `dev` extra, console script, force-includes `spec/v2.14/schema.json`, ruff/black/mypy config. |

**`action/action.yml` interface.** Composite action (`runs.using: composite`). **Inputs:** `working-directory` (`.`), `mode` (`strict`), `cli-version` (`2.14.0`), `visuals-preview` (`false`), `update-badge` (`true`), `comment-on-pr` (`true`), `github-token` (`''`→`github.token`). **Outputs:** `passed`, `safety-score`, `report-path`, `badge-path`, `visuals-preview-url`. **Steps:** setup Node 20 → `npm ci --omit=dev` → `npm install -g grok-install-cli@<cli-version>` (tolerates failure) → `run.sh` → `annotations.js` (always) → `comment.js` (PR events) → `badge.js` → commit badge on main pushes (bot identity) → final strict-mode gate exiting 1 if not passed.

**Notes / anomalies**

- No truncation, empty files, or incomplete-merge signs across all 27 files (8 `action/`, 9 `.github/`, 10 root). HEAD is `7fb4294`.
- `.github/CODEOWNERS` is 12 bytes **by design** — single valid line `* @JanSol0s`.
- Three unrelated identities: `CODEOWNERS` → `@JanSol0s`; badge commits use `grokinstall-bot`/`bot@grokagents.dev`; org is `AgentMindCloud`. Not a defect, just unrelated.
- Version-pinning is internally consistent but easy to misread: `action/` pins npm `grok-install-cli@2.14.0` (a different package's version) while the repo's Python package/CHANGELOG are `v1.0.0` (manifest spec `v2.14`).
- `action.yml`/`README.md` reference a non-present `docs/cli-version-pinning.md`.
- Doc/CHANGELOG refresh for 1.0.0 (2026-05-14/15) postdates the workflow/script freeze (2026-05-11); no contradictions introduced (release.yml's tag-only, no-PyPI behavior matches RELEASING.md/CHANGELOG).
- Cross-references point outside scope but appear intentional: `PULL_REQUEST_TEMPLATE.md`/`NOTICE` cite external `AgentMindCloud/ecosystem-redesign/DECISIONS.md`.
- Minor: wheels are built in CI but `pyproject.toml` declares only the wheel target (no explicit sdist target); hatchling defaults still produce an sdist that `attach-to-release` uploads.


### standards/, templates/, spec/

| Path | Size (bytes) | Last commit | Description |
|---|---:|---|---|
| `standards/grok-agent.yaml` | 687 | 2026-05-11 | Named long/short-lived agents (CodePartner, SocialManager) with tools, memory mode, per-session turn limits. |
| `standards/grok-analytics.yaml` | 1,218 | 2026-05-11 | PostHog analytics config: tracked events, properties, PII flags, sampling, retention, opt-out roles. |
| `standards/grok-config.yaml` | 918 | 2026-05-11 | Global Grok behavior (model, temperature, personality), always-injected context, privacy, shortcuts. |
| `standards/grok-deploy.yaml` | 1,557 | 2026-05-11 | Staging/production Vercel deploy targets: env vars, resource limits, health checks, approval/rollback. |
| `standards/grok-docs.yaml` | 524 | 2026-05-11 | Auto-doc generation config for README/API docs (sections, style, update triggers). |
| `standards/grok-prompts.yaml` | 845 | 2026-05-11 | Reusable prompt library (viral_thread, code_review, product_idea) with variables and temperature. |
| `standards/grok-security.yaml` | 484 | 2026-05-11 | Security scan definitions (secrets, dep vuln, license/GDPR), PR auto-block, Slack/X notifications. |
| `standards/grok-swarm.yaml` | 1,105 | 2026-05-11 | "Ship It Swarm" multi-agent definition: members/roles/priorities, coordinator, consensus, fallback. |
| `standards/grok-test.yaml` | 769 | 2026-05-11 | Test suites (CodeQuality, SecuritySmokeTest, AccessibilityCheck) with prompts and file globs. |
| `standards/grok-tools.yaml` | 1,993 | 2026-05-11 | Tool catalog (read_file, write_file, run_command, web_search) with typed I/O, permissions, rate limits. |
| `standards/grok-ui.yaml` | 1,578 | 2026-05-11 | UI config: theme/locale, voice commands, dashboard widgets, keyboard shortcuts. |
| `standards/grok-update.yaml` | 659 | 2026-05-11 | Scheduled update jobs (KnowledgeBase refresh, DependencyCheck) with frequency, auto-commit/approval. |
| `standards/grok-voice.yaml` | 1,029 | 2026-05-11 | Voice pipeline (STT→intent→agent→TTS), providers, latency budget, fallbacks, audio privacy. |
| `standards/grok-workflow.yaml` | 990 | 2026-05-11 | Multi-step workflows (ReleasePipeline, ContentPipeline) chaining other grok-* actions behind a trigger. |
| `templates/README.md` | 364 | 2026-05-11 | Templates-dir index; notes core templates land in a follow-up PR; manifests validate vs v2.14 schema. |
| `templates/community/README.md` | 1,236 | 2026-05-11 | Community templates index with a 10-row catalog table; sourced from awesome-grok-agents. |
| `templates/community/code-reviewer.yaml` | 1,063 | 2026-05-11 | Reviews GitHub PRs via Grok, posts inline comments behind approval; webhook-triggered, full visuals. |
| `templates/community/hello-grok.yaml` | 473 | 2026-05-11 | Simplest community agent; minimal valid manifest with a small visuals block. |
| `templates/community/live-event-commentator.yaml` | 378 | 2026-05-11 | Real-time X event commentary with rate limits/kill switch; minimal flat manifest, workflow entrypoint. |
| `templates/community/personal-knowledge.yaml` | 363 | 2026-05-11 | Persistent searchable memory of your X history; minimal manifest, 6h schedule. |
| `templates/community/reply-engagement-bot.yaml` | 424 | 2026-05-11 | Watches X mentions, drafts approval-gated replies; minimal manifest, 5m schedule. |
| `templates/community/research-swarm.yaml` | 300 | 2026-05-11 | Researcher+critic+publisher swarm; smallest manifest — required fields + two env keys. |
| `templates/community/scientific-discovery.yaml` | 352 | 2026-05-11 | Daily arXiv + X-discussion brief; minimal manifest, daily cron. |
| `templates/community/thread-ghostwriter.yaml` | 1,173 | 2026-05-11 | Rough idea → tone-matched X thread; full premium visuals (gradient/glow/animation). |
| `templates/community/trend-to-thread.yaml` | 1,159 | 2026-05-11 | Monitors X trends, drafts threads; 30m schedule + futuristic visuals + demo-media auto-gen. |
| `templates/community/voice-agent-x.yaml` | 1,341 | 2026-05-11 | Speak→transcript→approve→publish; rich visuals with haptics and accessibility config. |
| `templates/core/AlphaSignalBot.yaml` | 2,278 | 2026-05-14 | Market-update/crypto-Q&A reply-bot; full reference v2.14 manifest (tools, safety, rate/cost limits, x_native_runtime). |
| `templates/core/AskMe.yaml` | 2,256 | 2026-05-14 | Topic Q&A agent curating authoritative resources; same reference manifest body. |
| `templates/core/DailyBrief.yaml` | 2,257 | 2026-05-14 | Daily morning summaries + @-mention replies; same reference manifest body. |
| `templates/core/DevPilot.yaml` | 2,256 | 2026-05-14 | Developer help bot (API answers, coding tips); same reference manifest body. |
| `templates/core/DogeDoughAI.yaml` | 2,290 | 2026-05-14 | Brand assistant for restaurants/local brands; same reference manifest body. |
| `templates/core/ShowNotes.yaml` | 2,261 | 2026-05-14 | Summarizes podcasts/livestreams/threads with timestamps; same reference manifest body. |
| `templates/core/VibeReply.yaml` | 2,269 | 2026-05-14 | Light friendly tone-based replies; same reference manifest body. |
| `templates/core/VisualForge.yaml` | 2,273 | 2026-05-14 | Daily AI-art generation + visual-prompt replies (watermarked); same reference manifest body. |
| `spec/README.md` | 176 | 2026-05-11 | Top-level spec-dir pointer to v2.14; marked "PLACEHOLDER (Phase 2b)". |
| `spec/v2.14/README.md` | 228 | 2026-05-11 | Points to schema.json (JSON Schema 2020-12) and the extensions README. |
| `spec/v2.14/extensions/README.md` | 998 | 2026-05-11 | Documents the 5 optional `extensions:` blocks; marked "PLACEHOLDER (Phase 2b)" — field schemas not yet shipped. |
| `spec/v2.14/grok-install.yaml` | 1,359 | 2026-05-14 | Canonical single-manifest example exercising every required v2.14 field + constitution/provenance extensions. |
| `spec/v2.14/schema.json` | 4,203 | 2026-05-11 | The authoritative v2.14 JSON Schema: required fields, name pattern, runtime/deploy enums, extensions definitions. |

**Notes / anomalies**

- **Core templates are placeholder-identical (notable).** All 8 `templates/core/*.yaml` are byte-for-byte identical except `name`/`description`/`tags`/header comment. Each declares the same two tools (`reply_to_mention`, `post_thread`) and identical safety/rate_limits/cost_limits/`x_native_runtime: reply-bot`. Descriptions promise differentiated behavior (VisualForge "daily AI art", ShowNotes "summarizes podcasts", etc.) that the manifests carry no logic/prompts/schedules/tools to deliver. Well-formed and schema-valid but functionally clones — looks like a scaffold pass (consistent with `templates/README.md` and their later 2026-05-14 commit date).
- **Small community templates are intentionally minimal, not truncated.** The six 300–480 B files are complete, valid v2.14 manifests (5 required fields + appropriate `env`/`schedule`); they merely omit the optional `visuals` block that inflates the larger files. No mid-key cutoffs / dangling YAML.
- **Community catalog count consistent.** README advertises "Catalog (10)" and exactly 10 `.yaml` files present, slugs match.
- **`spec/` explicitly placeholder but not broken.** `spec/README.md` + `spec/v2.14/extensions/README.md` self-label "PLACEHOLDER (Phase 2b)"; extension field schemas documented as not-yet-shipped. The actual `schema.json` (4,203 B) is complete and the `grok-install.yaml` example validates against it.
- No empty/zero-byte/truncated files or merge-conflict markers. Standards YAML cross-references (grok-ui→grok-test/grok-deploy, grok-swarm→grok-agent, grok-workflow→grok-prompts) all line up.


### docs/ (prose, JS, CSS, config)

> Covers all of `docs/` except the `docs/docs/assets/schemas/` JSON-Schema tree (reported in the section above). 58 files.

| Path | Size (bytes) | Last commit | Description |
|---|---:|---|---|
| `docs/docs/assets/img/favicon.svg` | 338 | 2026-05-11 | Tiny inline SVG favicon: rounded black tile with a cyan terminal-cursor `>` and underscore. Complete. |
| `docs/docs/assets/img/logo.svg` | 702 | 2026-05-11 | Inline SVG site logo: black rounded square, cyan gradient terminal-prompt glyph + dot. Complete. |
| `docs/docs/cli/reference.md` | 5,717 | 2026-05-11 | Full CLI reference: install, global flags, all 8 commands (init/validate/scan/run/test/deploy/install/publish), Python API, troubleshooting. Complete. |
| `docs/docs/contributing.md` | 2,966 | 2026-05-11 | Contribution guide across the 5 ecosystem repos: spec/CLI/docs/template workflows, code of conduct, maintainer path. Complete. |
| `docs/docs/ecosystem/index.md` | 745 | 2026-05-11 | Ecosystem landing: feature-card links to xAI SDK, LiteLLM, Semantic Kernel. Complete (short by design — index). |
| `docs/docs/ecosystem/litellm.md` | 2,000 | 2026-05-11 | LiteLLM integration: install, `provider: litellm`, provider/model table, per-agent provider mixing, cost note. Complete. |
| `docs/docs/ecosystem/semantic-kernel.md` | 2,109 | 2026-05-11 | Semantic Kernel bridge: expose agents as SK plugins/functions, planner usage, approval-gate caveats. Complete. |
| `docs/docs/ecosystem/xai-sdk.md` | 1,969 | 2026-05-11 | xAI SDK as default backend: install extras, model selection, SDK options, direct SDK use, compatibility matrix. Complete. |
| `docs/docs/for-xai/adoption-guide.md` | 6,586 | 2026-05-11 | Pitch to xAI for official-standard adoption: footprint, 5-option adoption menu, non-asks, integration-surface table, FAQ, contact. Complete (ends on a deliberate closing line; no trailing newline). |
| `docs/docs/gallery/index.md` | 1,268 | 2026-05-11 | Templates landing: links to single-agent/multi-step/swarm + install/contribute. Complete. |
| `docs/docs/gallery/multi-step.md` | 2,907 | 2026-05-11 | Catalog of 7 multi-step pipeline templates with one-liners + GitHub links. Complete. |
| `docs/docs/gallery/single-agent.md` | 1,161 | 2026-05-11 | Single-agent pattern + the `hello-grok` template with example YAML and guidance. Complete. |
| `docs/docs/gallery/swarm.md` | 1,509 | 2026-05-11 | Swarm pattern + 2 templates (research-swarm, scientific-discovery) with selection guidance. Complete. |
| `docs/docs/getting-started/deploy.md` | 2,717 | 2026-05-11 | Per-target deploy quickstart (Vercel/Railway/Docker/Replit) + common-pitfalls admonitions. Complete. |
| `docs/docs/getting-started/first-agent.md` | 4,151 | 2026-05-11 | 10-step copy-paste tutorial: scaffold → inspect 4 files → validate → scan → run → iterate → publish. Complete. |
| `docs/docs/getting-started/index.md` | 683 | 2026-05-11 | Getting-started landing: 3 feature-card links. Complete (short by design). |
| `docs/docs/getting-started/installation.md` | 1,721 | 2026-05-15 | CLI install (pip/pipx/source), verify, API-key setup across shells, completion. Complete. Newest content date in scope. |
| `docs/docs/guides/deployment.md` | 4,229 | 2026-05-11 | Production ops guide: secrets, structured logs, schedules, cold start, rollback, OTel, cost guardrails, hot-deploy table. Complete. |
| `docs/docs/guides/index.md` | 976 | 2026-05-11 | Guides landing: 5 feature-card links. Complete (short by design). |
| `docs/docs/guides/multi-agent-swarms.md` | 4,885 | 2026-05-11 | 3 swarm patterns (pipeline / critic loop / fan-out) with mermaid + YAML; notes fan-out is "v2.13 roadmap". Complete. |
| `docs/docs/guides/safety-profiles.md` | 4,170 | 2026-05-11 | `standard` vs `strict`, approval-gate UX, rate-limit/permission-scope tables, scan-vs-validate, misconfig admonitions. Complete. |
| `docs/docs/guides/tool-schemas.md` | 3,797 | 2026-05-11 | Tool declaration (`@tool`), parameters, returns, wiring, approval gating, built-in tool library, testing/mocks. Complete. |
| `docs/docs/guides/x-integration.md` | 4,802 | 2026-05-11 | Install-on-X flow (mermaid seq), installability rules, `@grok` commands, scan, marketplace, x_native_runtime, Passive Growth Engine. Complete. |
| `docs/docs/index.md` | 4,748 | 2026-05-11 | Site landing page: hero (terminal-animation div), why-grok feature grid, quick-start, where-next. Heavy HTML-in-MD; complete. |
| `docs/docs/javascripts/extra.js` | 5,127 | 2026-05-11 | Landing-page terminal typing animation: scripted steps, reduced-motion fallback, MkDocs instant-nav remount. Self-contained IIFE, complete. |
| `docs/docs/javascripts/playground.js` | 24,686 | 2026-05-11 | Client-side YAML validator: Monaco + js-yaml + Ajv2020 vs local schemas (v2.12/latest/v2.14), kind/version auto-detect, stats, live v2.14 visuals preview, 8 samples. Coherent and complete. |
| `docs/docs/playground/index.md` | 4,735 | 2026-05-11 | Main playground page: editor/validation DOM, sample selectors, loads `playground.js`, "how it works", schema links. Complete. |
| `docs/docs/playground/v2.14.md` | 3,887 | 2026-05-11 | v2.14 visuals playground (preloaded `data-grok-sample="janvisuals"`), 3 example writeups, preview/a11y notes. Complete. |
| `docs/docs/robots.txt` | 87 | 2026-05-11 | Allows all crawlers; declares a sitemap. **Anomaly:** sitemap URL points to wrong project path (`grok-docs`, see notes). |
| `docs/docs/stylesheets/extra.css` | 20,444 | 2026-05-11 | Full design system: Material palette overrides (dark-first cyan/black), typography, hero, terminal, feature grid, playground, banner, scrollbars, complete v2.14 visuals-preview card block. Coherent, complete. |
| `docs/docs/v2.12/index.md` | 2,857 | 2026-05-11 | v2.12 pinned-version landing: 5-file overview, pin instructions, schema links, migration pointers. Complete. |
| `docs/docs/v2.12/spec/index.md` | 3,219 | 2026-05-11 | v2.12 spec overview: 5-file tree, file cards, version matrix, pin tip, schema links. Complete. |
| `docs/docs/v2.12/spec/grok-install-yaml.md` | 4,265 | 2026-05-11 | `grok-install.yaml` ref: minimal + full examples, field/runtime/schedule tables, mistake admonitions, validation. Complete. |
| `docs/docs/v2.12/spec/grok-agent-yaml.md` | 2,963 | 2026-05-11 | `grok-agent.yaml` v2.12: examples, field table, single/multi-step/swarm patterns, cross-validation. Complete. |
| `docs/docs/v2.12/spec/grok-workflow-yaml.md` | 3,944 | 2026-05-11 | `grok-workflow.yaml` v2.12: critic-loop example, field/step tables, Jinja templating, error behavior, validation. Complete. |
| `docs/docs/v2.12/spec/grok-security-yaml.md` | 4,212 | 2026-05-11 | `grok-security.yaml` v2.12: standard/strict/swarm examples, field + scope + rate-limit tables, validation. Complete. |
| `docs/docs/v2.12/spec/grok-prompts-yaml.md` | 3,092 | 2026-05-11 | `grok-prompts.yaml` v2.12: minimal + 3-prompt examples, field/constraint tables, style guidance, cross-validation. Complete. |
| `docs/docs/v2.13/index.md` | 3,492 | 2026-05-11 | v2.13 "12-standard expansion" landing: 12 file cards, change matrix, pin header. Complete. |
| `docs/docs/v2.13/migration-from-v2.12.md` | 3,396 | 2026-05-11 | v2.12→v2.13 migration: automated path, field-relocation table, manual steps, gotchas. Complete. |
| `docs/docs/v2.13/release-notes.md` | 2,752 | 2026-05-11 | v2.13 release notes: TL;DR, new/removed/unchanged files, tooling, compatibility matrix. Complete. |
| `docs/docs/v2.13/spec/index.md` | 2,549 | 2026-05-11 | v2.13 spec overview: 12-file tree, carried-vs-new split, common header, schema/validation. Complete. |
| `docs/docs/v2.13/spec/grok-agent-yaml.md` | 2,808 | 2026-05-11 | v2.13 `grok-agent.yaml` (carried, +header): examples, field table, dual cross-validation vs grok-tools. Complete. |
| `docs/docs/v2.13/spec/grok-analytics-yaml.md` | 3,237 | 2026-05-11 | v2.13 `grok-analytics.yaml`: opt-in telemetry, provider enum, event objects w/ `pii_safe`. Complete. |
| `docs/docs/v2.13/spec/grok-config-yaml.md` | 3,737 | 2026-05-11 | v2.13 `grok-config.yaml` (replaces grok-install.yaml): grok/context/privacy/shortcuts blocks + field tables. Complete. |
| `docs/docs/v2.13/spec/grok-deploy-yaml.md` | 4,060 | 2026-05-11 | v2.13 `grok-deploy.yaml`: targets, env_vars, resource limits, health checks, rollback. Complete. |
| `docs/docs/v2.13/spec/grok-docs-yaml.md` | 3,219 | 2026-05-11 | v2.13 `grok-docs.yaml`: AI-doc targets, sections enum, style/update triggers. Complete. |
| `docs/docs/v2.13/spec/grok-prompts-yaml.md` | 2,745 | 2026-05-11 | v2.13 `grok-prompts.yaml` (carried, +header): examples, field/constraint tables, style, cross-validation. Complete. |
| `docs/docs/v2.13/spec/grok-security-yaml.md` | 3,918 | 2026-05-11 | v2.13 `grok-security.yaml` (carried, +header): examples, scopes/rate-limit tables, adds grok-tools cross-validation. Complete. |
| `docs/docs/v2.13/spec/grok-test-yaml.md` | 3,669 | 2026-05-11 | v2.13 `grok-test.yaml`: AI test suites, `all` alias, per-suite fields, categories enum, merge-blocking. Complete. |
| `docs/docs/v2.13/spec/grok-tools-yaml.md` | 3,817 | 2026-05-11 | v2.13 `grok-tools.yaml`: typed tool registry, input/output schemas, permissions/auth/rate-limit, cross-validation. Complete. |
| `docs/docs/v2.13/spec/grok-ui-yaml.md` | 3,057 | 2026-05-11 | v2.13 `grok-ui.yaml`: theme/locale, voice commands, dashboard widgets, keyboard shortcuts. Complete. |
| `docs/docs/v2.13/spec/grok-update-yaml.md` | 3,367 | 2026-05-11 | v2.13 `grok-update.yaml`: scheduled maintenance jobs, sources/frequency/actions enum, approval defaults. Complete. |
| `docs/docs/v2.13/spec/grok-workflow-yaml.md` | 3,775 | 2026-05-11 | v2.13 `grok-workflow.yaml` (carried, +header): swarm example, field/step tables, Jinja, validation. Complete. |
| `docs/docs/v2.14/accessibility.md` | 4,703 | 2026-05-11 | WCAG 2.2 AA checklist for `visuals:`: non-negotiables, per-criterion checklist, contrast measurement, caption/transcript matrix, grok-test snippet. Complete. |
| `docs/docs/v2.14/index.md` | 2,414 | 2026-05-11 | v2.14 landing: additive `visuals:` block, minimal example, schema, compatibility matrix, version path. Complete. |
| `docs/docs/v2.14/migration.md` | 2,685 | 2026-05-11 | v2.13→v2.14 migration: 3-step adoption, tooling-change table, what-doesn't-change, opt-out. Complete. |
| `docs/docs/v2.14/visuals.md` | 7,861 | 2026-05-11 | Full `visuals:` reference: field tables (srcset/accessibility/cta), minimal + JanVisuals + video + carousel examples, a11y summary. Largest spec page; complete. |
| `docs/mkdocs.yml` | 6,633 | 2026-05-14 | MkDocs config (see below). |
| `docs/overrides/main.html` | 1,080 | 2026-05-11 | Theme override (see below). |
| `docs/requirements.txt` | 258 | 2026-05-11 | Pins 10 deps: mkdocs 1.6.1, mkdocs-material 9.5.44, minify/git-revision-date/mermaid2/redirects plugins, mike 2.1.3, pymdown-extensions 10.12, pygments 2.18.0. Coherent. |

**`docs/mkdocs.yml`** — Material theme with `custom_dir: overrides`, custom logo/favicon, Instrument Serif + IBM Plex Mono fonts, three-way auto/light/dark palette (black primary, cyan accent). Rich `features` (instant nav, sticky tabs, sections, code copy/annotate, tooltips). `extra_css`/`extra_javascript` wire in `extra.css` + `extra.js` (`playground.js` is NOT globally loaded — it is `<script>`-injected per playground page). Plugins: `search`, `minify`, `git-revision-date-localized`, `redirects` (legacy `spec/*` → `v2.12/spec/*`). `extra.version` uses the `mike` provider (`default: latest`). Large `markdown_extensions` set. `nav` is comprehensive and matches the on-disk tree. Config complete and internally consistent.

**`docs/overrides/main.html`** — A tiny 21-line / 1,080 B shell, NOT substantial. Extends `base.html` and overrides only the `extrahead` block to add Open Graph + Twitter Card meta tags (canonical link, `og:image`/`twitter:image` → `assets/img/og-default.png`, `twitter:site` → `@JanSol0s`). No layout/structural overrides.

**Notes / anomalies**

- **`robots.txt` advertises a wrong-host sitemap.** Content is `User-agent: * / Allow: / / Sitemap: https://agentmindcloud.github.io/grok-docs/sitemap.xml`, but `mkdocs.yml` `site_url` is `https://agentmindcloud.github.io/grok-install/`. The published sitemap lives under `/grok-install/`, so this `robots.txt` points crawlers at a non-existent `/grok-docs/sitemap.xml`.
- **Recurring stale `grok-docs` project-rename references.** The repo/site is `grok-install`, but `contributing.md`, `for-xai/adoption-guide.md`, hardcoded absolute URLs in `playground.js` sample YAML (logo src), and `v2.14/visuals.md` (video CTA URL) still say/point to `grok-docs`. Not broken Markdown, but a rename-cleanup gap across docs.
- **Likely-broken internal links (HTML anchors with `.md` targets).** `index.md` and some version landing pages use raw `.md` targets inside literal HTML `<a href>` tags (e.g. `href="v2.14/index.md"`). MkDocs only rewrites `.md` links in Markdown link syntax, not in literal HTML anchors, so these resolve to literal `…/index.md` URLs and 404 on the built site. (Note: `pages.yml` builds with `mkdocs --strict`, which catches broken *Markdown* links / nav but NOT raw-HTML anchors, so the build still passes while the links break at runtime.)
- **No stubs / truncation.** All short index/landing pages are intentionally thin navigation hubs with complete front-matter and feature-card grids. `for-xai/adoption-guide.md` ends on a deliberate closing sentence with no trailing newline but is structurally complete. Large frontend files (`playground.js`, `extra.css`, `extra.js`) are internally coherent and complete (all referenced functions defined, balanced braces, IIFEs close and wire boot/DOMContentLoaded).
- **Version-set completeness:** v2.12 = index + spec/index + 5 spec pages (complete, matches nav); v2.13 = index + release-notes + migration + spec/index + all 12 spec pages (most thorough; carried files explicitly noted); v2.14 = index + visuals + migration + accessibility (intentionally thin — v2.14 is "purely additive" `visuals:` only, reusing v2.13's 12-standard set by reference). No version is conspicuously missing pages. Per-file SemVer in v2.13 spec examples is by the spec's own design, internally consistent.
- `installation.md` (2026-05-15) and `mkdocs.yml` (2026-05-14) are the only in-scope files newer than the 2026-05-11 baseline — no content concern.


### docs schemas, src/, extensions/, tests/

| Path | Size (bytes) | Last commit | Description |
|---|---:|---|---|
| `docs/docs/assets/schemas/latest/grok-agent.json` | 10,297 | 2026-05-11 | JSON Schema for `grok-agent.yaml`; persistent stateful agents with tool access, memory modes, session limits. |
| `docs/docs/assets/schemas/latest/grok-analytics.json` | 6,363 | 2026-05-11 | Schema for `grok-analytics.yaml`; opt-in telemetry, PII-safety, GDPR retention. |
| `docs/docs/assets/schemas/latest/grok-config.json` | 7,301 | 2026-05-11 | Schema for `grok-config.yaml`; model settings, context injection, privacy, shortcuts. |
| `docs/docs/assets/schemas/latest/grok-deploy.json` | 9,092 | 2026-05-11 | Schema for `grok-deploy.yaml`; deploy targets, env resolution, resource limits, health/rollback. |
| `docs/docs/assets/schemas/latest/grok-docs.json` | 5,127 | 2026-05-11 | Schema for `grok-docs.yaml`; auto-generated documentation targets, composition, triggers. |
| `docs/docs/assets/schemas/latest/grok-prompts.json` | 4,546 | 2026-05-11 | Schema for `grok-prompts.yaml`; versioned prompt library with interpolation, tagging. |
| `docs/docs/assets/schemas/latest/grok-security.json` | 5,998 | 2026-05-11 | Schema for `grok-security.yaml`; security/compliance scans, PR blocking, notifications. |
| `docs/docs/assets/schemas/latest/grok-swarm.json` | 5,881 | 2026-05-11 | Schema for `grok-swarm.yaml`; multi-agent swarm topology, consensus. |
| `docs/docs/assets/schemas/latest/grok-test.json` | 5,052 | 2026-05-11 | Schema for `grok-test.yaml`; AI test suites (quality/security/a11y/perf). |
| `docs/docs/assets/schemas/latest/grok-tools.json` | 7,224 | 2026-05-11 | Schema for `grok-tools.yaml`; typed tools registry, permissions, rate limits. |
| `docs/docs/assets/schemas/latest/grok-ui.json` | 9,555 | 2026-05-11 | Schema for `grok-ui.yaml`; voice commands, dashboard widgets, themes, locale. |
| `docs/docs/assets/schemas/latest/grok-update.json` | 4,664 | 2026-05-11 | Schema for `grok-update.yaml`; scheduled smart-update jobs. |
| `docs/docs/assets/schemas/latest/grok-voice.json` | 8,476 | 2026-05-11 | Schema for `grok-voice.yaml`; STT→intent→agent→TTS pipeline, latency, privacy. |
| `docs/docs/assets/schemas/latest/grok-workflow.json` | 13,433 | 2026-05-11 | Schema for `grok-workflow.yaml`; multi-step workflows, branching, error handling. |
| `docs/docs/assets/schemas/v2.0.0/grok-agent.json` | 10,297 | 2026-05-11 | Byte-identical copy of `latest/grok-agent.json` (see duplication finding). |
| `docs/docs/assets/schemas/v2.0.0/grok-analytics.json` | 6,363 | 2026-05-11 | Byte-identical copy of `latest/grok-analytics.json`. |
| `docs/docs/assets/schemas/v2.0.0/grok-config.json` | 7,301 | 2026-05-11 | Byte-identical copy of `latest/grok-config.json`. |
| `docs/docs/assets/schemas/v2.0.0/grok-deploy.json` | 9,092 | 2026-05-11 | Byte-identical copy of `latest/grok-deploy.json`. |
| `docs/docs/assets/schemas/v2.0.0/grok-docs.json` | 5,127 | 2026-05-11 | Byte-identical copy of `latest/grok-docs.json`. |
| `docs/docs/assets/schemas/v2.0.0/grok-prompts.json` | 4,546 | 2026-05-11 | Byte-identical copy of `latest/grok-prompts.json`. |
| `docs/docs/assets/schemas/v2.0.0/grok-security.json` | 5,998 | 2026-05-11 | Byte-identical copy of `latest/grok-security.json`. |
| `docs/docs/assets/schemas/v2.0.0/grok-swarm.json` | 5,881 | 2026-05-11 | Byte-identical copy of `latest/grok-swarm.json`. |
| `docs/docs/assets/schemas/v2.0.0/grok-test.json` | 5,052 | 2026-05-11 | Byte-identical copy of `latest/grok-test.json`. |
| `docs/docs/assets/schemas/v2.0.0/grok-tools.json` | 7,224 | 2026-05-11 | Byte-identical copy of `latest/grok-tools.json`. |
| `docs/docs/assets/schemas/v2.0.0/grok-ui.json` | 9,555 | 2026-05-11 | Byte-identical copy of `latest/grok-ui.json`. |
| `docs/docs/assets/schemas/v2.0.0/grok-update.json` | 4,664 | 2026-05-11 | Byte-identical copy of `latest/grok-update.json`. |
| `docs/docs/assets/schemas/v2.0.0/grok-voice.json` | 8,476 | 2026-05-11 | Byte-identical copy of `latest/grok-voice.json`. |
| `docs/docs/assets/schemas/v2.0.0/grok-workflow.json` | 13,433 | 2026-05-11 | Byte-identical copy of `latest/grok-workflow.json`. |
| `docs/docs/assets/schemas/v2.12/grok-agent.schema.json` | 1,404 | 2026-05-11 | Older/leaner v2.12 schema: agents sharing a runtime. |
| `docs/docs/assets/schemas/v2.12/grok-install.schema.json` | 1,832 | 2026-05-11 | v2.12 schema: root config for an installable Grok agent (one per repo). |
| `docs/docs/assets/schemas/v2.12/grok-prompts.schema.json` | 626 | 2026-05-11 | v2.12 schema: named system-prompt library referenced via `prompt_ref`. |
| `docs/docs/assets/schemas/v2.12/grok-security.schema.json` | 1,395 | 2026-05-11 | v2.12 schema: safety profile, permissions, rate limits. |
| `docs/docs/assets/schemas/v2.12/grok-workflow.schema.json` | 1,467 | 2026-05-11 | v2.12 schema: multi-step / multi-agent orchestration. |
| `docs/docs/assets/schemas/v2.14/grok-visuals.schema.json` | 6,163 | 2026-05-11 | v2.14-only schema for `grok-visuals.yaml` install-card media; additive over v2.13. |
| `extensions/vscode/README.md` | 1,531 | 2026-05-14 | Docs for the in-tree VS Code language extension (grammar, config, snippets, local install). |
| `extensions/vscode/language-configuration.json` | 602 | 2026-05-11 | YAML-style language config: comments, brackets, auto-closing/surrounding pairs, indent/onEnter. |
| `extensions/vscode/package.json` | 1,955 | 2026-05-14 | Extension manifest `vscode-grok-yaml` v0.1.0; contributes languages, grammars, snippets. |
| `extensions/vscode/snippets/grok-agent.json` | 1,645 | 2026-05-11 | Snippets: full grok-agent doc, tool reference, inline tool. |
| `extensions/vscode/snippets/grok-config.json` | 1,242 | 2026-05-11 | Snippets: full grok-config doc, defaults block. |
| `extensions/vscode/snippets/grok-install.json` | 2,000 | 2026-05-11 | Snippets: full grok-install doc (v2.14), minimal, runtime block. |
| `extensions/vscode/snippets/grok-workflow.json` | 1,842 | 2026-05-11 | Snippets: full grok-workflow doc, single step, schedule trigger. |
| `extensions/vscode/snippets/post_thread.code-snippets` | 334 | 2026-05-11 | Capability snippet `grok:thread` (post_thread stanza). |
| `extensions/vscode/snippets/reply_to_mention.code-snippets` | 453 | 2026-05-11 | Capability snippet `grok:reply` (reply_to_mention). |
| `extensions/vscode/snippets/swarm_orchestrator.code-snippets` | 835 | 2026-05-11 | Capability snippet `grok:swarm` (swarm orchestrator stanza). |
| `extensions/vscode/snippets/trend_to_thread.code-snippets` | 538 | 2026-05-11 | Capability snippet `grok:trend` (trend_to_thread pipeline). |
| `extensions/vscode/snippets/voice_response.code-snippets` | 591 | 2026-05-11 | Capability snippet `grok:voice` (voice_response block). |
| `extensions/vscode/syntaxes/grok-yaml.tmLanguage.json` | 650 | 2026-05-11 | TextMate grammar `source.yaml.grok` layered on YAML; highlights apiVersion/kind/metadata/spec. |
| `src/grok_install/README.md` | 398 | 2026-05-11 | Describes `grok-install validate` and its 0/1/2 exit codes. |
| `src/grok_install/__init__.py` | 55 | 2026-05-15 | Package docstring + `__version__ = "1.0.0"`. Normal marker. |
| `src/grok_install/_utils.py` | 1,774 | 2026-05-11 | Shared helpers: cached rich `Console`, `find_schema_path()` (wheel vs `spec/v2.14/` dev fallback), `find_agent_manifests()`. |
| `src/grok_install/main.py` | 670 | 2026-05-11 | Click CLI `grok-install` with `--version` and `validate <path>` subcommand. |
| `src/grok_install/validate.py` | 4,454 | 2026-05-11 | Core validation: load YAML+JSON schema, `Draft202012Validator`, RFC-6901 pointers, rich result/summary, `run_validate` exit codes. |
| `tests/README.md` | 140 | 2026-05-11 | One-line note; marked "Status: PLACEHOLDER (Phase 2b)". |
| `tests/__init__.py` | 0 | 2026-05-11 | Empty test-package marker. |
| `tests/conftest.py` | 192 | 2026-05-11 | Single `fixtures_dir` fixture pointing at `tests/fixtures/`. |
| `tests/fixtures/invalid_bad_slug.yaml` | 162 | 2026-05-11 | Invalid: `name` "Bad Slug With Spaces" violates slug pattern. |
| `tests/fixtures/invalid_bad_target.yaml` | 171 | 2026-05-11 | Invalid: `deploy.targets` contains `mars-rover` (not in enum). |
| `tests/fixtures/invalid_missing_version.yaml` | 138 | 2026-05-11 | Invalid: required `version` field omitted. |
| `tests/fixtures/invalid_wrong_version.yaml` | 163 | 2026-05-11 | Invalid: `version: "2.13"` instead of required `"2.14"`. |
| `tests/fixtures/valid_full.yaml` | 730 | 2026-05-11 | Valid: comprehensive manifest exercising every optional field incl. `extensions`. |
| `tests/fixtures/valid_minimal.yaml` | 162 | 2026-05-11 | Valid: minimal hello-world manifest. |
| `tests/fixtures/valid_unknown_extension.yaml` | 235 | 2026-05-11 | Valid: forward-compat — unknown `extensions.future_block` must still pass (D5 policy). |
| `tests/test_cli.py` | 821 | 2026-05-15 | CLI smoke tests via `CliRunner`: `--version`, valid→exit 0, invalid→exit 1. |
| `tests/test_core_templates.py` | 639 | 2026-05-11 | Parametrized: every `templates/core/*.yaml` validates vs v2.14 schema. |
| `tests/test_standards.py` | 775 | 2026-05-11 | Parametrized: every `standards/*.yaml` is well-formed YAML (parse-only). |
| `tests/test_templates.py` | 787 | 2026-05-11 | All bundled community manifests validate vs v2.14 schema. |
| `tests/test_validate.py` | 3,464 | 2026-05-11 | Core test module: schema-path resolution, valid/invalid fixtures, directory/empty/missing-path exit codes, schema override. |

**Schema duplication finding.** `docs/docs/assets/schemas/latest/` and `docs/docs/assets/schemas/v2.0.0/` are **byte-identical** (verified `diff -rq` exit 0 + per-file md5; all 14 filenames match, none extra/missing). This is the expected "latest = newest released version" alias (v2.0.0 is current latest), not corruption — but ≈110 KB of the schema tree is a duplicate set. The `v2.12/` set is a separate, much smaller/older `*.schema.json` family (different `$id` host, terse descriptions, 626–1,832 B) and uniquely includes `grok-install.schema.json`. `v2.14/` is a single additive `grok-visuals.schema.json`. The three families serve different doc-site spec versions; no conflict.

**Notes / anomalies**

- **Scope-count clarification:** the audited schema set is **34 files** with **14** filenames each in `latest`/`v2.0.0` (no `grok-install`/`grok-visuals` there — `grok-install` schema lives only in `v2.12/`). No content lost.
- **`src/grok_install/__init__.py` (55 B)** — healthy: docstring + `__version__ = "1.0.0"`. Newer date (2026-05-15) than rest of `src/` (2026-05-11); `test_cli.py` (also 05-15) asserts `"1.0.0"` — version bump and test consistent. Not lost content.
- **`tests/__init__.py` (0 B)** — normal empty pytest package marker, not truncation.
- **`tests/README.md` (140 B)** self-labels "PLACEHOLDER (Phase 2b)" yet the suite is substantive (5 real parametrized `test_*.py` modules). README is stale relative to the actual tests, not the reverse.
- **`extensions/vscode` is pre-release** (`package.json` v0.1.0; marketplace publish "a later phase"). Expected WIP.
- **Schema-path coupling:** `validate.py`/`_utils.py` resolve the runtime schema from packaged `grok_install/schema.json` or dev fallback `spec/v2.14/schema.json` — a *different* location than the audited `docs/docs/assets/schemas/` publishing tree. The validator does not read the docs schemas.
- All 34 schema JSON + extension JSON parsed cleanly. No truncation/corruption, no merge-conflict markers, no empty-where-content-expected files in the scoped areas. Fixtures correctly model valid vs invalid manifests.


---

## Observations

All 227 files were inspected. No file contains git merge-conflict markers, and no file was found truncated mid-content. The findings below are ordered by severity.

### 1. CRITICAL — `website/safe-agent-builder.html` and `website/dashboard.html` do not exist anywhere in the repository

- They are **absent on `main`** (commit `7fb4294`). `git log --all` shows they have **never existed in any branch or commit**, and there are **no deleted `.html` files in the entire history** — so this is *not* a lost merge or reverted change; the files were simply never committed.
- The only files in `website/` are: `index.html`, `standard.html`, `templates.html`, `style.css`, and three `.woff2` fonts. Total HTML in the whole repo is 4 files (those three + `docs/overrides/main.html`).
- **However, the shipped Cloudflare Worker actively depends on both pages** at `${PUBLIC_BASE_URL}/safe-agent-builder.html` and `${PUBLIC_BASE_URL}/dashboard.html`:
  - `worker/src/handlers/auth.js` 302-redirects the browser to `safe-agent-builder.html` after X-OAuth start/callback, after GitHub OAuth, and on logout.
  - `worker/src/handlers/api.js` returns `dashboardUrl = ${PUBLIC_BASE_URL}/dashboard.html?genesis=…` to the client after a successful mint.
- `PUBLIC_BASE_URL` is the GitHub Pages site (`https://agentmindcloud.github.io/grok-install`), and `.github/workflows/pages.yml` builds that site by copying `website/` **flat** into the deploy artifact. Because the two pages are not in `website/`, the deployed site cannot contain them, so **the post-auth landing page and the post-mint dashboard both 404 in production** — the primary end-user flow (auth → builder, mint → dashboard) is broken at the static-hosting layer.
- This is the headline finding. Whether the two pages are planned for a later phase cannot be determined from the tree, but they are referenced by *shipped* code paths today and the repo has no placeholder for them.

### 2. Schema directory is fully duplicated

`docs/docs/assets/schemas/latest/` and `docs/docs/assets/schemas/v2.0.0/` are **byte-for-byte identical** (verified with `diff -rq` exit 0 and per-file md5; all 14 filenames match, none extra/missing). This is the expected "latest = newest released version" alias pattern, not corruption, but ≈110 KB (≈25 % of the schema tree, ≈12 % of the whole repo) is a duplicate set that must be kept in sync manually.

### 3. All 8 core templates are placeholder-identical clones

`templates/core/*.yaml` are byte-identical except for `name`, `description`, `tags`, and the header comment. Every one declares the same two tools and identical safety/rate/cost/runtime blocks. The descriptions promise differentiated behavior (AI art, podcast summaries, market analysis, etc.) that the manifests contain no logic/prompts/schedule/tools to deliver. They are schema-valid but functionally clones — consistent with `templates/README.md` saying core templates land in a follow-up PR, and their later 2026-05-14 commit date.

### 4. Project-rename cleanup is incomplete (`grok-docs` → `grok-install`)

- `docs/docs/robots.txt` advertises `Sitemap: https://agentmindcloud.github.io/grok-docs/sitemap.xml`, but the site is published under `/grok-install/` (`mkdocs.yml` `site_url`). Crawlers are pointed at a non-existent sitemap.
- Stale `grok-docs` references also remain in `contributing.md`, `for-xai/adoption-guide.md`, hardcoded absolute URLs in `playground.js` sample YAML, and `v2.14/visuals.md`.
- `docs/docs/index.md` and some version-landing pages use raw `.md` targets inside literal HTML `<a href>` tags; MkDocs does not rewrite those, so they 404 on the built site. `pages.yml` builds with `mkdocs --strict`, which catches broken *Markdown* links but **not** raw-HTML anchors — the build passes while these links break at runtime.

### 5. Explicit "Phase 2b" placeholders (intentional, but incomplete)

`spec/README.md` and `spec/v2.14/extensions/README.md` self-label `PLACEHOLDER (Phase 2b)`; the v2.14 extension field-schemas are documented as not-yet-shipped (`extensions/` under `spec/v2.14/` contains only a README). `tests/README.md` also self-labels Phase-2b placeholder even though the actual pytest suite is substantive (5 real parametrized modules) — the README is stale relative to the code, not the code being incomplete. The authoritative `spec/v2.14/schema.json` itself is complete and the example validates against it.

### 6. Small / empty files — all benign (no lost content)

| File | Size | Verdict |
|---|---:|---|
| `tests/__init__.py` | 0 B | Normal empty pytest package marker. |
| `.github/CODEOWNERS` | 12 B | Valid single rule `* @JanSol0s`. |
| `src/grok_install/__init__.py` | 55 B | Docstring + `__version__ = "1.0.0"` (version bump verified consistent with `test_cli.py`). |
| `docs/docs/robots.txt` | 87 B | Content-complete (but wrong sitemap host — see #4). |
| `tests/README.md` | 140 B | Complete one-liner (stale Phase-2b note — see #5). |
| 6 community templates (300–480 B) | tiny | Complete, valid v2.14 manifests; small only because they omit the optional `visuals` block. |

No zero-byte-where-content-is-expected files, no truncated files, and no merge-conflict markers were found in any of the 227 files.

### 7. Minor / cosmetic inconsistencies (non-blocking)

- **Two unrelated design-token systems:** `assets/brand/tokens.css|json` + `CINNABAR-GLASS.md` ("Cinnabar Glass") is **not consumed** by the shipped `website/style.css` (a different "Residual Frequencies" palette). `CINNABAR-GLASS.md` is v1.1 while `tokens.json` says `1.0.0`.
- **Multiple version axes** coexist and are easy to misread: Python package / Worker `1.0.0`, manifest spec `2.14`, `action` pins npm `grok-install-cli@2.14.0`, mint template default `1.5.0`. Each is internally consistent.
- **Deliberate Worker security posture:** `api.js` `handleMint` only logs a warning and mints anyway when the leaked-secret regex matches ("scanner-off policy"); Worker CORS is fully open (`Access-Control-Allow-Origin: *`).
- `action/action.yml` / `action/README.md` reference a non-present `docs/cli-version-pinning.md`.
- Three unrelated owner/bot identities: `CODEOWNERS` → `@JanSol0s`, badge commits → `grokinstall-bot`, org → `AgentMindCloud`.

### Conclusion

The repository is internally coherent, complete, and shows **no signs of an incomplete merge or lost commits** (clean history, no deleted HTML, no conflict markers, no truncation across all 227 files). The single material gap is **#1**: the two HTML pages the audit expected (`website/safe-agent-builder.html`, `website/dashboard.html`) are not in the repo at all, yet are required by the shipped Worker's auth and mint flows — a production-breaking gap, not a data-loss artifact. Items #2–#5 are real but lower-impact (duplication, scaffold-only core templates, stale `grok-docs` URLs, and self-labelled placeholders).

