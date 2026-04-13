# SECURITY.md
grok-install Security & Trust Policy (v2.2)

Last updated: April 2026

## Overview
grok-install is an **open standard**. All agent code lives in public GitHub repositories. Grok only helps users install it.

## “Verified by Grok” Badge
When `security.verified_by_grok: true` is set in grok-install.yaml:
- Grok performs an automated scan of the main code files before any install.
- Users see a visible scan summary (no hidden risks).
- Badge appears on the Install pill and in the repo.

## Automated Safety Checks (done by Grok before every install)
- No hard-coded secrets in code
- No dangerous permissions or external shell commands
- No suspicious network calls
- Repository has not changed maliciously since last install
- All environment variables are requested privately

If any check fails → Grok shows clear warning and stops the install.

## Automatic Warning System
If the repo changes after a user has installed the agent, Grok will automatically notify the user in their chat thread with:
- What changed
- Whether it affects running code
- Option to update or roll back

## Responsibility
- **Developers**: You are responsible for the code in your repository.
- **Users**: You are responsible for reviewing the scan summary and the code before installing.
- **Jani / xAI**: Provide the open standard and automated Grok tools only. No liability for third-party agent behaviour.

## Manual Review Queue (optional)
High-risk agents (detected by scan) are placed in a manual review queue. Grok will notify the builder and pause public installs until cleared.

## Reporting a Security Issue
Found a vulnerability in a grok-install agent?
1. Open an issue in that repo
2. Tag @JanSol0s on X
3. Grok will auto-pause installs for that repo until fixed

We take safety extremely seriously.  
The platform is designed so users feel safer than installing random code themselves.

Built live with @JanSol0s (Jani) & Grok.  
Keep it clean, calm, and precise.
