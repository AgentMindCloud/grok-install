import { exchangeManifestCode } from '../lib/github.js';
import { kvPut } from '../lib/kv.js';
import { html, error } from '../lib/response.js';

function buildManifestJson(workerUrl) {
  return {
    name: 'grok-install',
    url: 'https://agentmindcloud.github.io/grok-install/',
    redirect_url: `${workerUrl}/api/manifest-callback`,
    callback_urls: [`${workerUrl}/auth/github/callback`],
    hook_attributes: {
      url: `${workerUrl}/api/manifest-callback`,
      active: false,
    },
    public: false,
    default_permissions: {
      administration: 'write',
      contents: 'write',
      metadata: 'read',
    },
    default_events: [],
  };
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function handleSetupApp(request, env) {
  const workerUrl = env.WORKER_BASE_URL || new URL(request.url).origin;
  const manifestJson = JSON.stringify(buildManifestJson(workerUrl));
  const orgAction = 'https://github.com/organizations/AgentMindCloud/settings/apps/new?state=grok-install-setup';
  const userAction = 'https://github.com/settings/apps/new?state=grok-install-setup';

  const body = `<!doctype html>
<html><head><meta charset="utf-8"><title>grok-install — Register GitHub App</title>
<style>
  body { font-family: -apple-system, system-ui, sans-serif; background: #07090d; color: #e8ecf2; padding: 60px 24px; max-width: 720px; margin: 0 auto; line-height: 1.6; }
  h1 { color: #4ade80; letter-spacing: -0.01em; }
  h2 { color: #c4b5fd; margin-top: 32px; font-size: 18px; }
  p, li { color: #9ca3af; }
  code { background: #151b26; padding: 2px 6px; border-radius: 4px; color: #22d3ee; font-size: 13px; }
  .opt { background: rgba(15, 20, 28, 0.7); border: 1px solid rgba(74, 222, 128, 0.2); padding: 24px; border-radius: 14px; margin: 24px 0; }
  button { background: linear-gradient(135deg, #4ade80, #22ee88); color: #07090d; border: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer; }
  button:hover { box-shadow: 0 0 24px rgba(74, 222, 128, 0.45); }
  .alt button { background: #151b26; color: #e8ecf2; border: 1px solid rgba(74, 222, 128, 0.3); }
  .alt button:hover { background: #1f2937; }
  pre { background: #07090d; border: 1px solid #151b26; padding: 16px; border-radius: 10px; overflow-x: auto; font-size: 12px; color: #6b7280; }
</style></head>
<body>
<h1>Register grok-install GitHub App</h1>
<p>Click the green button below. GitHub will pre-fill the App registration form using the manifest JSON. Scroll to the bottom of GitHub's page and click <strong>"Create GitHub App"</strong>.</p>
<p>GitHub will redirect back to <code>${escapeHtml(workerUrl)}/api/manifest-callback</code> which stores the credentials in KV.</p>

<div class="opt">
  <h2>Option A — Register on the AgentMindCloud organization</h2>
  <p>Use this if AgentMindCloud is a GitHub organization you own.</p>
  <form method="post" action="${orgAction}">
    <input type="hidden" name="manifest" value="${escapeHtml(manifestJson)}">
    <button type="submit">Register on AgentMindCloud org →</button>
  </form>
</div>

<div class="opt alt">
  <h2>Option B — Register on your personal GitHub account</h2>
  <p>Use this if AgentMindCloud is a user account (not an org), or option A 404s.</p>
  <form method="post" action="${userAction}">
    <input type="hidden" name="manifest" value="${escapeHtml(manifestJson)}">
    <button type="submit">Register on personal account →</button>
  </form>
</div>

<h2>Manifest JSON being sent</h2>
<pre>${escapeHtml(JSON.stringify(buildManifestJson(workerUrl), null, 2))}</pre>
</body></html>`;
  return html(body);
}

export async function handleManifestCallback(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) return error('Missing code', 400);

  let creds;
  try {
    creds = await exchangeManifestCode(code);
  } catch (e) {
    return error(`Manifest exchange failed: ${e.message}`, 502);
  }

  const stored = {
    appId: creds.id,
    slug: creds.slug,
    name: creds.name,
    clientId: creds.client_id,
    clientSecret: creds.client_secret,
    privateKey: creds.pem,
    webhookSecret: creds.webhook_secret,
    htmlUrl: creds.html_url,
    storedAt: new Date().toISOString(),
  };
  await kvPut(env, 'gh-app:credentials', stored);

  const body = `<!doctype html>
<html><head><meta charset="utf-8"><title>grok-install — GitHub App created</title>
<style>
  body { font-family: -apple-system, system-ui, sans-serif; background: #07090d; color: #e8ecf2; padding: 60px 24px; max-width: 640px; margin: 0 auto; line-height: 1.6; }
  h1 { color: #4ade80; }
  code { background: #151b26; padding: 2px 6px; border-radius: 4px; }
  .ok { background: rgba(74, 222, 128, 0.08); border: 1px solid rgba(74, 222, 128, 0.3); padding: 16px; border-radius: 12px; margin: 24px 0; }
</style></head>
<body>
<h1>GitHub App created</h1>
<p>App: <strong>${stored.name}</strong> (<code>${stored.slug}</code>)</p>
<p>App ID: <code>${stored.appId}</code></p>
<div class="ok">Credentials stored in KV under <code>gh-app:credentials</code>. The mint flow is now ready to create user repos.</div>
<p>You can close this tab.</p>
</body></html>`;
  return html(body);
}
