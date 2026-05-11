const X_BASE = 'https://api.x.com/2';

export async function xGetMe(accessToken) {
  const res = await fetch(`${X_BASE}/users/me?user.fields=id,username,name,description,profile_image_url,public_metrics`, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`X /users/me ${res.status}: ${errText.slice(0, 200)}`);
  }
  const json = await res.json();
  return json?.data;
}

export async function xGetUserByUsername(accessToken, username) {
  const u = encodeURIComponent(username.replace(/^@/, ''));
  const res = await fetch(`${X_BASE}/users/by/username/${u}?user.fields=id,username,name,description,profile_image_url,public_metrics`, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json?.data;
}

export async function xGetUserPosts(accessToken, userId, max = 30) {
  const res = await fetch(`${X_BASE}/users/${userId}/tweets?max_results=${Math.min(max, 100)}&exclude=retweets,replies&tweet.fields=created_at,text,public_metrics`, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });
  if (!res.ok) return [];
  const json = await res.json();
  return Array.isArray(json?.data) ? json.data : [];
}

export function buildOptOutTweet(productName) {
  return `If you don't want any ${productName} agent to ever reply to you again, just reply OPTOUT to that agent. We honor it permanently.`;
}
