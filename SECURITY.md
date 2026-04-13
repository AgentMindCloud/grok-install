# SECURITY.md

## Security & Responsibility Statement (v2.1)

grok-install is an **open standard**. It only tells Grok *how* to install an agent. The actual code and behavior come from the repository owner.

### How secrets are handled
- All secret keys (Telegram token, Grok API key, X API key, etc.) are requested by Grok **privately** in a direct chat with the user.
- These keys are **never** stored in any public GitHub repository.
- The keys are stored only as environment variables in the deployed application.
- Grok never displays your secrets in any public thread.

### Important warnings
- Always review the code in the GitHub repository before installing.
- You are responsible for the behavior of the deployed agent and any costs or consequences from API usage.
- Jani Starck / AgentMindCloud and xAI only provide the install standard and guided flow. We are not responsible for the content or actions of any third-party agent.

### Security features built in
- Optional `safety_checklist` in `grok-install.yaml`
- Grok performs a basic scan before deployment
- Clear private prompting for all secrets

By using grok-install you agree that you understand these responsibilities and that you have reviewed the code you are installing.

Last updated: April 2026  
Built live with @JanSol0s (Jani Starck) & Grok
