import { Buffer } from 'node:buffer';

const GH_API = 'https://api.github.com';

function ghHeaders(token, accept = 'application/vnd.github+json') {
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': accept,
    'User-Agent': 'grok-install-worker',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

function base64UrlFromBuffer(buf) {
  return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function pemToArrayBuffer(pem) {
  const stripped = pem
    .replace(/-----BEGIN [^-]+-----/, '')
    .replace(/-----END [^-]+-----/, '')
    .replace(/\s+/g, '');
  return Buffer.from(stripped, 'base64').buffer;
}

export async function exchangeOAuthCode({ clientId, clientSecret, code, redirectUri }) {
  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`GitHub OAuth ${res.status}: ${errText.slice(0, 200)}`);
  }
  const json = await res.json();
  if (!json.access_token) {
    throw new Error(`GitHub OAuth: no access_token (got ${JSON.stringify(json).slice(0, 200)})`);
  }
  return json.access_token;
}

export async function getAuthenticatedUser(token) {
  const res = await fetch(`${GH_API}/user`, { headers: ghHeaders(token) });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`GitHub /user ${res.status}: ${errText.slice(0, 200)}`);
  }
  return res.json();
}

export async function createUserRepo(token, { name, description, homepage, isPrivate = false }) {
  const res = await fetch(`${GH_API}/user/repos`, {
    method: 'POST',
    headers: ghHeaders(token),
    body: JSON.stringify({
      name,
      description: description ?? '',
      homepage: homepage ?? '',
      private: !!isPrivate,
      auto_init: true,
      has_issues: true,
      has_wiki: false,
      has_projects: false,
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`GitHub create repo ${res.status}: ${errText.slice(0, 200)}`);
  }
  return res.json();
}

async function getRef(token, owner, repo, ref) {
  const res = await fetch(`${GH_API}/repos/${owner}/${repo}/git/refs/${ref}`, { headers: ghHeaders(token) });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`GitHub get ref ${res.status}: ${errText.slice(0, 200)}`);
  }
  return res.json();
}

async function getCommit(token, owner, repo, sha) {
  const res = await fetch(`${GH_API}/repos/${owner}/${repo}/git/commits/${sha}`, { headers: ghHeaders(token) });
  if (!res.ok) throw new Error(`GitHub get commit ${res.status}`);
  return res.json();
}

async function createBlob(token, owner, repo, contentString) {
  const res = await fetch(`${GH_API}/repos/${owner}/${repo}/git/blobs`, {
    method: 'POST',
    headers: ghHeaders(token),
    body: JSON.stringify({
      content: Buffer.from(contentString, 'utf8').toString('base64'),
      encoding: 'base64',
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`GitHub create blob ${res.status}: ${errText.slice(0, 200)}`);
  }
  return res.json();
}

async function createTree(token, owner, repo, baseTree, files) {
  const tree = files.map(f => ({
    path: f.path,
    mode: '100644',
    type: 'blob',
    sha: f.sha,
  }));
  const res = await fetch(`${GH_API}/repos/${owner}/${repo}/git/trees`, {
    method: 'POST',
    headers: ghHeaders(token),
    body: JSON.stringify({ base_tree: baseTree, tree }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`GitHub create tree ${res.status}: ${errText.slice(0, 200)}`);
  }
  return res.json();
}

async function createCommit(token, owner, repo, message, treeSha, parentSha) {
  const res = await fetch(`${GH_API}/repos/${owner}/${repo}/git/commits`, {
    method: 'POST',
    headers: ghHeaders(token),
    body: JSON.stringify({ message, tree: treeSha, parents: [parentSha] }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`GitHub create commit ${res.status}: ${errText.slice(0, 200)}`);
  }
  return res.json();
}

async function updateRef(token, owner, repo, ref, sha) {
  const res = await fetch(`${GH_API}/repos/${owner}/${repo}/git/refs/${ref}`, {
    method: 'PATCH',
    headers: ghHeaders(token),
    body: JSON.stringify({ sha, force: false }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`GitHub update ref ${res.status}: ${errText.slice(0, 200)}`);
  }
  return res.json();
}

export async function commitFilesToRepo(token, { owner, repo, branch = 'main', message, files }) {
  const refData = await getRef(token, owner, repo, `heads/${branch}`);
  const parentSha = refData.object.sha;
  const parentCommit = await getCommit(token, owner, repo, parentSha);
  const baseTree = parentCommit.tree.sha;

  const blobs = [];
  for (const f of files) {
    const blob = await createBlob(token, owner, repo, f.content);
    blobs.push({ path: f.path, sha: blob.sha });
  }
  const newTree = await createTree(token, owner, repo, baseTree, blobs);
  const newCommit = await createCommit(token, owner, repo, message, newTree.sha, parentSha);
  await updateRef(token, owner, repo, `heads/${branch}`, newCommit.sha);
  return { commitSha: newCommit.sha };
}

export async function getFileContents(token, owner, repo, filePath, ref = 'main') {
  const res = await fetch(
    `${GH_API}/repos/${owner}/${repo}/contents/${encodeURIComponent(filePath)}?ref=${encodeURIComponent(ref)}`,
    { headers: ghHeaders(token) }
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`GitHub get contents ${res.status}: ${errText.slice(0, 200)}`);
  }
  const json = await res.json();
  if (json.encoding === 'base64') {
    return { sha: json.sha, content: Buffer.from(json.content, 'base64').toString('utf8') };
  }
  return { sha: json.sha, content: json.content ?? '' };
}

export async function listRepoCommits(token, owner, repo, perPage = 30) {
  const res = await fetch(`${GH_API}/repos/${owner}/${repo}/commits?per_page=${perPage}`, {
    headers: ghHeaders(token),
  });
  if (!res.ok) return [];
  return res.json();
}

export async function starRepo(token, owner, repo) {
  const res = await fetch(`${GH_API}/user/starred/${owner}/${repo}`, {
    method: 'PUT',
    headers: { ...ghHeaders(token), 'Content-Length': '0' },
  });
  return res.status === 204;
}

export async function signAppJwt(appId, privateKeyPem) {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = { iat: now - 60, exp: now + 540, iss: String(appId) };
  const headerB64 = base64UrlFromBuffer(JSON.stringify(header));
  const payloadB64 = base64UrlFromBuffer(JSON.stringify(payload));
  const signingInput = `${headerB64}.${payloadB64}`;

  const keyData = pemToArrayBuffer(privateKeyPem);
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    keyData,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(signingInput)
  );
  const sigB64 = base64UrlFromBuffer(new Uint8Array(signature));
  return `${signingInput}.${sigB64}`;
}

export async function exchangeManifestCode(code) {
  const res = await fetch(`${GH_API}/app-manifests/${encodeURIComponent(code)}/conversions`, {
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'grok-install-worker',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`GitHub manifest conversion ${res.status}: ${errText.slice(0, 200)}`);
  }
  return res.json();
}
