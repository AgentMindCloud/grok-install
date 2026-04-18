# grok-install Data Layer (v1.0)

The grok-install ecosystem ships two public, schema-validated JSON feeds. Both
are static files served from this repository (and via GitHub Pages) — no
backend, no auth, no telemetry.

| File | Purpose | Schema | Schema `$id` |
|---|---|---|---|
| [`featured-agents.json`](../featured-agents.json) | Curated, certified agents shown in the gallery on [grok-install](https://agentmindcloud.github.io/grok-install). | [`featured-agents-v1.schema.json`](../schemas/featured-agents-v1.schema.json) | `…/schemas/featured-agents-v1.schema.json` |
| [`trending.json`](../trending.json) | Time-windowed install rankings for those agents. | [`trending-v1.schema.json`](../schemas/trending-v1.schema.json) | `…/schemas/trending-v1.schema.json` |

## Versioning

Both feeds carry a `version` field of the form `MAJOR.MINOR`:

- **MINOR** bumps are additive — new optional fields, new enum values. Clients
  that only read documented fields keep working.
- **MAJOR** bumps may rename, remove, or re-type fields. Clients must opt in
  by reading a new file path (e.g. `featured-agents-v2.json`) — the old file
  stays in place for at least one release cycle.

Today: `version: "1.0"`.

## featured-agents.json

The source of truth for the gallery.

```json
{
  "version": "1.0",
  "updated_at": "2026-04-17T00:00:00Z",
  "stats": { "total_installs": 3885, "total_agents": 6, "certified_count": 5 },
  "agents": [
    {
      "id": "reply-engagement-bot",
      "name": "Reply & Engagement Bot",
      "description": "Monitors mentions and replies intelligently using Grok. Approval gates built in.",
      "category": "x-native",
      "tags": ["x-native", "beginner", "reply-bot"],
      "install_command": "grok-install install agentmindcloud/reply-engagement-bot",
      "safety_profile": "strict",
      "certified": true,
      "installs": 1284,
      "author": "@JanSol0s",
      "created_at": "2026-04-17T00:00:00Z"
    }
  ]
}
```

### Required agent fields

| Field | Type | Notes |
|---|---|---|
| `id` | string (kebab-case) | Stable identifier. Used by `trending.json` to cross-reference. |
| `name` | string (2–80) | Human-readable display name. |
| `description` | string (10–280) | One-sentence pitch. |
| `category` | enum | `x-native` · `research` · `voice` · `discord` · `telegram` · `multi-agent` · `community` |
| `tags` | string[] (1–10) | Lowercase, kebab-case. Used by gallery filter chips. |
| `install_command` | string | Must match `^grok-install install <owner>/<repo>$`. |
| `safety_profile` | enum | `strict` · `moderate` · `custom` |
| `certified` | boolean | `true` only after a clean pre-install scan. |
| `installs` | integer ≥ 0 | Total installs across all time. |
| `author` | string | GitHub or X handle. |

### Optional agent fields

| Field | Type | Notes |
|---|---|---|
| `created_at` | ISO-8601 datetime | When the agent was added. |
| `repo` | string | `<owner>/<repo>`. Defaults to inference from `install_command`. |

## trending.json

A time-windowed snapshot of install velocity. Refreshed daily (manually for
now; will be automated when the runtime ships telemetry opt-in).

```json
{
  "version": "1.0",
  "updated_at": "2026-04-18T00:00:00Z",
  "window": "7d",
  "trending": [
    {
      "id": "reply-engagement-bot",
      "name": "Reply & Engagement Bot",
      "category": "x-native",
      "installs_window": 312,
      "installs_total": 1284,
      "delta_pct": 27.4,
      "rank": 1,
      "rank_prev": 2
    }
  ]
}
```

### Cross-reference invariant

Every `trending[].id` MUST appear in `featured-agents.json`. CI fails the
build otherwise (`data-validate` job in `.github/workflows/ci.yml`).

### Window field

`window` is one of `24h`, `7d`, `30d`. Today only `7d` is published; the others
are reserved for future cadences.

## Adding an agent

1. Open a PR that appends a new `agents[]` entry to `featured-agents.json`.
2. Bump `stats.total_agents` (and `certified_count` if applicable).
3. CI validates against the schema and runs the cross-reference check.
4. After merge, the gallery picks it up on next page load (5-min
   `localStorage` cache + bundled fallback in `index.html`).

## Consuming the feeds

```js
// Browser — with 5-minute cache fallback
const res = await fetch('https://agentmindcloud.github.io/grok-install/featured-agents.json');
const { agents } = await res.json();
```

```python
# Python
import urllib.request, json
with urllib.request.urlopen("https://agentmindcloud.github.io/grok-install/featured-agents.json") as r:
    data = json.load(r)
```

Both feeds are CORS-enabled (served by GitHub Pages) and safe to fetch from
the browser without a proxy.

## Validating locally

```bash
npm install -g ajv-cli
ajv validate -s schemas/featured-agents-v1.schema.json -d featured-agents.json --spec=draft7
ajv validate -s schemas/trending-v1.schema.json        -d trending.json        --spec=draft7
```

## Roadmap

- `v1.1` (additive): per-agent `homepage_url`, `last_release`, `min_cli_version`.
- `v2.0` (breaking): `safety_profile` becomes a structured object (`{ scan: "strict", network: "loopback-only" }`).
