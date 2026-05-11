import { Buffer } from 'node:buffer';
import { generatePkce } from '../lib/pkce.js';
import { kvGet, kvPut, kvDelete } from '../lib/kv.js';
import { createSession, attachGitHubToSession, deleteSession, sessionIdFromRequest } from '../lib/session.js';
import { xGetMe } from '../lib/x-api.js';
import { json, redirect, error } from '../lib/response.js';
import { exchangeOAuthCode, getAuthenticatedUser } from '../lib/github.js';

const X_AUTHORIZE = 'https://x.com/i/oauth2/authorize';
const X_TOKEN = 'https://api.x.com/2/oauth2/token';
const X_SCOPES = 'tweet.read users.read offline.access';

const GH_AUTHORIZE = 'https://github.com/login/oauth/authorize';
const GH_SCOPES = 'public_repo user:email';

function workerBaseUrl(request, env) {
  return env.WORKER_BASE_URL || new URL(request.url).origin;
}

function builderUrl(env, params) {
  const base = `${env.PUBLIC_BASE_URL}/safe-agent-builder.html`;
  const qs = new URLSearchParams(params).toString();
  return `${base}?${qs}`;
}

function safeReturn(env, raw, fallback) {
  if (!raw) return fallback;
  let parsed;
  try { parsed = new URL(raw, env.PUBLIC_BASE_URL); }
  catch { return fallback; }
  let allowed;
  try { allowed = new URL(env.PUBLIC_BASE_URL); }
  catch { return fallback; }
  if (parsed.origin !== allowed.origin) return fallback;
  if (!parsed.pathname.startsWith(allowed.pathname)) return fallback;
  return parsed.toString();
}

export async function handleXStart(request, env) {
  const { verifier, challenge, state } = await generatePkce();
  const rawRet = new URL(request.url).searchParams.get('return');
  const ret = safeReturn(env, rawRet, builderUrl(env, {}));
  await kvPut(env, `pkce:${state}`, { verifier, return: ret, kind: 'x' }, { ttl: 600 });

  const redirectUri = `${workerBaseUrl(request, env)}/auth/x/callback`;
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: env.X_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: X_SCOPES,
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  });
  return redirect(`${X_AUTHORIZE}?${params}`);
}

export async function handleXCallback(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  if (!code || !state) return error('Missing code or state', 400);

  const pkce = await kvGet(env, `pkce:${state}`);
  if (!pkce || pkce.kind !== 'x') return error('Invalid or expired state', 400);
  await kvDelete(env, `pkce:${state}`);

  const redirectUri = `${workerBaseUrl(request, env)}/auth/x/callback`;
  const basic = Buffer.from(`${env.X_CLIENT_ID}:${env.X_CLIENT_SECRET}`).toString('base64');
  const tokenRes = await fetch(X_TOKEN, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: pkce.verifier,
      client_id: env.X_CLIENT_ID,
    }).toString(),
  });
  if (!tokenRes.ok) {
    const t = await tokenRes.text().catch(() => '');
    return error(`X token exchange failed: ${tokenRes.status} ${t.slice(0, 200)}`, 502);
  }
  const tokenJson = await tokenRes.json();
  const accessToken = tokenJson.access_token;
  if (!accessToken) return error('X token exchange: no access_token', 502);

  let me;
  try {
    me = await xGetMe(accessToken);
  } catch (e) {
    return error(`X /users/me failed: ${e.message}`, 502);
  }
  const { sessionId } = await createSession(env, {
    xUserId: me.id,
    xUsername: me.username,
    xToken: accessToken,
  });

  const target = pkce.return && pkce.return !== builderUrl(env, {})
    ? pkce.return + (pkce.return.includes('?') ? '&' : '?') + 'session=' + encodeURIComponent(sessionId) + '&authed=1'
    : builderUrl(env, { session: sessionId, authed: '1' });
  return redirect(target);
}

export async function handleGitHubStart(request, env) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('session');
  if (!sessionId) return error('Missing session', 400);
  const rawRet = url.searchParams.get('return');
  const ret = safeReturn(env, rawRet, builderUrl(env, { session: sessionId, gh: '1' }));
  const state = crypto.randomUUID();
  await kvPut(env, `pkce:${state}`, { kind: 'gh', sessionId, return: ret }, { ttl: 600 });

  const creds = await kvGet(env, 'gh-app:credentials');
  if (!creds?.clientId) {
    return error('GitHub App not configured. Run /api/manifest-callback first.', 503);
  }

  const redirectUri = `${workerBaseUrl(request, env)}/auth/github/callback`;
  const params = new URLSearchParams({
    client_id: creds.clientId,
    redirect_uri: redirectUri,
    scope: GH_SCOPES,
    state,
    allow_signup: 'true',
  });
  return redirect(`${GH_AUTHORIZE}?${params}`);
}

export async function handleGitHubCallback(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  if (!code || !state) return error('Missing code or state', 400);

  const pkce = await kvGet(env, `pkce:${state}`);
  if (!pkce || pkce.kind !== 'gh') return error('Invalid or expired state', 400);
  await kvDelete(env, `pkce:${state}`);

  const creds = await kvGet(env, 'gh-app:credentials');
  if (!creds?.clientId) return error('GitHub App not configured', 503);

  const redirectUri = `${workerBaseUrl(request, env)}/auth/github/callback`;
  let token;
  try {
    token = await exchangeOAuthCode({
      clientId: creds.clientId,
      clientSecret: creds.clientSecret,
      code,
      redirectUri,
    });
  } catch (e) {
    return error(`GitHub OAuth exchange failed: ${e.message}`, 502);
  }
  let user;
  try {
    user = await getAuthenticatedUser(token);
  } catch (e) {
    return error(`GitHub /user failed: ${e.message}`, 502);
  }
  await attachGitHubToSession(env, pkce.sessionId, token, user.login);
  return redirect(pkce.return);
}

export async function handleLogout(request, env) {
  let sessionId = sessionIdFromRequest(request);
  if (!sessionId && request.method === 'POST') {
    try {
      const body = await request.json();
      sessionId = body?.sessionId || null;
    } catch { /* empty body is fine */ }
  }
  if (sessionId) {
    try { await deleteSession(env, sessionId); } catch { /* swallow */ }
  }
  if (request.method === 'GET') {
    return redirect(`${env.PUBLIC_BASE_URL}/safe-agent-builder.html`);
  }
  return json({ ok: true });
}
