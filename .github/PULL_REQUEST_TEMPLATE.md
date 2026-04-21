## Summary

<!-- One sentence: what does this PR do and why? -->

## Type of change

- [ ] Bug fix (non-breaking)
- [ ] New feature / enhancement (non-breaking)
- [ ] Breaking change (`feat!:` or `fix!:` prefix in commit — requires accepted RFC)
- [ ] Spec change (v2.14 additive only — breaking changes require RFC)
- [ ] Visuals field addition or refinement (v2.14 visuals block)
- [ ] Documentation / examples only
- [ ] CI / tooling / hygiene

## Checklist

- [ ] Spec changes documented under `spec/v2.14/spec.md`
- [ ] JSON Schema updated (`schemas/v2.14/schema.json`) and is Draft 2020-12 valid
- [ ] Back-compat preserved: every v2.13 example still validates under v2.14
- [ ] Examples updated to reflect any new fields
- [ ] Visuals fields documented in `docs/v2.14/visuals.md`
- [ ] Migration notes updated in `docs/migration/v2.13-to-v2.14.md` if relevant
- [ ] `CHANGELOG.md` entry added under `## [Unreleased]`
- [ ] Breaking changes flagged in PR title with `!`
- [ ] Linked to RFC issue (spec changes only): #
- [ ] CI passes: `validate`, `ci`, `anti-slop`, `markdown-lint`
- [ ] Landing page smoke-tested locally if HTML/CSS/JS changed
- [ ] Code of Conduct respected

## Related issues

Closes #
