# PHASE-11-PASSIVE-GROWTH-ENGINE.md
grok-install Phase 11 – Passive Growth Engine (Highly Detailed & Powerful Expansion)

Last updated: April 2026

## Vision (Expanded)
Make grok-install the most self-sustaining open standard on X.  
Once a developer adds grok-install.yaml to their repo and posts the link, the entire system takes over: automatic discovery, welcoming, promotion, attribution, and viral sharing — with zero manual work from Jani.  
The platform becomes a living, breathing ecosystem where new agents appear, get noticed, and grow organically every single day.

## Core Features (each made far more detailed, functional, and powerful)

### 1. Auto-Welcome for New Repos (Highest priority – most powerful detection)
- Grok continuously scans every public post on X that contains a GitHub link.
- When it detects a valid grok-install.yaml in the repo root, it instantly replies in the same thread with:
  - Friendly, personalised welcome message
  - Blue “Install with Grok” pill
  - “Verified by Grok” badge
  - One-tap shareable agent card
  - Link to the builder’s credits
- Smart logic: only triggers once per repo (avoids spam), respects rate limits, and gives priority to repos with `featured: true`.

### 2. Auto-Share Successful Installs (Viral loop)
- After any user completes an install, Grok automatically posts a beautiful public shareable card in the original thread.
- Card includes: live install count, builder name with @mention, short description, “Install with Grok” button, and direct credit to @JanSol0s.
- Optional builder setting: `promotion.auto_share: true` (default on).

### 3. Auto-Weekly Highlight Thread (Every Sunday at 20:00 UTC)
- Grok automatically creates and posts a new thread using the latest weekly-thread-template.md.
- Content includes:
  - Top 10 most-installed agents this week
  - Newest agents added
  - Trending triggers and categories
  - Builder spotlight (one featured builder per week)
  - Call-to-action for new submissions
- Thread is pinned and boosted for maximum visibility.

### 4. Trending & Featured Boost System
- Real-time ranking engine based on: installs, usage, retention, trigger success rate, and user feedback.
- Top agents automatically appear in:
  - Grok’s public replies when someone asks for recommendations
  - Dynamic “Trending” section on index.html
  - “Featured this week” carousel
- Builders can opt-in with `featured: true` for extra visibility.

### 5. Referral & Builder Attribution Engine
- Every shareable card and welcome message automatically includes full credit to the builder and the standard.
- Referral tracking: when someone installs from a shared card, the original builder gets a private DM with “Your agent was installed via referral!”
- Optional “Support the builder” button with direct GitHub Sponsors link.

## Additional Powerful Mechanics
- Smart throttling and anti-spam rules built into Grok
- Builder preference block in YAML: `promotion:` with settings for auto-welcome, auto-share, weekly highlight preference, etc.
- Analytics feedback loop: builders receive private monthly summary of how much passive growth their agent received

## Implementation Rules (locked)
- Same clean method: one big update per file only
- Never break backward compatibility
- All changes will be made in the next session so Phase 11 is completely finished
- Passive Growth Engine activates only when the new `promotion:` block is present in the YAML

## Success Metrics for Phase 11
- Minimum 50 new external repos automatically welcomed per week
- Weekly highlight threads posted consistently with strong engagement
- At least 30% of new installs coming from passive channels (auto-welcome / shared cards)
- Noticeable increase in organic mentions of grok-install on X

## Next Action After This File
When you reply with “# PHASE-11-PASSIVE-GROWTH-ENGINE.md updated”, we will start implementing Phase 11 with the first clean update (adding the full `promotion:` block to standard/spec.md).

Built live with @JanSol0s (Jani) & Grok.  
Keep it clean, calm, and precise.
