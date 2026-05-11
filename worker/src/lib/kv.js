export async function kvGet(env, key) {
  const raw = await env.GROK_INSTALL_KV.get(key);
  if (raw === null) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

export async function kvGetText(env, key) {
  return env.GROK_INSTALL_KV.get(key);
}

export async function kvPut(env, key, value, opts = {}) {
  const body = typeof value === 'string' ? value : JSON.stringify(value);
  const putOpts = {};
  if (opts.ttl) putOpts.expirationTtl = opts.ttl;
  await env.GROK_INSTALL_KV.put(key, body, putOpts);
}

export async function kvDelete(env, key) {
  await env.GROK_INSTALL_KV.delete(key);
}

export async function kvList(env, prefix) {
  const out = [];
  let cursor;
  do {
    const result = await env.GROK_INSTALL_KV.list({ prefix, cursor });
    for (const k of result.keys) out.push(k.name);
    cursor = result.list_complete ? undefined : result.cursor;
  } while (cursor);
  return out;
}

export async function kvIncrement(env, key, defaultStart = 0) {
  const current = parseInt((await env.GROK_INSTALL_KV.get(key)) ?? String(defaultStart), 10) || defaultStart;
  const next = current + 1;
  await env.GROK_INSTALL_KV.put(key, String(next));
  return next;
}

export async function kvIncrementWithTtl(env, key, ttl) {
  const current = parseInt((await env.GROK_INSTALL_KV.get(key)) ?? '0', 10) || 0;
  const next = current + 1;
  await env.GROK_INSTALL_KV.put(key, String(next), { expirationTtl: ttl });
  return next;
}
