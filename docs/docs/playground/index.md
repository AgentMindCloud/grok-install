---
title: Playground
description: Live, client-side YAML validator. Paste any grok-*.yaml file for instant feedback.
hide:
  - toc
---

# Playground

Paste any `grok-*.yaml` file. The validator auto-detects the file type,
runs it against the official JSON schema, and reports line-scoped errors
— all in the browser. No network round-trip.

<div id="grok-playground" class="grok-playground" markdown="0">
  <div class="grok-playground__editor">
    <div class="grok-playground__header">
      <span>YAML</span>
      <select data-grok-samples aria-label="Load a sample" style="background:transparent;color:inherit;border:1px solid var(--grok-border);border-radius:4px;padding:0.2rem 0.4rem;font-size:0.72rem;">
        <option value="">— load sample —</option>
        <optgroup label="v2.12">
          <option value="hello-grok">hello-grok (minimal install)</option>
          <option value="reply-bot">reply-engagement-bot</option>
          <option value="research-swarm">research-swarm</option>
          <option value="agent-file">grok-agent.yaml</option>
          <option value="security-strict">grok-security.yaml (strict)</option>
        </optgroup>
        <optgroup label="v2.14 visuals">
          <option value="janvisuals">JanVisuals (reference)</option>
          <option value="visuals-research-swarm">Research swarm card</option>
          <option value="visuals-reply-bot">Reply bot card</option>
        </optgroup>
      </select>
    </div>
    <div class="grok-playground__editor-host" data-grok-editor style="min-height:26rem;"></div>
    <div class="grok-playground__actions">
      <button type="button" class="grok-playground__btn" data-grok-copy>Copy install command</button>
      <button type="button" class="grok-playground__btn" data-grok-download>Download YAML</button>
    </div>
  </div>
  <div class="grok-playground__panel">
    <div class="grok-playground__header">
      <span>Validation</span>
      <span class="grok-playground__badge grok-playground__badge--warn" data-grok-badge>Booting…</span>
    </div>
    <div class="grok-playground__output" data-grok-output></div>
    <div class="grok-playground__preview" data-grok-preview></div>
  </div>
</div>

<script src="../javascripts/playground.js" defer></script>

## How it works

1. YAML is parsed with [`js-yaml`](https://github.com/nodeca/js-yaml).
2. The validator infers spec version + file type from the top-level keys:
   `spec: grok-install/...` → v2.12 install · `visuals:` → v2.14 visuals ·
   `grok:` → v2.13 config · `deploy:` → v2.13 deploy · `tools:` →
   v2.13 tools · `ui:` → v2.13 ui · `analytics:` → v2.13 analytics ·
   `test_suites:` → v2.13 test · `docs:` → v2.13 docs · `updates:` →
   v2.13 update · plus the four carried `agents:` / `workflow:` /
   `prompts:` / `safety_profile:` files.
3. It loads the matching JSON schema from `assets/schemas/v2.12/`,
   `assets/schemas/latest/` (v2.13), or `assets/schemas/v2.14/` and
   validates with [`Ajv`](https://ajv.js.org/) (`draft/2020-12`).
4. If a v2.14 `visuals:` block is present, a **live preview card**
   renders below the validation panel — reduced-motion aware.
5. Errors are reported by JSON pointer with the offending keyword
   parameters.

Everything runs in the browser — your YAML never leaves the page.

## Schemas

**v2.12** (five files, pinned):

- [`grok-install.schema.json`](../assets/schemas/v2.12/grok-install.schema.json)
- [`grok-agent.schema.json`](../assets/schemas/v2.12/grok-agent.schema.json)
- [`grok-workflow.schema.json`](../assets/schemas/v2.12/grok-workflow.schema.json)
- [`grok-security.schema.json`](../assets/schemas/v2.12/grok-security.schema.json)
- [`grok-prompts.schema.json`](../assets/schemas/v2.12/grok-prompts.schema.json)

**v2.13** (twelve files, `latest/` mirror):

- [`grok-config.json`](../assets/schemas/latest/grok-config.json) · [`grok-analytics.json`](../assets/schemas/latest/grok-analytics.json) · [`grok-deploy.json`](../assets/schemas/latest/grok-deploy.json) · [`grok-docs.json`](../assets/schemas/latest/grok-docs.json) · [`grok-test.json`](../assets/schemas/latest/grok-test.json) · [`grok-tools.json`](../assets/schemas/latest/grok-tools.json) · [`grok-ui.json`](../assets/schemas/latest/grok-ui.json) · [`grok-update.json`](../assets/schemas/latest/grok-update.json)

**v2.14** (additive visuals block):

- [`grok-visuals.schema.json`](../assets/schemas/v2.14/grok-visuals.schema.json) — [open the v2.14 playground →](v2.14.md)

Schemas are synced nightly from
[`agentmindcloud/grok-yaml-standards`](https://github.com/agentmindcloud/grok-yaml-standards)
via the `sync-schemas.yml` workflow. Versioned copies live under
`assets/schemas/v<VERSION>/`.
