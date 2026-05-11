const BADGE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="156" height="20"><linearGradient id="b" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><mask id="a"><rect width="156" height="20" rx="3" fill="#fff"/></mask><g mask="url(#a)"><path fill="#0a0d12" d="M0 0h82v20H0z"/><path fill="#22ee88" d="M82 0h74v20H82z"/><path fill="url(#b)" d="M0 0h156v20H0z"/></g><g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11"><text x="41" y="14">built with</text><text x="119" y="14" fill="#0a0d12">grok-install</text></g></svg>`;

const CANONICAL_SAFETY_MD = `# SAFETY.md — grok-install hard limits

This document defines the **non-negotiable safety floor** every agent built with grok-install must satisfy. The \`safety-scanner.js\` validates every YAML against these rules. Agents failing any check cannot be minted.

## Hard rules (machine-enforced)

### Behavior
1. **Reply-only on mention** — agents never proactively message anyone. No keyword scanning of public posts.
2. **No DMs** — the \`send_dm\` tool requires explicit owner approval and is disabled by default.
3. **No mass actions** — auto-follow, auto-like, auto-quote are blocked unless explicitly enabled and rate-limited.
4. **Honors opt-out immediately** — agent receives \`OPTOUT\` mention from any user → never replies to that user again.
5. **No deepfakes** — mascot generation is locked to 8 stylized illustration prompts. No real-person likenesses.

### Identity
6. **Clear AI labeling** — agent's bio must contain one of: \`AI\`, \`Bot\`, \`Powered by Grok\`.
7. **Pretend-human disallowed** — when asked "are you a bot?" the agent must answer truthfully.

### Limits
8. **Rate-limited** — \`qps\`, \`daily_replies\`, and \`daily_usd_cap\` are declared in YAML and enforced by the runtime.
9. **No bypass** — agents cannot dynamically alter their own limits at runtime.

### Security
10. **No hardcoded keys** — scanner rejects any YAML with literal API keys or secrets.
11. **Minimum scopes** — agents request only the tools they actively use.

## Owner consent for updates

Agents do not auto-update. The owner approves every change explicitly.

## Reporting issues

If you find an agent violating these rules: open an issue at https://github.com/AgentMindCloud/grok-install/issues
`;

function escapeYaml(s) {
  return String(s).replace(/"/g, '\\"');
}

// Defensive allowlist for tool names emitted into grok-install.yaml.
// Per Grok's v2.14 Q4 lockdown the runtime only honours these names; emitting
// any other name silently no-ops at install time, so we'd rather refuse to
// mint than ship a YAML the runtime will ignore. Update this set if the
// runtime adds new tools.
const ALLOWED_TOOLS = new Set([
  'reply_to_mention',
  'post_thread',
  'post_text',
  'render_preview_card',
]);

function assertToolsAllowed(yamlText) {
  for (const m of yamlText.matchAll(/^[ \t]*-[ \t]+name:[ \t]*"([^"]+)"/gm)) {
    if (!ALLOWED_TOOLS.has(m[1])) {
      throw new Error(
        `buildAgentYaml: emitted disallowed tool "${m[1]}". Allowed: ${[...ALLOWED_TOOLS].join(', ')}`
      );
    }
  }
}

export function buildAgentYaml({
  agentName,
  slug,
  genesisId,
  description,
  agentHandle,
  ownerHandle,
  ownerGithub,
  templateName = null,
  tags = null,
  category = 'x-native',
  repoUrl = null,
  // legacy v1.5 inputs accepted for backwards compatibility but ignored:
  profile, mascotStyle, optInWall, bilingual, features, limits, blockedUsers,
}) {
  const ownerHandleClean = String(ownerHandle || '').replace(/^@/, '');
  const repository = repoUrl || `https://github.com/${escapeYaml(ownerGithub || 'OwnerGitHubUsername')}/${slug || 'agent-slug'}`;
  const finalTags = Array.isArray(tags) && tags.length
    ? tags
    : ['minted', 'grok-install', 'x-native'];
  const tagsYaml = finalTags.map(t => `"${escapeYaml(t)}"`).join(', ');
  const safeDescription = (description || `${agentName} — an X-native AI agent.`)
    .replace(/[\r\n]+/g, ' ')
    .slice(0, 200);

  const yaml = `---
# yaml-language-server: $schema=https://raw.githubusercontent.com/AgentMindCloud/grok-install/main/schemas/v2.14/schema.json
# Genesis ${genesisId} — minted via grok-install
# Owner @${ownerHandleClean} — minted at ${new Date().toISOString()}
${templateName ? `# Source template: ${escapeYaml(templateName)}\n` : ''}
version: "2.14"
name: "${escapeYaml(agentName)}"
description: "${escapeYaml(safeDescription)}"
repository: "${escapeYaml(repository)}"
category: "${escapeYaml(category)}"
tags: [${tagsYaml}]

llm:
  provider: "xai"
  model: "grok-4"
  api_key_env: "GROK_API_KEY"

tools:
  - name: "reply_to_mention"
    description: "Replies to a specific X mention with a contextual response in the owner's voice"
    parameters:
      type: "object"
      properties:
        mention_id:
          type: "string"
        reply_text:
          type: "string"
          maxLength: 280
      required: ["mention_id", "reply_text"]
    returns:
      type: "object"
      properties:
        reply_url:
          type: "string"
        posted_at:
          type: "string"
          format: "date-time"

  - name: "post_thread"
    description: "Posts a thread to X after explicit owner approval"
    parameters:
      type: "object"
      properties:
        tweets:
          type: "array"
          items:
            type: "string"
            maxLength: 280
          minItems: 1
          maxItems: 10
        require_approval:
          type: "boolean"
          default: true
      required: ["tweets"]
    returns:
      type: "object"
      properties:
        thread_url:
          type: "string"
        posted_at:
          type: "string"
          format: "date-time"

safety:
  pre_install_scan: true
  verified_by_grok: true
  scan_summary_visible: true
  minimum_keys_only: true

rate_limits:
  reply_to_mention:
    qps: 0.5
    daily_cap: 200
    burst: 5
  post_thread:
    qps: 0.1
    daily_cap: 20
    burst: 2

cost_limits:
  daily_usd: 3.00
  monthly_usd: 50.00
  per_request_usd: 0.08
  on_limit: "block"

x_native_runtime:
  type: "reply-bot"
  permissions: ["tweet.read", "tweet.write"]
  grok_orchestrator: true
  one_click_x_deploy: true
`;
  assertToolsAllowed(yaml);
  return yaml;
}

export function buildAgentReadme({ agentName, agentHandle, genesisId, description, ownerHandle }) {
  const handle = String(agentHandle || '').replace(/^@/, '');
  const owner = String(ownerHandle || '').replace(/^@/, '');
  return `# ${agentName}

This is **${agentName}**, an AI agent that lives on [@${handle}](https://x.com/${handle}). Built with [grok-install](https://github.com/AgentMindCloud/grok-install) (spec v2.14). Genesis \`${genesisId}\`.

> ${description}

## Install on X

1. Post a tweet that links this repository.
2. Reply to your own tweet with \`@grok install this\`.
3. Grok runs the pre-install safety scan and brings the agent live on @${handle}'s account.

Or mint your own from [agentmindcloud.github.io/grok-install](https://agentmindcloud.github.io/grok-install).

## Owner

Built by [@${owner}](https://x.com/${owner}).

## Safety

This agent passes the v2.14 \`safety:\` block (\`pre_install_scan\`, \`verified_by_grok\`, \`scan_summary_visible\`, \`minimum_keys_only\`). Rate and cost limits are declared per-tool and enforced by the X-native runtime.

## License

Apache License 2.0. See [LICENSE](LICENSE).
`;
}

export function buildEmptyMemoryMd() {
  return `# Agent memory

This file is owner-controlled.
`;
}

export function buildAgentLicense(year, ownerGithub) {
  return `                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   Copyright ${year} ${ownerGithub}

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
   implied. See the License for the specific language governing permissions
   and limitations under the License.

   For the full text of the Apache License 2.0, see:
   https://www.apache.org/licenses/LICENSE-2.0.txt
`;
}

export function getCanonicalSafetyMd() {
  return CANONICAL_SAFETY_MD;
}

export function getCanonicalBadgeSvg() {
  return BADGE_SVG;
}

export function buildMintRepoFiles(args) {
  return [
    { path: 'grok-install.yaml', content: buildAgentYaml(args) },
    { path: 'README.md', content: buildAgentReadme(args) },
    { path: 'SAFETY.md', content: getCanonicalSafetyMd() },
    { path: 'badge.svg', content: getCanonicalBadgeSvg() },
    { path: 'memory.md', content: buildEmptyMemoryMd() },
    { path: 'LICENSE', content: buildAgentLicense(new Date().getUTCFullYear(), args.ownerGithub) },
  ];
}
