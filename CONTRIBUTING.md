# Contributing to grok-install

Thanks for helping shape the open standard for one-click AI agent installs on X.
This guide covers the three most common ways to contribute.

## 1. Adding or updating your own `grok-install.yaml`

1. Fork this repo or work in your own agent repo.
2. Place `grok-install.yaml` at the repo root.
3. Validate it locally before opening a PR:
   ```sh
   npm install
   npm run validate -- path/to/grok-install.yaml
   ```
4. Open a PR using the template in `.github/pull_request_template.md`.

The `validate` CI job will fail the PR if the YAML doesn't conform to
`standard/grok-install.schema.json`.

## 2. Proposing a spec change

1. Open an issue first using the **Spec change** template. Describe the use
   case, the block/field you want to add, and any safety considerations.
2. If accepted, submit a PR that updates **all three** of:
   - `standard/spec.md` — prose description
   - `standard/grok-install.schema.json` — machine-readable schema
   - `grok-install.yaml` — root reference template
3. Add or update an example under `standard/examples/` that exercises the new
   field. CI validates every example against the schema.

## 3. UI / marketplace changes

The marketplace is vanilla HTML/CSS (`index.html`, `my-agents.html`,
`style.css`). Keep it framework-free and accessible. Test both light-DOM
interactions and keyboard navigation before submitting.

## Local checks

```sh
npm install           # one-time
npm run validate:all  # schema + examples
```

## Ground rules

- **Security first.** Agents that gate install behind unnecessary secrets or
  request broad X scopes will be rejected. Follow `SECURITY.md`.
- **No backwards-compat shims** for removed fields — if a field is gone, it's
  gone. Bump the `version` and document the migration in `spec.md`.
- **Small PRs.** One logical change per PR. Keep the diff reviewable.
- **Be kind.** See the project's Code of Conduct implied by the simple rules in
  `community-welcome.md`.

Built live with @JanSol0s & Grok.
