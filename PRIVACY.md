# Privacy policy — grok-install

**TL;DR** — the docs site, the validator, and the private dashboard ship
**zero tracking**. Nothing you type is uploaded. Everything that remembers you
is stored in your own browser and you can wipe it with one click.

## What this repo is

`grok-install` is an open standard (a YAML file schema + docs + browser tools).
It is served as static HTML from GitHub Pages. There is no server we operate,
no account, no login.

## What runs in your browser

| Page                                 | What happens                                                                                                                                                   |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.html` (marketplace)           | Loads Tailwind + FontAwesome from their public CDNs to render the page. Reads `featured-agents.json` and `trending.json` from this repo. Nothing is sent back. |
| `validate.html`                      | Runs Ajv entirely client-side. The YAML you paste **never leaves your browser**.                                                                               |
| `my-agents.html` (private dashboard) | Stores your agent list in `localStorage["grok-install.my-agents"]`. Clearing your browser data resets it to the demo set.                                      |
| Voice commands                       | Use the Web Speech API, which in some browsers (e.g. Chrome) relays audio to a speech service — see your browser's own privacy policy. No audio is sent to us. |

## Cookies

None. No first-party cookies are set. No analytics, pixels, or fingerprinting.

## CDNs

The marketplace and dashboard pages load Tailwind from `cdn.tailwindcss.com`
and FontAwesome fonts from `cdnjs.cloudflare.com`. These CDNs will see your IP
address as part of serving the request. We do not share anything else with
them and do not receive any data back.

If you prefer zero third-party connections, vendor these assets locally in
your fork — the Content-Security-Policy meta tags in each page will tell you
exactly what to swap.

## The `analytics:` block in `grok-install.yaml`

The `analytics:` block in the spec describes what your **agent** may collect
when it is installed by a user. It is **entirely under the agent author's
control**. The spec now recommends an explicit `analytics.privacy` sub-block
so you can declare:

```yaml
analytics:
  enabled: true
  public_insights: true
  privacy:
    collects_personal_data: false # set true if you store user identifiers
    retention_days: 30 # how long metrics are kept
    data_location: "EU" # ISO region or "global"
    third_party_processors: [] # e.g. ["posthog", "plausible"]
```

Declaring these fields honestly is what earns you the “Verified by Grok”
privacy checkmark during the pre-install scan.

## Your rights

Because this project doesn't collect anything from visitors, there is no
data-access or data-deletion request to make. If you add private data (like a
custom agent entry) to the dashboard, you control it entirely — remove it
from the UI or clear your site data.

## Security disclosures

For vulnerability reports, see [SECURITY.md](SECURITY.md).

## Changes

Changes to this policy are tracked in git history. If the project ever adds
telemetry in the future, it will be disclosed in this file **before** it
ships.
