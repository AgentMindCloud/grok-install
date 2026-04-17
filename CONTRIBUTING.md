# Contributing to grok-install

Thanks for helping shape the open standard for Grok-native agents. This guide
covers everything you need to contribute spec changes, agent templates, bug
fixes, or documentation.

## Ways to Contribute

| Type | How |
|---|---|
| Report a bug | Open an [issue](https://github.com/AgentMindCloud/grok-install/issues/new/choose) with the `bug_report` template |
| Request a feature | Open an issue with the `feature_request` template |
| Propose a spec change | Open an issue with the `spec_rfc` template **first** — discuss before implementing |
| Submit a fix or improvement | Fork, branch, PR (see below) |
| Add a reference example | PR against `examples/` — must pass schema validation |
| Improve docs | PR against `docs/` or `spec/` — follow the style rules below |

## Spec Change Process (RFC)

Spec changes are permanent. Do not send a spec PR without an accepted RFC.

1. Open an **RFC issue** using the `spec_rfc` template.
2. Include: motivation, concrete use cases, proposed YAML, migration path, and
   impact on existing agents.
3. Wait for maintainer feedback. We aim to respond within 7 days.
4. Once accepted, you (or a maintainer) open the PR against the next spec
   version folder (`spec/v2.14/`, etc.). Never edit a released spec folder.
5. The PR must include: schema update, migration note, at least one example
   exercising the new field.

## Pull Request Requirements

Every PR must:

- [ ] Target a feature branch, not `main` directly
- [ ] Pass CI (YAML lint, schema validation, markdown lint)
- [ ] Update `CHANGELOG.md` under the `## [Unreleased]` section
- [ ] Flag breaking changes explicitly in the PR title (`feat!:`, `fix!:`)
- [ ] Link to the RFC issue if this is a spec change
- [ ] Include updated examples when adding or changing fields

## Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

feat(spec): add rate_limits block
fix(schema): allow empty tags array
docs(readme): fix quickstart install command
spec(v2.13): introduce cost_limits block
chore(ci): bump yamllint to v3
```

Accepted types: `feat`, `fix`, `docs`, `spec`, `chore`, `refactor`, `test`,
`build`, `ci`. Use `!` after the type for breaking changes.

## YAML Style Guide

- 2-space indentation, no tabs
- Max line length: 120 characters
- Keys: `snake_case` for top-level fields, `kebab-case` in tag/category values
- Strings: double quotes when the value contains `:` or starts with a number
- Always use `true`/`false`, never `yes`/`no` or `on`/`off`
- Every file starts with `---` (document-start marker)
- Inline comments are fine; avoid block comments inside mappings
- Run `yamllint -c .yamllint.yml .` locally before pushing

## Markdown Style

- ATX-style headers (`#`, not underlines)
- Fenced code blocks with language tags
- Reference-style links for anything reused more than twice
- One sentence per line in long-form docs (makes diffs readable)

## Code of Conduct

By participating you agree to uphold the [Code of Conduct](CODE_OF_CONDUCT.md).
Report unacceptable behavior to the maintainers via GitHub issue (private) or
X DM to [@JanSol0s](https://x.com/JanSol0s).

## Local Development

```bash
git clone https://github.com/AgentMindCloud/grok-install
cd grok-install

# Lint YAML
pip install yamllint
yamllint -c .yamllint.yml .

# Validate examples against schema
npm install -g ajv-cli
ajv validate -s schemas/grok-install-v2.13.schema.json -d "examples/*.yaml"

# Preview landing page
python -m http.server 8000
# open http://localhost:8000
```

## License

By contributing you agree that your contributions will be licensed under the
[Apache License 2.0](LICENSE) — the same license as the project.
