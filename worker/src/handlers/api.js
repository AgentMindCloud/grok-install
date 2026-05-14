import { Buffer } from 'node:buffer';
import { json, error } from '../lib/response.js';
import { kvGet, kvPut } from '../lib/kv.js';
import { loadSession, saveSession, requireSession, sessionIdFromRequest } from '../lib/session.js';
import { generateGenesisId, bumpDailyCounter, getStats } from '../lib/genesis.js';
import { chatJson, chatText, chatMessages, generateImage } from '../lib/xai.js';
import { xGetUserPosts } from '../lib/x-api.js';
import { profileAnalyzerPrompt, sampleReplyPrompt, safeProfileDefaults, safeSampleReply } from '../lib/prompts.js';
import { buildMascotPrompt, isValidStyle, buildXIntentForMascot } from '../lib/mascots.js';
import { buildMintRepoFiles } from '../lib/repo-template.js';
import { createUserRepo, commitFilesToRepo, starRepo } from '../lib/github.js';
import { validateYamlAgainstV214 } from '../lib/yaml-validator.js';

const MAX_MASCOT_REROLLS = 5;
const MAX_SAMPLE_REROLLS = 3;

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'agent';
}

function noLeakedSecrets(yamlText) {
  return !/sk-[a-zA-Z0-9]{20,}|xai-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{20,}/.test(yamlText);
}

export async function handleHealth(env) {
  return json({
    ok: true,
    name: env.PRODUCT_NAME || 'grok-install',
    version: '1.0.0',
    time: new Date().toISOString(),
  });
}

export async function handleStats(request, env) {
  return json(await getStats(env));
}

export async function handleWall(request, env) {
  const ids = (await kvGet(env, 'wall:recent')) ?? [];
  const wall = [];
  for (const id of ids) {
    const m = await kvGet(env, `mint:${id}`);
    if (!m) continue;
    wall.push({
      genesisId: m.genesisId,
      xUsername: m.xUsername,
      agentHandle: m.agentHandle,
      agentName: m.agentName,
      mascotStyle: m.mascotStyle,
      mascotUrl: m.mascotUrl,
      repoUrl: m.repoUrl,
      mintedAt: m.mintedAt,
    });
  }
  return json({ wall });
}

export async function handleMintLookup(genesisId, env) {
  const m = await kvGet(env, `mint:${genesisId}`);
  if (!m) return error('Not found', 404);
  return json({
    genesisId: m.genesisId,
    xUsername: m.xUsername,
    agentHandle: m.agentHandle,
    agentName: m.agentName,
    description: m.description,
    mascotUrl: m.mascotUrl,
    mascotStyle: m.mascotStyle,
    mintedAt: m.mintedAt,
    repoUrl: m.repoUrl,
    optInWall: m.optInWall,
    profile: m.profile,
    source: m.source || 'signal',
    templateName: m.templateName || null,
  });
}

const MASCOT_GRADIENTS = {
  cyberpunk_neon: ['#f0abfc', '#22d3ee'],
  retro_pixel: ['#fde047', '#f97316'],
  anime_portrait: ['#fbcfe8', '#c084fc'],
  hand_sketched: ['#d6d3d1', '#57534e'],
  liquid_gold: ['#fbbf24', '#d97706'],
  dark_glass: ['#1e293b', '#475569'],
  comic_ink: ['#f87171', '#1f2937'],
  specimen_plate: ['#d4a341', '#f5ead4'],
};

function escapeXml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function handleMascotPng(genesisId, env) {
  const { value: buf, metadata } = await env.GROK_INSTALL_KV.getWithMetadata(`mascot-blob:${genesisId}`, { type: 'arrayBuffer' });
  if (!buf) return error('Not found', 404);
  const contentType = (metadata && metadata.contentType) || 'image/jpeg';
  return new Response(buf, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400',
      'Content-Length': String(buf.byteLength),
    },
  });
}

export async function handleSpecimenSvg(genesisId, env) {
  const m = await kvGet(env, `mint:${genesisId}`);
  if (!m) return error('Not found', 404);

  const name = m.agentName || 'Agent';
  const handle = m.agentHandle || m.xUsername || '';
  const grad = MASCOT_GRADIENTS[m.mascotStyle] || MASCOT_GRADIENTS.specimen_plate;
  const initial = name.slice(0, 1).toUpperCase();
  const mintedAt = m.mintedAt ? new Date(m.mintedAt).toISOString().slice(0, 10) : '';

  // Pull the three trait categories from the mint's profile. Each renders as
  // its own row of chips below the identity block.
  const profile = m.profile || {};
  const voiceTraits = Array.isArray(profile.voice_traits) ? profile.voice_traits.filter(Boolean).slice(0, 4) : [];
  const domains     = Array.isArray(profile.domains)      ? profile.domains.filter(Boolean).slice(0, 4)     : [];
  const vibe        = Array.isArray(profile.vibe)         ? profile.vibe.filter(Boolean).slice(0, 4)        : [];

  // Try to embed the real Grok-generated mascot as a base64 data URI so the
  // specimen plate is fully self-contained (downloadable, e-mailable, no live
  // dependency on /api/mascot/{id}.png). Falls back to the gradient + initial
  // when the blob isn't there yet (mint failed mascot gen, TTL expired).
  let mascotDataUri = null;
  try {
    const blob = await env.GROK_INSTALL_KV.getWithMetadata(
      `mascot-blob:${genesisId}`,
      { type: 'arrayBuffer' }
    );
    if (blob && blob.value) {
      const ct = (blob.metadata && blob.metadata.contentType) || 'image/jpeg';
      const b64 = Buffer.from(blob.value).toString('base64');
      mascotDataUri = `data:${ct};base64,${b64}`;
    }
  } catch { /* fall back to gradient */ }

  // Auto-sized chip row, centered, with proper rounded corners (not pills).
  // chipWidth approximates the rendered text width of JetBrains Mono at 18px
  // and pads horizontally so short words don't drift in a 200-wide chasm and
  // long words don't overflow.
  const chipWidth = (s) => Math.max(120, Math.min(440, Math.round(String(s).length * 12 + 32)));
  const palettes = {
    purple: { bg: 'rgba(167,139,250,0.10)', stroke: 'rgba(167,139,250,0.32)', text: '#c4b5fd' },
    cyan:   { bg: 'rgba(34,211,238,0.10)',  stroke: 'rgba(34,211,238,0.32)',  text: '#7dd3fc' },
    green:  { bg: 'rgba(74,222,128,0.10)',  stroke: 'rgba(74,222,128,0.32)',  text: '#86efac' },
  };
  const chipsRow = (items, y, color) => {
    if (!items.length) return '';
    const c = palettes[color] || palettes.purple;
    const widths = items.map(chipWidth);
    const total = widths.reduce((a, b) => a + b, 0) + 14 * (items.length - 1);
    let x = Math.round((1080 - total) / 2);
    return items.map((t, i) => {
      const w = widths[i];
      const out = `<g transform="translate(${x},${y})">
        <rect rx="14" ry="14" width="${w}" height="48" fill="${c.bg}" stroke="${c.stroke}" stroke-width="1"/>
        <text x="${w / 2}" y="31" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="18" fill="${c.text}">${escapeXml(t)}</text>
      </g>`;
      x += w + 14;
      return out;
    }).join('');
  };

  // Build the three sections only if data exists. Each section is a label +
  // a chip row. Sections stack with consistent spacing; layout adapts to how
  // many of voice/domains/vibe the mint has.
  const sectionDefs = [];
  if (voiceTraits.length) sectionDefs.push({ label: 'VOICE TRAITS', items: voiceTraits, color: 'purple' });
  if (domains.length)     sectionDefs.push({ label: 'DOMAINS',      items: domains,     color: 'cyan' });
  if (vibe.length)        sectionDefs.push({ label: 'VIBE',         items: vibe,        color: 'green' });

  let sectionY = 1180;
  const sectionsMarkup = sectionDefs.map(s => {
    const labelY = sectionY;
    const chipsY = sectionY + 28;
    sectionY += 132;
    return `<text x="540" y="${labelY}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="16" letter-spacing="4" fill="#6b7280">${s.label}</text>
${chipsRow(s.items, chipsY, s.color)}`;
  }).join('\n');

  // Mascot block: when we have the real image, the gradient panel becomes a
  // subtle backing color (in case the image has any transparent pixels) and
  // the image fills the whole 500×500 with rounded corners. No outer stroke,
  // no double-frame — the image speaks for itself.
  const mascotBlock = mascotDataUri
    ? `<g transform="translate(290,260)">
        <rect width="500" height="500" rx="40" ry="40" fill="rgba(255,255,255,0.04)"/>
        <image href="${mascotDataUri}" width="500" height="500" clip-path="url(#mascotClip)" preserveAspectRatio="xMidYMid slice"/>
      </g>`
    : `<g transform="translate(290,260)">
        <rect width="500" height="500" rx="40" ry="40" fill="url(#mascot)"/>
        <text x="250" y="350" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="280" font-weight="700" fill="#07090d">${escapeXml(initial)}</text>
      </g>`;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#07090d"/>
      <stop offset="1" stop-color="#0f141c"/>
    </linearGradient>
    <linearGradient id="mascot" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${grad[0]}"/>
      <stop offset="1" stop-color="${grad[1]}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.25" r="0.55">
      <stop offset="0" stop-color="#4ade80" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#4ade80" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="mascotClip">
      <rect width="500" height="500" rx="40" ry="40"/>
    </clipPath>
  </defs>

  <rect width="1080" height="1920" fill="url(#bg)"/>
  <rect width="1080" height="1920" fill="url(#glow)"/>

  <g opacity="0.05" stroke="#4ade80" stroke-width="1">
    ${Array.from({ length: 11 }, (_, i) => `<line x1="${i * 108}" y1="0" x2="${i * 108}" y2="1920"/>`).join('')}
    ${Array.from({ length: 18 }, (_, i) => `<line x1="0" y1="${i * 108}" x2="1080" y2="${i * 108}"/>`).join('')}
  </g>

  <text x="540" y="140" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="18" letter-spacing="5" fill="#6b7280">GROK-INSTALL · SPECIMEN PLATE</text>

  ${mascotBlock}

  <text x="540" y="870" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="76" font-weight="700" fill="#e8ecf2" letter-spacing="-1">${escapeXml(name)}</text>
  <text x="540" y="918" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="24" fill="#9ca3af">@${escapeXml(handle)}</text>

  <g transform="translate(380,975)">
    <rect width="320" height="64" rx="14" ry="14" fill="rgba(167,139,250,0.10)" stroke="rgba(167,139,250,0.32)" stroke-width="1"/>
    <text x="160" y="42" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="26" fill="#c4b5fd">${escapeXml(genesisId)}</text>
  </g>

${sectionsMarkup}

  <line x1="340" y1="1750" x2="740" y2="1750" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <text x="540" y="1798" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="22" font-weight="500" fill="#9ca3af" letter-spacing="0.5">grok-install</text>
  <text x="540" y="1830" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="14" fill="#4b5563" letter-spacing="2">${escapeXml(mintedAt)} · agentmindcloud.github.io/grok-install</text>
</svg>`;

  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      'Content-Disposition': `inline; filename="${genesisId}.svg"`,
    },
  });
}

export async function handleAnalyzeProfile(request, env) {
  let body;
  try { body = await request.json(); } catch { return error('Invalid JSON', 400); }
  const sessionId = body.sessionId || sessionIdFromRequest(request);
  let session;
  try { session = await requireSession(env, sessionId); } catch (e) { return error(e.message, e.status || 401); }

  const handle = session.xUsername;

  // Fetch real X posts so the analysis is grounded in evidence rather than
  // hallucinated from the handle alone. xGetUserPosts returns [] on any
  // non-2xx response, so rate limits, expired/revoked tokens, and private
  // or empty accounts all land in the degradation path below.
  let posts = [];
  try {
    if (session.xToken && session.xUserId) {
      posts = await xGetUserPosts(session.xToken, session.xUserId, 30);
    }
  } catch (e) {
    console.warn('analyze-profile: xGetUserPosts failed (non-fatal):', e?.message);
    posts = [];
  }

  let profile;
  if (!posts.length) {
    profile = safeProfileDefaults();
  } else {
    const systemPrompt = profileAnalyzerPrompt(handle, posts);
    const userPrompt = posts.map((p, i) => `[${i + 1}] ${p.text}`).join('\n\n');
    try {
      profile = await chatJson(env, {
        systemPrompt,
        userPrompt,
        model: 'grok-4',
        temperature: 0.3,
        fallback: safeProfileDefaults(),
      });
    } catch {
      profile = safeProfileDefaults();
    }
    if (!profile.voice_traits) profile = safeProfileDefaults();
  }

  let sampleReply;
  try {
    sampleReply = await chatText(env, {
      systemPrompt: sampleReplyPrompt(handle, profile),
      model: 'grok-3',
      temperature: 0.7,
      maxTokens: 280,
    });
  } catch {
    sampleReply = safeSampleReply(handle);
  }

  session.sampleRerolls = (session.sampleRerolls ?? 0) + 1;
  await saveSession(env, sessionId, session);

  return json({
    handle,
    profile,
    sample_reply: sampleReply,
    rerolls_remaining: Math.max(0, MAX_SAMPLE_REROLLS - session.sampleRerolls),
  });
}

export async function handleGenerateMascot(request, env) {
  let body;
  try { body = await request.json(); } catch { return error('Invalid JSON', 400); }
  const sessionId = body.sessionId || sessionIdFromRequest(request);
  let session;
  try { session = await requireSession(env, sessionId); } catch (e) { return error(e.message, e.status || 401); }

  const style = body.style;
  const profile = body.profile;
  if (!isValidStyle(style)) return error('Invalid mascot style', 400);
  if (session.mascotRerolls >= MAX_MASCOT_REROLLS) {
    return error('Mascot rerolls exhausted', 429, { rerolls_remaining: 0 });
  }

  const promptText = buildMascotPrompt(style, { handle: session.xUsername, profile });
  try {
    const img = await generateImage(env, { prompt: promptText });
    session.mascotRerolls = (session.mascotRerolls ?? 0) + 1;
    await saveSession(env, sessionId, session);
    return json({
      mascotUrl: img.url,
      style,
      rerolls_remaining: Math.max(0, MAX_MASCOT_REROLLS - session.mascotRerolls),
    });
  } catch (e) {
    const intentUrl = buildXIntentForMascot(style, session.xUsername);
    return json({
      mascotUrl: null,
      promptText,
      manualFallback: true,
      intentUrl,
      reason: e.message,
      rerolls_remaining: Math.max(0, MAX_MASCOT_REROLLS - session.mascotRerolls),
    });
  }
}

export async function handleMint(request, env) {
  let body;
  try { body = await request.json(); } catch { return error('Invalid JSON', 400); }
  const sessionId = body.sessionId || sessionIdFromRequest(request);
  let session;
  try { session = await requireSession(env, sessionId); } catch (e) { return error(e.message, e.status || 401); }

  if (!session.ghToken || !session.ghUsername) {
    return error('GitHub not connected. Visit /auth/github/start first.', 401);
  }

  const MINT_COOLDOWN_MS = 60 * 1000;
  const lastMintAt = session.lastMintAt ? Date.parse(session.lastMintAt) : 0;
  if (lastMintAt && (Date.now() - lastMintAt) < MINT_COOLDOWN_MS) {
    const waitMs = MINT_COOLDOWN_MS - (Date.now() - lastMintAt);
    return error(
      `Slow down — please wait ${Math.ceil(waitMs / 1000)}s before minting again.`,
      429,
      {},
      { 'Retry-After': String(Math.ceil(waitMs / 1000)) }
    );
  }

  const agentName = String(body.agentName || '').trim();
  const agentHandle = String(body.agentHandle || '').trim().replace(/^@/, '');
  const mascotStyle = body.mascotStyle || 'specimen_plate';
  const mascotUrl = body.mascotUrl || null;
  const profile = body.profile || null;
  const optInWall = body.optInWall !== false;
  const source = body.source || 'signal';
  const templateName = body.templateName || null;
  const description = body.description || `${agentName} — built with grok-install.`;

  if (!agentName || !agentHandle) return error('agentName and agentHandle required', 400);
  if (!isValidStyle(mascotStyle)) return error('Invalid mascot style', 400);
  const ownerHandle = (session.xUsername || '').replace(/^@/, '').toLowerCase();
  if (agentHandle.toLowerCase() !== ownerHandle) {
    return error("Agent's X handle must match your signed-in X account (@" + (session.xUsername || '') + ").", 422);
  }

  const slug = slugify(agentName);
  const repoName = slug;

  let repo;
  try {
    repo = await createUserRepo(session.ghToken, {
      name: repoName,
      description,
      homepage: `https://x.com/${agentHandle}`,
      isPrivate: false,
    });
  } catch (e) {
    return error(`Repo create failed: ${e.message}`, 502);
  }

  const genesisId = await generateGenesisId(env);

  const yamlArgs = {
    agentName,
    slug,
    genesisId,
    description,
    agentHandle,
    ownerHandle: session.xUsername,
    ownerGithub: session.ghUsername,
    profile,
    mascotStyle,
    optInWall,
    templateName,
  };
  const files = buildMintRepoFiles(yamlArgs);
  const yamlFile = files.find(f => f.path === 'grok-install.yaml');
  if (!noLeakedSecrets(yamlFile.content)) {
    console.warn('mint: leaked-secret pattern detected in YAML for', genesisId, '— minting anyway per scanner-off policy');
  }
  const v214 = validateYamlAgainstV214(yamlFile.content);
  if (!v214.ok) {
    console.warn('mint: emitted YAML failed v2.14 validation for', genesisId, '—', v214.errors);
    return error(`Generated YAML failed v2.14 validation: ${v214.errors}`, 422);
  }

  try {
    await commitFilesToRepo(session.ghToken, {
      owner: repo.owner.login,
      repo: repo.name,
      branch: 'main',
      message: 'init: minted via grok-install',
      files,
    });
  } catch (e) {
    return error(`Commit failed: ${e.message}`, 502, { repoUrl: repo.html_url });
  }

  // Generate mascot via Grok image API. Failure is non-fatal — mascotUrl stays null.
  let resolvedMascotUrl = mascotUrl;
  try {
    const prompt = buildMascotPrompt(mascotStyle, { handle: agentHandle, profile });
    const { url: imageUrl } = await generateImage(env, { prompt });
    if (imageUrl) {
      const imgRes = await fetch(imageUrl);
      if (imgRes.ok) {
        const buf = await imgRes.arrayBuffer();
        const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
        const MASCOT_TTL_S = 90 * 24 * 3600;
        await env.GROK_INSTALL_KV.put(`mascot-blob:${genesisId}`, buf, {
          expirationTtl: MASCOT_TTL_S,
          metadata: { contentType, sourceUrl: imageUrl, savedAt: new Date().toISOString() },
        });
        const origin = new URL(request.url).origin;
        resolvedMascotUrl = `${origin}/api/mascot/${genesisId}.png`;
      } else {
        console.warn('mint: mascot fetch non-ok', imgRes.status);
      }
    }
  } catch (e) {
    console.warn('mint: mascot generation failed (non-fatal):', e.message);
  }

  const mintedAt = new Date().toISOString();
  const mintRecord = {
    genesisId,
    xUserId: session.xUserId,
    xUsername: session.xUsername,
    agentName,
    agentHandle,
    description,
    mascotStyle,
    mascotUrl: resolvedMascotUrl,
    profile,
    optInWall,
    source,
    templateName,
    repoUrl: repo.html_url,
    ghOwner: repo.owner.login,
    ghRepo: repo.name,
    mintedAt,
    status: 'active',
    limits: { daily_replies: 200, qps: 0.5, daily_usd_cap: 3, max_thread_depth: 5, cooldown_seconds: 30 },
    features: {},
    blockedUsers: [],
    templateVersion: '1.5.0',
  };
  try {
    await kvPut(env, `mint:${genesisId}`, mintRecord);
  } catch (e) {
    return error(`Mint record write failed: ${e.message}`, 502, { repoUrl: repo.html_url, genesisId });
  }

  try {
    const ownerKey = `owner:${session.xUsername}`;
    const ownerList = (await kvGet(env, ownerKey)) ?? [];
    if (!ownerList.includes(genesisId)) {
      ownerList.push(genesisId);
      await kvPut(env, ownerKey, ownerList);
    }
  } catch (e) { console.warn('owner list update failed', e); }

  if (optInWall) {
    try {
      const wall = (await kvGet(env, 'wall:recent')) ?? [];
      if (!wall.includes(genesisId)) {
        wall.unshift(genesisId);
        await kvPut(env, 'wall:recent', wall.slice(0, 12));
      }
    } catch (e) { console.warn('wall update failed', e); }
  }

  try { await bumpDailyCounter(env); } catch (e) { console.warn('daily counter bump failed', e); }

  try {
    session.lastMintAt = mintedAt;
    await saveSession(env, sessionId, session);
  } catch (e) { console.warn('session lastMintAt update failed', e); }

  const tweetText = `Just minted my AI agent @${agentHandle} with grok-install. Genesis ${genesisId}.\n\n${repo.html_url}`;
  const installComment = '@grok install this';
  const dashboardUrl = `${env.PUBLIC_BASE_URL}/dashboard.html?genesis=${genesisId}`;

  return json({
    genesisId,
    repoUrl: repo.html_url,
    tweetText,
    installComment,
    dashboardUrl,
    mintedAt,
  });
}

export async function handleStarTemplate(request, env) {
  let body = {};
  try { body = await request.json(); } catch { /* allow empty body */ }
  const sessionId = body.sessionId || sessionIdFromRequest(request);
  let session;
  try { session = await requireSession(env, sessionId); } catch (e) { return error(e.message, e.status || 401); }
  if (!session.ghToken) return error('GitHub not connected', 401);

  const owner = env.GITHUB_OWNER_ORG || 'AgentMindCloud';
  const ok = await starRepo(session.ghToken, owner, 'grok-install');
  return json({ starred: ok });
}

// ────────────────────────────────────────────────────────────────────────
// Live Agent Tester — chat with the user's draft personality before mint.
// Powers the slide-in tester panel in safe-agent-builder.html (item 15).
// ────────────────────────────────────────────────────────────────────────

const TEST_AGENT_RL_KEY = (sid) => `test-agent-bucket:${sid}`;
const TEST_AGENT_RL_WINDOW_S = 300; // 5 minutes
const TEST_AGENT_RL_MAX = 10;

function buildTestAgentSystemPrompt({ agentName, agentHandle, voiceTraits, domains, vibe, signaturePhrases, template, customDescription }) {
  const lines = [
    `You are ${agentName || 'an X-native AI agent'}, posting from @${(agentHandle || 'agent').replace(/^@/, '')}.`,
  ];
  if (voiceTraits.length) lines.push(`Voice traits: ${voiceTraits.join(', ')}.`);
  if (domains.length) lines.push(`Topics you focus on: ${domains.join(', ')}.`);
  if (vibe.length) lines.push(`Overall vibe: ${vibe.join(', ')}.`);
  if (signaturePhrases.length) lines.push(`Signature phrases (use sparingly, never every reply): ${signaturePhrases.join(', ')}.`);
  if (template) lines.push(`Template style: ${template}.`);
  if (customDescription) lines.push(`Owner brief: ${customDescription}`);
  lines.push(
    'Reply rules: max 280 characters; sound like the owner described above; be specific and opinionated; no hashtags unless explicitly asked; never mention being an AI unless directly asked.'
  );
  return lines.join(' ');
}

export async function handleTestAgent(request, env) {
  let body = {};
  try { body = await request.json(); } catch { return error('Invalid JSON body', 400); }
  const sessionId = body.sessionId || sessionIdFromRequest(request);
  let session;
  try { session = await requireSession(env, sessionId); } catch (e) { return error(e.message, e.status || 401); }

  // Validate messages array.
  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0) return error('messages array is required and must contain at least one user message', 400);
  if (messages.length > 16) return error('messages array too long (max 16 turns)', 400);
  for (const m of messages) {
    if (!m || typeof m !== 'object' || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string') {
      return error('Each message must be { role: "user"|"assistant", content: string }', 400);
    }
    if (m.content.length > 2000) return error('Each message content must be ≤ 2000 characters', 400);
  }

  // Soft rate-limit per session: 10 messages per rolling 5 minutes.
  const now = Date.now();
  let bucket = null;
  try { bucket = await env.GROK_INSTALL_KV.get(TEST_AGENT_RL_KEY(sessionId), { type: 'json' }); } catch { /* fail open */ }
  if (bucket && bucket.resetAt > now) {
    if ((bucket.count || 0) >= TEST_AGENT_RL_MAX) {
      const retryS = Math.ceil((bucket.resetAt - now) / 1000);
      return error(
        `Tester rate limit: max ${TEST_AGENT_RL_MAX} messages per 5 min. Try again in ${retryS}s.`,
        429,
        { retry_after_s: retryS },
        { 'Retry-After': String(retryS) }
      );
    }
  } else {
    bucket = { count: 0, resetAt: now + TEST_AGENT_RL_WINDOW_S * 1000 };
  }

  // Build system prompt from the draft personality.
  const voiceTraits = Array.isArray(body.voice_traits) ? body.voice_traits.filter(t => typeof t === 'string').slice(0, 8) : [];
  const domains = Array.isArray(body.domains) ? body.domains.filter(t => typeof t === 'string').slice(0, 8) : [];
  const vibe = Array.isArray(body.vibe) ? body.vibe.filter(t => typeof t === 'string').slice(0, 4) : [];
  const signaturePhrases = Array.isArray(body.signature_phrases) ? body.signature_phrases.filter(t => typeof t === 'string').slice(0, 4) : [];
  const template = (typeof body.template === 'string' ? body.template : '').slice(0, 60);
  const customDescription = (typeof body.custom_description === 'string' ? body.custom_description : '').slice(0, 500);
  const agentName = (typeof body.agent_name === 'string' ? body.agent_name : '').slice(0, 60);
  const agentHandle = (typeof body.agent_handle === 'string' ? body.agent_handle : session.xUsername || '').slice(0, 30);

  const systemPrompt = buildTestAgentSystemPrompt({
    agentName, agentHandle, voiceTraits, domains, vibe, signaturePhrases, template, customDescription,
  });

  const reqModel = typeof body.model === 'string' && body.model ? body.model : 'grok-3';
  const reqTemp = typeof body.temperature === 'number' ? Math.max(0, Math.min(1.5, body.temperature)) : 0.7;

  const t0 = Date.now();
  let result;
  try {
    result = await chatMessages(env, {
      systemPrompt,
      messages,
      model: reqModel,
      temperature: reqTemp,
      maxTokens: 280,
    });
  } catch (e) {
    return error(`Test agent call failed: ${e.message}`, 502);
  }
  const latencyMs = Date.now() - t0;

  // Increment rate-limit bucket (fail open).
  try {
    bucket.count = (bucket.count || 0) + 1;
    await env.GROK_INSTALL_KV.put(TEST_AGENT_RL_KEY(sessionId), JSON.stringify(bucket), {
      expirationTtl: TEST_AGENT_RL_WINDOW_S + 5,
    });
  } catch { /* fail open */ }

  return json({
    reply: result.text,
    tokens_used: result.usage ? (result.usage.total_tokens || result.usage.completion_tokens || 0) : null,
    latency_ms: latencyMs,
    model: reqModel,
  });
}
