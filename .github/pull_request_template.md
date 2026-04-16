## grok-install Pull Request

Thank you for adding grok-install support to your project!

### What was added / updated

- `grok-install.yaml` at the root (v2.12 standard)
- Full Phase 14 Voice & Mobile Experience support
- Phase 12 Professional Marketplace features
- Phase 11 Passive Growth Engine (auto-welcome, auto-share cards, weekly highlights, trending)
- Native X Agent Runtime, Grok Intelligence Layer, multi-agent orchestration, safety scan, and reputation system
- `promotion:` block (recommended for full passive growth)

### How it works now

When users post your GitHub repo link on X, Grok will automatically:

- Detect `grok-install.yaml`
- Post a friendly welcome + blue **"Install with Grok"** pill
- Run a pre-install safety scan
- Offer one-click install (voice or text)
- Generate shareable install cards that help your agent grow passively

### Recommended badges for your README.md

```markdown
<image-card alt="Grok-Installed" src="https://img.shields.io/badge/Grok-Installed-00f0ff?style=for-the-badge&logo=x&logoColor=white" ></image-card>
<image-card alt="Passive Growth Enabled" src="https://img.shields.io/badge/Passive_Growth-00f0ff?style=for-the-badge&logo=x&logoColor=white" ></image-card>
Checklist for contributors

grok-install.yaml is in the repo root and follows v2.12 spec
promotion: block is included (strongly recommended)
All required environment variables are marked secret: true
Tested one-click install via @grok install this
Added the recommended badges to README.md

Thank you for helping make one-click AI agent installs the open standard on X!
Built live with @JanSol0s (Jani) & Grok.
v2.12 – April 2026
```
