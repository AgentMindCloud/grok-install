# Disclaimer

`grok-install` is an **open standard** and a set of open-source tools. It is
not a hosted service, not a warranty, and not an endorsement of any agent
installed through it.

## No Warranty

The standard, the CLI (`grok-install-cli`), the VS Code extension
(`grok-install-vscode`), the GitHub Action (`grok-install-action`), the
schemas, the landing page, and all associated code are provided **"AS IS"**
under the [Apache License 2.0](LICENSE), without warranty of any kind —
express or implied. See Sections 7 and 8 of the license for the full
disclaimer of warranty and limitation of liability.

## Safety-Scan Boundaries

When `safety.pre_install_scan: true`, `grok-install` runs an **automated,
best-effort** static analysis of the target repository. The scan is a
**signal, not a guarantee**. It is designed to catch common, visible risks.
It **cannot**:

- Detect every malicious pattern, especially obfuscated or runtime-fetched code.
- Evaluate the intent or long-term behavior of an agent.
- Guarantee that a repository has not changed between scan and execution.
- Replace the judgment of a human reviewer on code you choose to install.
- Verify the trustworthiness of third-party services the agent connects to.

The "Verified by Grok" badge means **"passed the automated scan at install
time"** — nothing more. Re-scan before every install of an unfamiliar agent.

## Third-Party Agents

Agents distributed through `grok-install` are published by third-party
developers. **AgentMindCloud, xAI, and the `grok-install` maintainers are not
responsible for the behavior, content, cost, data handling, or legal status of
any third-party agent.** Each agent repository has its own author, license,
and responsibility chain.

If you install an agent you did not write yourself, you are trusting its
author. Read the source. Read the scan summary. Review the requested
permissions and environment variables.

## Your Responsibilities

| Role | You agree to |
|---|---|
| **Developer** (publishing an agent) | Own the code in your repository. Follow all applicable laws. Keep API keys and user data secure. Disclose material changes in `CHANGELOG.md`. |
| **User** (installing an agent) | Review the pre-install scan summary. Understand what permissions you are granting. Set your own rate limits and cost caps. |
| **Operator** (running an agent on infrastructure you control) | Monitor cost, rate, and content output. Respect the X Developer Agreement, xAI terms, and any applicable platform terms. |

## Compliance

`grok-install` does not ship any compliance certification. If your use case
requires GDPR, HIPAA, SOC 2, PCI-DSS, or similar compliance, **you** are
responsible for building that on top of the standard — the standard itself
makes no compliance claims.

## Trademarks

"Grok" and "xAI" are trademarks of xAI. "X" is a trademark of X Corp.
`grok-install` is an independent open-source project and is **not** an
official xAI product. Compatibility with the xAI SDK does not imply
endorsement.

## Reporting

Report security issues following [SECURITY.md](SECURITY.md). Report spec or
safety concerns via GitHub issues or DM [@JanSol0s](https://x.com/JanSol0s).

---

By using `grok-install` you acknowledge that you have read and understood
this disclaimer.
