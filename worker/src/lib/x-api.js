const X_BASE = 'https://api.x.com/2';
const DEFAULT_TIMEOUT_MS = 15000;

function xAbortable(timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return { signal: controller.signal, cleanup: () => clearTimeout(timer) };
}

export async function xGetMe(accessToken) {
  const { signal, cleanup } = xAbortable(DEFAULT_TIMEOUT_MS);
  try {
    const res = await fetch(`${X_BASE}/users/me?user.fields=id,username,name,description,profile_image_url,public_metrics`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      signal,
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      const err = new Error(`X /users/me ${res.status}: ${errText.slice(0, 200)}`);
      err.status = res.status;
      throw err;
    }
    const json = await res.json();
    return json?.data;
  } finally {
    cleanup();
  }
}

export async function xGetUserByUsername(accessToken, username) {
  const { signal, cleanup } = xAbortable(DEFAULT_TIMEOUT_MS);
  try {
    const u = encodeURIComponent(username.replace(/^@/, ''));
    const res = await fetch(`${X_BASE}/users/by/username/${u}?user.fields=id,username,name,description,profile_image_url,public_metrics`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      signal,
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data;
  } finally {
    cleanup();
  }
}

// Structured timeline fetcher. Returns { ok, status, posts, retryAfter, error }
// so the caller can distinguish "user has no posts" from "X is down" from
// "token expired" from "rate limited" — all of which the old swallowing
// pattern collapsed to an empty array.
//
//   - ok=true,  status=200: posts is the array (possibly [] for genuine
//     no-posts users)
//   - ok=false, status=401|403|404: account / token problem; surface to UI
//   - ok=false, status=429: rate limited; retryAfter (seconds) populated
//   - ok=false, status>=500: transient; we already retried once internally
//   - ok=false, status=0: network / timeout / abort
export async function fetchUserTimeline(accessToken, userId, { max = 50 } = {}) {
  const qs = new URLSearchParams({
    max_results: String(Math.min(Math.max(max, 5), 100)),
    exclude: 'retweets,replies',
    'tweet.fields': 'created_at,text,public_metrics,lang,conversation_id,entities',
  });
  const url = `${X_BASE}/users/${encodeURIComponent(userId)}/tweets?${qs.toString()}`;

  let res = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    const { signal, cleanup } = xAbortable(DEFAULT_TIMEOUT_MS);
    try {
      res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
        signal,
      });
    } catch {
      res = null;
    } finally {
      cleanup();
    }
    if (res && res.ok) break;
    // Auth/forbidden/not-found/rate-limit are terminal — don't burn the retry.
    if (res && [401, 403, 404, 429].includes(res.status)) break;
    if (attempt === 0) await new Promise(r => setTimeout(r, 500));
  }

  if (!res) return { ok: false, status: 0, posts: [], error: 'network/timeout' };

  if (res.ok) {
    let json;
    try { json = await res.json(); } catch { return { ok: false, status: 0, posts: [], error: 'json-parse' }; }
    const posts = Array.isArray(json?.data) ? json.data : [];
    return { ok: true, status: 200, posts };
  }

  if (res.status === 429) {
    const reset = Number(res.headers.get('x-rate-limit-reset')) || 0;
    const retryAfter = reset ? Math.max(1, reset - Math.floor(Date.now() / 1000)) : 60;
    return { ok: false, status: 429, posts: [], retryAfter };
  }

  const errText = await res.text().catch(() => '');
  return { ok: false, status: res.status, posts: [], error: `X ${res.status}: ${errText.slice(0, 120)}` };
}

// Back-compat thin wrapper. Returns posts only (or [] on any failure).
// Prefer fetchUserTimeline() in new code that needs to distinguish failure
// modes from a genuinely-empty timeline.
export async function xGetUserPosts(accessToken, userId, max = 30) {
  const r = await fetchUserTimeline(accessToken, userId, { max });
  return r.posts;
}

export function buildOptOutTweet(productName) {
  return `If you don't want any ${productName} agent to ever reply to you again, just reply OPTOUT to that agent. We honor it permanently.`;
}
