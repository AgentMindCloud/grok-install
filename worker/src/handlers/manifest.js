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

// Inlined Cinnabar Glass styles for one-off worker-rendered surfaces.
// Stays in lockstep with website/style.css and DESIGN_SYSTEM.md.
const cinnabarGlassStyles = `
  *,*::before,*::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: 'Geist', system-ui, -apple-system, 'Segoe UI', sans-serif;
    background:
      radial-gradient(ellipse 50% 50% at 80% 20%, rgba(255,122,61,0.10), transparent 60%),
      radial-gradient(ellipse 60% 60% at 20% 80%, rgba(199,62,29,0.07), transparent 70%),
      #0D0D0D;
    color: #F5F5F5;
    min-height: 100vh;
    padding: 64px 24px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }
  .wrap { max-width: 720px; margin: 0 auto; }
  .brand {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.20em;
    text-transform: uppercase;
    color: rgba(245,245,245,0.50);
    margin: 0 0 32px 0;
  }
  .brand .dot {
    display: inline-block;
    width: 6px; height: 6px;
    border-radius: 999px;
    background: #C73E1D;
    margin-right: 10px;
    vertical-align: middle;
    box-shadow: 0 0 16px rgba(199,62,29,0.7);
  }
  h1 {
    font-family: 'Geist', system-ui, sans-serif;
    font-size: clamp(32px, 5vw, 44px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin: 0 0 16px 0;
    color: #F5F5F5;
  }
  h1 .grad {
    background: linear-gradient(180deg, #FFD4A8 0%, #FF7A3D 35%, #C73E1D 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  h2 {
    font-family: 'Geist', system-ui, sans-serif;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: #F5F5F5;
    margin: 0 0 12px 0;
  }
  p { color: rgba(245,245,245,0.80); margin: 0 0 16px 0; font-size: 16px; }
  p:last-child { margin-bottom: 0; }
  code {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    color: #FF7A3D;
    background: rgba(255,122,61,0.08);
    border: 1px solid rgba(255,122,61,0.18);
    padding: 1px 6px;
    border-radius: 4px;
  }
  pre {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    color: rgba(245,245,245,0.70);
    background: #111113;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 20px;
    overflow-x: auto;
    box-shadow: 0 8px 32px rgba(0,0,0,0.32);
  }
  .panel {
    background: rgba(28,28,30,0.55);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 32px;
    margin: 24px 0;
    backdrop-filter: blur(20px) saturate(120%);
    -webkit-backdrop-filter: blur(20px) saturate(120%);
    box-shadow: 0 8px 32px rgba(0,0,0,0.32);
  }
  .panel.alt {
    background: rgba(28,28,30,0.35);
    border-color: rgba(255,255,255,0.06);
  }
  .ok {
    background: rgba(199,62,29,0.10);
    border: 1px solid rgba(199,62,29,0.40);
    border-radius: 12px;
    padding: 14px 18px;
    margin: 20px 0;
    color: #F5F5F5;
  }
  .ok strong { color: #FF7A3D; }
  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    border-radius: 12px;
    border: 1px solid #C73E1D;
    background: rgba(199,62,29,0.10);
    color: #F5F5F5;
    font-family: 'Geist', system-ui, sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 200ms ease, box-shadow 200ms ease, border-color 200ms ease, transform 200ms ease;
  }
  .btn-primary:hover, .btn-primary:focus-visible {
    background: linear-gradient(180deg, #FF7A3D 0%, #C73E1D 100%);
    border-color: transparent;
    box-shadow: 0 0 80px rgba(255,122,61,0.30);
    transform: translateY(-1px);
  }
  .btn-primary.alt {
    background: rgba(255,255,255,0.04);
    border-color: rgba(255,255,255,0.08);
  }
  .btn-primary.alt:hover, .btn-primary.alt:focus-visible {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.16);
    box-shadow: none;
  }
  :focus-visible { outline: 2px solid #C73E1D; outline-offset: 4px; border-radius: 4px; }
  @media (max-width: 640px) {
    body { padding: 32px 16px; }
    .panel { padding: 24px; }
  }
`;

export async function handleSetupApp(request, env) {
  const workerUrl = env.WORKER_BASE_URL || new URL(request.url).origin;
  const manifestJson = JSON.stringify(buildManifestJson(workerUrl));
  const orgAction = 'https://github.com/organizations/AgentMindCloud/settings/apps/new?state=grok-install-setup';
  const userAction = 'https://github.com/settings/apps/new?state=grok-install-setup';

  const body = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#0D0D0D">
<title>grok-install — Register GitHub App</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;700&display=swap">
<style>${cinnabarGlassStyles}</style>
</head>
<body>
<div class="wrap">
  <p class="brand"><span class="dot"></span>grok-install &middot; admin setup</p>
  <h1>Register the <span class="grad">GitHub App</span></h1>
  <p>GitHub will pre-fill the App registration form using the manifest JSON below. Scroll to the bottom of GitHub's page and click <strong>Create GitHub App</strong>. GitHub then redirects back to <code>${escapeHtml(workerUrl)}/api/manifest-callback</code> which stores the credentials in KV.</p>

  <div class="panel">
    <h2>Option A — Register on the AgentMindCloud organization</h2>
    <p>Use this if AgentMindCloud is a GitHub organization you own.</p>
    <form method="post" action="${orgAction}">
      <input type="hidden" name="manifest" value="${escapeHtml(manifestJson)}">
      <button type="submit" class="btn-primary">Register on AgentMindCloud org &rarr;</button>
    </form>
  </div>

  <div class="panel alt">
    <h2>Option B — Register on your personal account</h2>
    <p>Use this if AgentMindCloud is a user account (not an org), or if option A 404s.</p>
    <form method="post" action="${userAction}">
      <input type="hidden" name="manifest" value="${escapeHtml(manifestJson)}">
      <button type="submit" class="btn-primary alt">Register on personal account &rarr;</button>
    </form>
  </div>

  <h2 style="margin-top:32px;">Manifest JSON being sent</h2>
  <pre>${escapeHtml(JSON.stringify(buildManifestJson(workerUrl), null, 2))}</pre>
</div>
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
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#0D0D0D">
<title>grok-install — GitHub App created</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;700&display=swap">
<style>${cinnabarGlassStyles}</style>
</head>
<body>
<div class="wrap">
  <p class="brand"><span class="dot"></span>grok-install &middot; admin setup</p>
  <h1>App <span class="grad">created</span>.</h1>
  <div class="panel">
    <p>App: <strong>${escapeHtml(stored.name)}</strong> (<code>${escapeHtml(stored.slug)}</code>)</p>
    <p>App ID: <code>${escapeHtml(String(stored.appId))}</code></p>
    <div class="ok">Credentials stored in KV under <code>gh-app:credentials</code>. The mint flow is now ready to create user repos.</div>
    <p>You can close this tab.</p>
  </div>
</div>
</body></html>`;
  return html(body);
}
