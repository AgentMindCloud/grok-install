# SECURITY.md
grok-install Security & Trust Policy (v2.10)

Last updated: April 2026

## Overview
grok-install is an open standard. All agent code lives in public GitHub repositories. Grok only acts as the secure installer.

## Enhanced Safety & Verification 2.0 (Phase 9)
When `safety.pre_install_scan: true` (default in v2.10):
- Grok runs a deep automated scan on **every file** in the repo before asking for any keys.
- Only truly required secrets are requested (`minimum_keys_only: true`).
- User sees a clear “Verified by Grok” badge + full scan summary before confirming install.
- If anything unusual is detected, Grok stops and shows a detailed warning.

## Automated Safety Checks (done before every install)
- No hard-coded secrets
- No dangerous permissions or shell commands
- No suspicious network calls
- Repository has not changed maliciously since last install
- All environment variables are requested privately in the user’s own chat

## “Verified by Grok” Badge
Visible on the Install pill, in the private guided flow, and on shareable cards.

## Responsibility
- **Developers**: You are fully responsible for the code in your repository.
- **Users**: You review the scan summary and decide to install.
- **Jani / xAI**: Provide the open standard and automated Grok tools only. No liability for third-party agent behaviour.

## Reporting a Security Issue
1. Open an issue in the agent’s repo  
2. Tag @JanSol0s on X  
Grok will automatically pause installs for that repo until resolved.

We take safety extremely seriously.  
Every install is now safer and simpler than manual deployment.

Built live with @JanSol0s (Jani) & Grok.
Keep it clean, calm, and precise.
