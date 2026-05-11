import { preflight, error, json } from './lib/response.js';
import { logError, requestContext } from './lib/logger.js';
import { handleXStart, handleXCallback, handleGitHubStart, handleGitHubCallback, handleLogout } from './handlers/auth.js';
import { handleManifestCallback, handleSetupApp } from './handlers/manifest.js';
import {
  handleHealth, handleStats, handleWall, handleMintLookup,
  handleAnalyzeProfile, handleGenerateMascot, handleMint, handleStarTemplate,
  handleSpecimenSvg, handleMascotPng, handleTestAgent,
} from './handlers/api.js';
import {
  handleDashboardAgents, handleDashboardOverview,
  handleDashboardAnalytics, handleDashboardAnalyticsExport,
  handleDashboardFeaturesGet, handleDashboardFeaturesPatch,
  handleDashboardMemoryGet, handleDashboardMemoryPost,
  handleDashboardSettingsGet, handleDashboardSettingsPatch, handleDashboardSettingsYaml,
  handleDashboardUpdates, handleDashboardTriggerUpdate,
  handleDashboardHistory, handleDashboardPause, handleDashboardResume, handleDashboardDelete,
} from './handlers/dashboard.js';

async function persistError(env, e, request) {
  const ctx = requestContext(request);
  logError({ ...ctx, message: e.message, stack: (e.stack || '').slice(0, 800) });
  try {
    const ts = new Date().toISOString();
    await env.GROK_INSTALL_KV.put(
      `error:${ts}`,
      JSON.stringify({
        ts,
        ...ctx,
        message: e.message,
        stack: (e.stack || '').slice(0, 1500),
        url: request.url,
      }),
      { expirationTtl: 60 * 60 * 24 * 7 },
    );
  } catch { /* swallow */ }
}

async function route(request, env, ctx) {
  const url = new URL(request.url);
  const { pathname } = url;
  const method = request.method;

  if (method === 'OPTIONS') return preflight();

  if (pathname === '/' && method === 'GET') return handleHealth(env);

  if (pathname === '/auth/x/start' && method === 'GET') return handleXStart(request, env);
  if (pathname === '/auth/x/callback' && method === 'GET') return handleXCallback(request, env);
  if (pathname === '/auth/github/start' && method === 'GET') return handleGitHubStart(request, env);
  if (pathname === '/auth/github/callback' && method === 'GET') return handleGitHubCallback(request, env);
  if (pathname === '/auth/logout' && (method === 'GET' || method === 'POST')) return handleLogout(request, env);
  if (pathname === '/setup-app' && method === 'GET') return handleSetupApp(request, env);
  if (pathname === '/api/manifest-callback' && (method === 'GET' || method === 'POST')) return handleManifestCallback(request, env);

  if (pathname === '/api/stats' && method === 'GET') return handleStats(request, env);
  if (pathname === '/api/wall' && method === 'GET') return handleWall(request, env);
  if (pathname === '/api/analyze-profile' && method === 'POST') return handleAnalyzeProfile(request, env);
  if (pathname === '/api/generate-mascot' && method === 'POST') return handleGenerateMascot(request, env);
  if (pathname === '/api/mint' && method === 'POST') return handleMint(request, env);
  if (pathname === '/api/star-template' && method === 'POST') return handleStarTemplate(request, env);
  if (pathname === '/api/test-agent' && method === 'POST') return handleTestAgent(request, env);

  const mintLookup = pathname.match(/^\/api\/mint\/(GA-[A-Z0-9]{8})$/);
  if (mintLookup && method === 'GET') return handleMintLookup(mintLookup[1], env);

  const specimen = pathname.match(/^\/api\/specimen\/(GA-[A-Z0-9]{8})\.svg$/);
  if (specimen && method === 'GET') return handleSpecimenSvg(specimen[1], env);

  const mascot = pathname.match(/^\/api\/mascot\/(GA-[A-Z0-9]{8})\.png$/);
  if (mascot && method === 'GET') return handleMascotPng(mascot[1], env);

  if (pathname === '/api/dashboard/agents' && method === 'GET') return handleDashboardAgents(request, env);
  if (pathname === '/api/dashboard/overview' && method === 'GET') return handleDashboardOverview(request, env);
  if (pathname === '/api/dashboard/analytics' && method === 'GET') return handleDashboardAnalytics(request, env);
  if (pathname === '/api/dashboard/analytics/export' && method === 'GET') return handleDashboardAnalyticsExport(request, env);
  if (pathname === '/api/dashboard/features' && method === 'GET') return handleDashboardFeaturesGet(request, env);
  if (pathname === '/api/dashboard/features' && method === 'PATCH') return handleDashboardFeaturesPatch(request, env);
  if (pathname === '/api/dashboard/memory' && method === 'GET') return handleDashboardMemoryGet(request, env);
  if (pathname === '/api/dashboard/memory' && method === 'POST') return handleDashboardMemoryPost(request, env);
  if (pathname === '/api/dashboard/settings' && method === 'GET') return handleDashboardSettingsGet(request, env);
  if (pathname === '/api/dashboard/settings' && method === 'PATCH') return handleDashboardSettingsPatch(request, env);
  if (pathname === '/api/dashboard/settings/yaml' && method === 'GET') return handleDashboardSettingsYaml(request, env);
  if (pathname === '/api/dashboard/updates' && method === 'GET') return handleDashboardUpdates(request, env);
  if (pathname === '/api/dashboard/trigger-update' && method === 'POST') return handleDashboardTriggerUpdate(request, env);
  if (pathname === '/api/dashboard/history' && method === 'GET') return handleDashboardHistory(request, env);
  if (pathname === '/api/dashboard/pause' && method === 'POST') return handleDashboardPause(request, env);
  if (pathname === '/api/dashboard/resume' && method === 'POST') return handleDashboardResume(request, env);
  if (pathname === '/api/dashboard/delete' && method === 'POST') return handleDashboardDelete(request, env);

  return error('Not found', 404);
}

export default {
  async fetch(request, env, ctx) {
    try {
      return await route(request, env, ctx);
    } catch (e) {
      ctx?.waitUntil?.(persistError(env, e, request));
      return json({ error: 'Internal error', detail: e.message }, { status: 500 });
    }
  },
};
