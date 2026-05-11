function base64UrlEncode(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function randomState() {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return base64UrlEncode(arr);
}

export function generateVerifier() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return base64UrlEncode(arr);
}

export async function challengeFromVerifier(verifier) {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(new Uint8Array(digest));
}

export async function generatePkce() {
  const verifier = generateVerifier();
  const challenge = await challengeFromVerifier(verifier);
  const state = randomState();
  return { verifier, challenge, state };
}
