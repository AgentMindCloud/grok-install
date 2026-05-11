import { kvGet, kvPut, kvDelete } from './kv.js';
import { error as errorResponse } from './response.js';

const SESSION_TTL = 60 * 60 * 2;

function randomId(bytes = 24) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function createSession(env, fields) {
  const sessionId = randomId();
  const session = {
    xUserId: fields.xUserId,
    xUsername: fields.xUsername,
    xToken: fields.xToken,
    ghToken: fields.ghToken ?? null,
    ghUsername: fields.ghUsername ?? null,
    mascotRerolls: 0,
    sampleRerolls: 0,
    createdAt: new Date().toISOString(),
  };
  await kvPut(env, `session:${sessionId}`, session, { ttl: SESSION_TTL });
  return { sessionId, session };
}

export async function loadSession(env, sessionId) {
  if (!sessionId) return null;
  return kvGet(env, `session:${sessionId}`);
}

export async function saveSession(env, sessionId, session) {
  await kvPut(env, `session:${sessionId}`, session, { ttl: SESSION_TTL });
}

export async function attachGitHubToSession(env, sessionId, ghToken, ghUsername) {
  const session = await loadSession(env, sessionId);
  if (!session) return null;
  session.ghToken = ghToken;
  session.ghUsername = ghUsername;
  await saveSession(env, sessionId, session);
  return session;
}

export async function deleteSession(env, sessionId) {
  await kvDelete(env, `session:${sessionId}`);
}

export async function requireSession(env, sessionId) {
  const session = await loadSession(env, sessionId);
  if (!session) {
    const err = new Error('No valid session');
    err.status = 401;
    throw err;
  }
  return session;
}

export function sessionIdFromRequest(request) {
  const header = request.headers.get('X-Session-Id');
  if (header) return header;
  const url = new URL(request.url);
  return url.searchParams.get('session');
}

export async function withSession(request, env, handler) {
  const sessionId = sessionIdFromRequest(request);
  let session;
  try { session = await requireSession(env, sessionId); }
  catch (e) { return errorResponse(e.message, e.status || 401); }
  return handler(session, sessionId);
}
