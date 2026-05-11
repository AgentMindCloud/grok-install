import { kvGet, kvPut } from './kv.js';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomChars(n) {
  const arr = new Uint8Array(n);
  crypto.getRandomValues(arr);
  let out = '';
  for (let i = 0; i < n; i++) out += ALPHABET[arr[i] % ALPHABET.length];
  return out;
}

function counterToBase32(n) {
  if (n <= 0) return ALPHABET[0].repeat(3);
  let out = '';
  while (n > 0 && out.length < 6) {
    out = ALPHABET[n % ALPHABET.length] + out;
    n = Math.floor(n / ALPHABET.length);
  }
  return out.padStart(3, ALPHABET[0]).slice(-3);
}

export async function nextCounter(env) {
  const current = parseInt(await env.GROK_INSTALL_KV.get('counter:total') ?? '0', 10) || 0;
  const next = current + 1;
  await env.GROK_INSTALL_KV.put('counter:total', String(next));
  return next;
}

export async function bumpDailyCounter(env) {
  const today = new Date().toISOString().slice(0, 10);
  const key = `counter:today:${today}`;
  const current = parseInt(await env.GROK_INSTALL_KV.get(key) ?? '0', 10) || 0;
  const next = current + 1;
  await env.GROK_INSTALL_KV.put(key, String(next), { expirationTtl: 60 * 60 * 24 * 7 });
  return next;
}

export async function generateGenesisId(env) {
  const counter = await nextCounter(env);
  const counterPart = counterToBase32(counter);
  const randomPart = randomChars(5);
  return `GA-${counterPart}${randomPart}`;
}

export async function getStats(env) {
  const total = parseInt(await env.GROK_INSTALL_KV.get('counter:total') ?? '0', 10) || 0;
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = parseInt(await env.GROK_INSTALL_KV.get(`counter:today:${today}`) ?? '0', 10) || 0;
  return { total, today: todayCount, asOf: new Date().toISOString() };
}
