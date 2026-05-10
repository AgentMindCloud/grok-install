# extensions/

Optional `extensions:` blocks in a v2.14 manifest, per DECISIONS.md D5. Five blocks are reserved:

1. `constitution` — references to constitution rule files used by the safety scanner.
2. `roles` — multi-agent role definitions for orchestrated manifests.
3. `provenance` — provenance and audit-trail metadata.
4. `demo` — demo metadata for marketplace listings.
5. `context` — personal-context binding metadata.

Each block is backward-compatible: a v2.14-conformant runtime that does not implement an extension MUST ignore unknown extension keys without erroring.

Authoritative block schemas land in Phase 2b alongside their consumers.

Status: PLACEHOLDER (Phase 2b)
