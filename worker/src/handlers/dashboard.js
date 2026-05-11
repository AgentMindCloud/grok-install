import { json, error, attachment } from '../lib/response.js';
import { kvGet, kvPut } from '../lib/kv.js';
import { requireSession, sessionIdFromRequest } from '../lib/session.js';
import { commitFilesToRepo, getFileContents, listRepoCommits } from '../lib/github.js';
import { buildAgentYaml } from '../lib/repo-template.js';

const MEMORY_MAX_BYTES = 50 * 1024;

function csvCell(v) {
  let s = String(v ?? '');
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  s = s.replace(/"/g, '""');
  return '"' + s + '"';
}

async function loadOwnedMint(env, session, genesisId) {
  if (!genesisId) {
    const list = (await kvGet(env, `owner:${session.xUsername}`)) ?? [];
    if (!list.length) return { error: error('No agents owned', 404) };
    genesisId = list[0];
  }
  const mint = await kvGet(env, `mint:${genesisId}`);
  if (!mint) return { error: error('Mint not found', 404) };
  if (mint.xUsername !== session.xUsername) return { error: error('Forbidden', 403) };
  return { mint };
}

async function regenerateAndCommitYaml(session, mint, message) {
  const yaml = buildAgentYaml({
    agentName: mint.agentName,
    slug: mint.ghRepo,
    genesisId: mint.genesisId,
    description: mint.description,
    agentHandle: mint.agentHandle,
    ownerHandle: mint.xUsername,
    ownerGithub: mint.ghOwner,
    profile: mint.profile,
    mascotStyle: mint.mascotStyle,
    optInWall: mint.optInWall,
    templateName: mint.templateName,
    bilingual: mint.features?.bilingual_replies?.enabled ?? false,
    features: mint.features,
    limits: mint.limits,
    blockedUsers: mint.blockedUsers || [],
  });
  await commitFilesToRepo(session.ghToken, {
    owner: mint.ghOwner,
    repo: mint.ghRepo,
    branch: 'main',
    message,
    files: [{ path: 'grok-install.yaml', content: yaml }],
  });
  return yaml;
}

async function getOwnedSession(request, env) {
  const sessionId = sessionIdFromRequest(request);
  const session = await requireSession(env, sessionId);
  return { sessionId, session };
}

export async function handleDashboardAgents(request, env) {
  let session;
  try { ({ session } = await getOwnedSession(request, env)); } catch (e) { return error(e.message, e.status || 401); }
  const ids = (await kvGet(env, `owner:${session.xUsername}`)) ?? [];
  const agents = [];
  for (const id of ids) {
    const m = await kvGet(env, `mint:${id}`);
    if (!m) continue;
    agents.push({
      genesisId: m.genesisId,
      agentName: m.agentName,
      agentHandle: m.agentHandle,
      mascotUrl: m.mascotUrl,
      mintedAt: m.mintedAt,
      repoUrl: m.repoUrl,
      status: m.status || 'active',
    });
  }
  return json({ agents });
}

export async function handleDashboardOverview(request, env) {
  let session;
  try { ({ session } = await getOwnedSession(request, env)); } catch (e) { return error(e.message, e.status || 401); }
  const url = new URL(request.url);
  const { mint, error: errResp } = await loadOwnedMint(env, session, url.searchParams.get('genesis_id'));
  if (errResp) return errResp;
  const stats = (await kvGet(env, `analytics:${mint.genesisId}`)) ?? {};
  const hasData = Boolean(stats.replies_total || stats.replies_today || (stats.recent && stats.recent.length));
  return json({
    agent: {
      genesisId: mint.genesisId,
      agentName: mint.agentName,
      agentHandle: mint.agentHandle,
      mascotUrl: mint.mascotUrl,
      status: mint.status || 'active',
      mintedAt: mint.mintedAt,
      repoUrl: mint.repoUrl,
    },
    stats: {
      replies_today: stats.replies_today ?? 0,
      replies_week: stats.replies_week ?? 0,
      replies_total: stats.replies_total ?? 0,
      cost_today_usd: stats.cost_today_usd ?? 0,
      engagement_score: stats.engagement_score ?? null,
    },
    recent: stats.recent ?? [],
    connected: hasData,
    note: hasData ? null : "Real-time analytics are arriving in v1.6 — connect your agent's X account to enable.",
  });
}

export async function handleDashboardAnalytics(request, env) {
  let session;
  try { ({ session } = await getOwnedSession(request, env)); } catch (e) { return error(e.message, e.status || 401); }
  const url = new URL(request.url);
  const { mint, error: errResp } = await loadOwnedMint(env, session, url.searchParams.get('genesis_id'));
  if (errResp) return errResp;
  const period = url.searchParams.get('period') || '7d';
  const stats = (await kvGet(env, `analytics:${mint.genesisId}`)) ?? {};
  const daily = stats.daily ?? [];
  let series;
  if (period === '7d') series = daily.slice(-7);
  else if (period === '30d') series = daily.slice(-30);
  else series = daily;
  const hasData = series.length > 0 || (stats.replies_total ?? 0) > 0;
  return json({
    period,
    series,
    totals: {
      replies: stats.replies_total ?? 0,
      cost_usd: stats.cost_total_usd ?? 0,
    },
    top_topics: stats.top_topics ?? [],
    peak_hours: stats.peak_hours ?? [],
    sentiment: stats.sentiment ?? { positive: 0, neutral: 0, negative: 0 },
    best_style: stats.best_style ?? null,
    connected: hasData,
    note: hasData ? null : "Real-time analytics are arriving in v1.6.",
  });
}

export async function handleDashboardAnalyticsExport(request, env) {
  let session;
  try { ({ session } = await getOwnedSession(request, env)); } catch (e) { return error(e.message, e.status || 401); }
  const url = new URL(request.url);
  const { mint, error: errResp } = await loadOwnedMint(env, session, url.searchParams.get('genesis_id'));
  if (errResp) return errResp;
  const stats = (await kvGet(env, `analytics:${mint.genesisId}`)) ?? {};
  const daily = stats.daily ?? [];
  const lines = ['date,replies,cost_usd'];
  for (const d of daily) lines.push([csvCell(d.date), csvCell(d.replies ?? 0), csvCell(d.cost_usd ?? 0)].join(','));
  return attachment(lines.join('\n'), `${mint.ghRepo}-analytics.csv`, 'text/csv; charset=utf-8');
}

export async function handleDashboardFeaturesGet(request, env) {
  let session;
  try { ({ session } = await getOwnedSession(request, env)); } catch (e) { return error(e.message, e.status || 401); }
  const url = new URL(request.url);
  const { mint, error: errResp } = await loadOwnedMint(env, session, url.searchParams.get('genesis_id'));
  if (errResp) return errResp;
  const features = mint.features || {};
  return json({ features });
}

export async function handleDashboardFeaturesPatch(request, env) {
  let body;
  try { body = await request.json(); } catch { return error('Invalid JSON', 400); }
  let session;
  try { ({ session } = await getOwnedSession(request, env)); } catch (e) { return error(e.message, e.status || 401); }
  const { mint, error: errResp } = await loadOwnedMint(env, session, body.genesis_id);
  if (errResp) return errResp;
  const feature = body.feature;
  const enabled = !!body.enabled;
  if (!feature) return error('feature required', 400);

  mint.features = mint.features || {};
  mint.features[feature] = mint.features[feature] || {};
  mint.features[feature].enabled = enabled;
  await kvPut(env, `mint:${mint.genesisId}`, mint);

  try {
    await regenerateAndCommitYaml({ ghToken: session.ghToken }, mint, `feat: toggle ${feature} -> ${enabled}`);
  } catch (e) {
    return error(`Commit failed: ${e.message}`, 502);
  }
  return json({ features: mint.features });
}

export async function handleDashboardMemoryGet(request, env) {
  let session;
  try { ({ session } = await getOwnedSession(request, env)); } catch (e) { return error(e.message, e.status || 401); }
  const url = new URL(request.url);
  const { mint, error: errResp } = await loadOwnedMint(env, session, url.searchParams.get('genesis_id'));
  if (errResp) return errResp;
  let file;
  try {
    file = await getFileContents(session.ghToken, mint.ghOwner, mint.ghRepo, 'memory.md');
  } catch (e) {
    return error(`GitHub read failed: ${e.message}`, 502);
  }
  return json({ content: file?.content ?? '', exists: !!file });
}

export async function handleDashboardMemoryPost(request, env) {
  let body;
  try { body = await request.json(); } catch { return error('Invalid JSON', 400); }
  let session;
  try { ({ session } = await getOwnedSession(request, env)); } catch (e) { return error(e.message, e.status || 401); }
  const { mint, error: errResp } = await loadOwnedMint(env, session, body.genesis_id);
  if (errResp) return errResp;
  const content = String(body.content ?? '');
  if (new TextEncoder().encode(content).length > MEMORY_MAX_BYTES) {
    return error('memory.md exceeds 50 KB', 413);
  }
  try {
    await commitFilesToRepo(session.ghToken, {
      owner: mint.ghOwner,
      repo: mint.ghRepo,
      branch: 'main',
      message: 'memory: owner update',
      files: [{ path: 'memory.md', content }],
    });
  } catch (e) {
    return error(`Commit failed: ${e.message}`, 502);
  }
  return json({ ok: true, bytes: content.length });
}

export async function handleDashboardSettingsGet(request, env) {
  let session;
  try { ({ session } = await getOwnedSession(request, env)); } catch (e) { return error(e.message, e.status || 401); }
  const url = new URL(request.url);
  const { mint, error: errResp } = await loadOwnedMint(env, session, url.searchParams.get('genesis_id'));
  if (errResp) return errResp;
  return json({
    personality: mint.profile,
    limits: mint.limits || { daily_replies: 200, qps: 0.5, daily_usd_cap: 3 },
    blocked_users: mint.blockedUsers || [],
  });
}

function validateLimits(limits) {
  if (!limits) return null;
  if (typeof limits.daily_replies === 'number' && (limits.daily_replies < 1 || limits.daily_replies > 1000)) return 'daily_replies must be 1..1000';
  if (typeof limits.qps === 'number' && (limits.qps <= 0 || limits.qps > 5)) return 'qps must be in (0, 5]';
  if (typeof limits.daily_usd_cap === 'number' && (limits.daily_usd_cap < 1 || limits.daily_usd_cap > 50)) return 'daily_usd_cap must be 1..50';
  return null;
}

export async function handleDashboardSettingsPatch(request, env) {
  let body;
  try { body = await request.json(); } catch { return error('Invalid JSON', 400); }
  let session;
  try { ({ session } = await getOwnedSession(request, env)); } catch (e) { return error(e.message, e.status || 401); }
  const { mint, error: errResp } = await loadOwnedMint(env, session, body.genesis_id);
  if (errResp) return errResp;

  if (body.personality) mint.profile = { ...(mint.profile || {}), ...body.personality };
  if (body.limits) {
    const errMsg = validateLimits(body.limits);
    if (errMsg) return error(errMsg, 400);
    mint.limits = { ...(mint.limits || {}), ...body.limits };
  }
  if (Array.isArray(body.blocked_users)) mint.blockedUsers = body.blocked_users.map(s => String(s).replace(/^@/, ''));

  await kvPut(env, `mint:${mint.genesisId}`, mint);
  try {
    await regenerateAndCommitYaml({ ghToken: session.ghToken }, mint, 'settings: owner update');
  } catch (e) {
    return error(`Commit failed: ${e.message}`, 502);
  }
  return json({ ok: true });
}

export async function handleDashboardSettingsYaml(request, env) {
  let session;
  try { ({ session } = await getOwnedSession(request, env)); } catch (e) { return error(e.message, e.status || 401); }
  const url = new URL(request.url);
  const { mint, error: errResp } = await loadOwnedMint(env, session, url.searchParams.get('genesis_id'));
  if (errResp) return errResp;
  let file;
  try {
    file = await getFileContents(session.ghToken, mint.ghOwner, mint.ghRepo, 'grok-install.yaml');
  } catch (e) {
    return error(`GitHub read failed: ${e.message}`, 502);
  }
  return attachment(file?.content ?? '', `${mint.ghRepo}-grok-install.yaml`, 'text/yaml; charset=utf-8');
}

export async function handleDashboardUpdates(request, env) {
  let session;
  try { ({ session } = await getOwnedSession(request, env)); } catch (e) { return error(e.message, e.status || 401); }
  const url = new URL(request.url);
  const { mint, error: errResp } = await loadOwnedMint(env, session, url.searchParams.get('genesis_id'));
  if (errResp) return errResp;
  let manifest = null;
  try {
    const res = await fetch('https://agentmindcloud.github.io/grok-install/manifest.json', { cf: { cacheTtl: 60 } });
    if (res.ok) manifest = await res.json();
  } catch { /* manifest may not exist yet */ }
  return json({
    current_version: mint.templateVersion || '1.5.0',
    latest: manifest?.latest_version || null,
    changelog: manifest?.changelog || [],
    update_available: manifest?.latest_version && manifest.latest_version !== (mint.templateVersion || '1.5.0'),
  });
}

export async function handleDashboardTriggerUpdate(request, env) {
  let body;
  try { body = await request.json(); } catch { return error('Invalid JSON', 400); }
  let session;
  try { ({ session } = await getOwnedSession(request, env)); } catch (e) { return error(e.message, e.status || 401); }
  const { mint, error: errResp } = await loadOwnedMint(env, session, body.genesis_id);
  if (errResp) return errResp;
  const targetVersion = body.version || 'latest';
  await kvPut(env, `update-pending:${mint.genesisId}`, {
    targetVersion,
    requestedAt: new Date().toISOString(),
  }, { ttl: 60 * 60 });
  const tweetText = `@${mint.agentHandle} update ${targetVersion}\n\nGenesis ${mint.genesisId}`;
  return json({
    confirmIntentUrl: `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`,
  });
}

export async function handleDashboardHistory(request, env) {
  let session;
  try { ({ session } = await getOwnedSession(request, env)); } catch (e) { return error(e.message, e.status || 401); }
  const url = new URL(request.url);
  const { mint, error: errResp } = await loadOwnedMint(env, session, url.searchParams.get('genesis_id'));
  if (errResp) return errResp;
  let commits;
  try {
    commits = await listRepoCommits(session.ghToken, mint.ghOwner, mint.ghRepo, 30);
  } catch (e) {
    return error(`GitHub commits failed: ${e.message}`, 502);
  }
  const history = commits.map(c => ({
    sha: c.sha,
    message: c.commit?.message || '',
    date: c.commit?.author?.date || '',
    url: c.html_url,
  }));
  return json({ history });
}

export async function handleDashboardPause(request, env) {
  return setStatus(request, env, 'paused');
}

export async function handleDashboardResume(request, env) {
  return setStatus(request, env, 'active');
}

async function setStatus(request, env, status) {
  let body;
  try { body = await request.json(); } catch { return error('Invalid JSON', 400); }
  let session;
  try { ({ session } = await getOwnedSession(request, env)); } catch (e) { return error(e.message, e.status || 401); }
  const { mint, error: errResp } = await loadOwnedMint(env, session, body.genesis_id);
  if (errResp) return errResp;
  mint.status = status;
  await kvPut(env, `mint:${mint.genesisId}`, mint);
  return json({ status: mint.status });
}

export async function handleDashboardDelete(request, env) {
  let body;
  try { body = await request.json(); } catch { return error('Invalid JSON', 400); }
  let session;
  try { ({ session } = await getOwnedSession(request, env)); } catch (e) { return error(e.message, e.status || 401); }
  const { mint, error: errResp } = await loadOwnedMint(env, session, body.genesis_id);
  if (errResp) return errResp;
  if (body.confirm !== mint.agentName) {
    return error('Confirmation does not match agentName', 400);
  }
  await env.GROK_INSTALL_KV.delete(`mint:${mint.genesisId}`);
  const ownerKey = `owner:${session.xUsername}`;
  const list = ((await kvGet(env, ownerKey)) ?? []).filter(id => id !== mint.genesisId);
  await kvPut(env, ownerKey, list);
  const wall = ((await kvGet(env, 'wall:recent')) ?? []).filter(id => id !== mint.genesisId);
  await kvPut(env, 'wall:recent', wall);
  return json({ deleted: mint.genesisId, repoUrl: mint.repoUrl });
}
