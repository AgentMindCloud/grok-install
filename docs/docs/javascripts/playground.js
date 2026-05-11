// docs/javascripts/playground.js
// grok-docs — live YAML validator + v2.14 visuals preview.
// Pure client-side. Monaco editor + js-yaml + Ajv against local schemas.

(function () {
  "use strict";

  const SCHEMA_ROOT = "../assets/schemas/";

  const SCHEMA_MAP = {
    "v2.12": {
      dir: "v2.12/",
      files: {
        "grok-install": "grok-install.schema.json",
        "grok-agent": "grok-agent.schema.json",
        "grok-workflow": "grok-workflow.schema.json",
        "grok-security": "grok-security.schema.json",
        "grok-prompts": "grok-prompts.schema.json",
      },
    },
    "latest": {
      dir: "latest/",
      files: {
        "grok-agent": "grok-agent.json",
        "grok-analytics": "grok-analytics.json",
        "grok-config": "grok-config.json",
        "grok-deploy": "grok-deploy.json",
        "grok-docs": "grok-docs.json",
        "grok-prompts": "grok-prompts.json",
        "grok-security": "grok-security.json",
        "grok-test": "grok-test.json",
        "grok-tools": "grok-tools.json",
        "grok-ui": "grok-ui.json",
        "grok-update": "grok-update.json",
        "grok-workflow": "grok-workflow.json",
      },
    },
    "v2.14": {
      dir: "v2.14/",
      files: {
        "grok-visuals": "grok-visuals.schema.json",
      },
    },
  };

  const DEFAULT_YAML = [
    "spec: grok-install/v2.12",
    "name: hello-grok",
    "description: The simplest possible Grok agent. Single agent, single tool.",
    "entrypoint: .grok/grok-agent.yaml",
    "model: grok-4",
    "runtime:",
    "  python: \">=3.11\"",
    "env:",
    "  - XAI_API_KEY",
    "",
  ].join("\n");

  const MONACO_VERSION = "0.50.0";
  const MONACO_BASE = `https://cdn.jsdelivr.net/npm/monaco-editor@${MONACO_VERSION}/min/vs`;
  const JS_YAML_URL = "https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js";
  const AJV_URL = "https://cdn.jsdelivr.net/npm/ajv@8.17.1/dist/ajv2020.bundle.min.js";

  let editor = null;
  let monaco = null;
  let ajvInstance = null;
  const schemaCache = {};
  let lastYaml = "";
  let debounceTimer = null;

  async function boot() {
    const host = document.getElementById("grok-playground");
    if (!host || host.dataset.booted === "1") return;
    host.dataset.booted = "1";

    await Promise.all([loadScript(JS_YAML_URL), loadScript(AJV_URL)]);
    await loadMonaco();
    setupEditor(host);
    setupActions(host);

    const initial = pickInitialSample(host);
    if (initial) editor.setValue(initial);
    scheduleValidation(0);
  }

  function pickInitialSample(host) {
    const fromAttr = host.dataset.grokSample;
    if (fromAttr && SAMPLES[fromAttr]) return SAMPLES[fromAttr];
    try {
      const q = new URLSearchParams(window.location.search);
      const key = q.get("sample");
      if (key && SAMPLES[key]) return SAMPLES[key];
    } catch (_) { /* ignore */ }
    return null;
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(s);
    });
  }

  function loadMonaco() {
    return new Promise((resolve, reject) => {
      const loader = document.createElement("script");
      loader.src = `${MONACO_BASE}/loader.js`;
      loader.onload = () => {
        // eslint-disable-next-line no-undef
        require.config({ paths: { vs: MONACO_BASE } });
        // eslint-disable-next-line no-undef
        require(["vs/editor/editor.main"], function () {
          monaco = window.monaco;
          resolve();
        });
      };
      loader.onerror = () => reject(new Error("Monaco loader failed"));
      document.head.appendChild(loader);
    });
  }

  function setupEditor(host) {
    const editorHost = host.querySelector("[data-grok-editor]");
    const isDark =
      document.body.getAttribute("data-md-color-scheme") === "slate" ||
      document.documentElement.getAttribute("data-md-color-scheme") === "slate";

    monaco.editor.defineTheme("grok-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "type", foreground: "00d4ff" },
        { token: "string", foreground: "c9cdd6" },
        { token: "number", foreground: "ffcf5c" },
        { token: "comment", foreground: "6e7580", fontStyle: "italic" },
      ],
      colors: {
        "editor.background": "#0c0d10",
        "editor.foreground": "#e6e9ef",
        "editorLineNumber.foreground": "#3a3f48",
        "editorLineNumber.activeForeground": "#00d4ff",
        "editor.selectionBackground": "#00d4ff22",
        "editorCursor.foreground": "#00d4ff",
      },
    });

    editor = monaco.editor.create(editorHost, {
      value: DEFAULT_YAML,
      language: "yaml",
      theme: isDark ? "grok-dark" : "vs",
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 13,
      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
      scrollBeyondLastLine: false,
      tabSize: 2,
      insertSpaces: true,
      renderWhitespace: "selection",
      wordWrap: "on",
    });

    editor.onDidChangeModelContent(() => scheduleValidation(250));

    const observer = new MutationObserver(() => {
      const nowDark =
        document.body.getAttribute("data-md-color-scheme") === "slate" ||
        document.documentElement.getAttribute("data-md-color-scheme") === "slate";
      monaco.editor.setTheme(nowDark ? "grok-dark" : "vs");
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-md-color-scheme"],
    });
  }

  function setupActions(host) {
    const copyBtn = host.querySelector("[data-grok-copy]");
    const downloadBtn = host.querySelector("[data-grok-download]");
    const sampleSel = host.querySelector("[data-grok-samples]");

    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        const repo = inferInstallRepo(editor.getValue());
        const cmd = repo
          ? `grok-install install ${repo}`
          : "grok-install install <owner>/<repo>";
        try {
          await navigator.clipboard.writeText(cmd);
          flash(copyBtn, "Copied!");
        } catch {
          flash(copyBtn, "Copy failed");
        }
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => {
        const blob = new Blob([editor.getValue()], { type: "text/yaml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const detected = detectKindAndVersion(editor.getValue());
        const kind = (detected && detected.kind) || "grok-install";
        a.href = url;
        a.download = `${kind}.yaml`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }

    if (sampleSel) {
      sampleSel.addEventListener("change", () => {
        const sample = SAMPLES[sampleSel.value];
        if (sample) editor.setValue(sample);
      });
    }
  }

  function scheduleValidation(delay) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runValidation, delay);
  }

  async function runValidation() {
    const text = editor.getValue();
    if (text === lastYaml) return;
    lastYaml = text;

    const panel = document.querySelector("[data-grok-output]");
    const badge = document.querySelector("[data-grok-badge]");
    const previewHost = document.querySelector("[data-grok-preview]");
    if (previewHost) previewHost.innerHTML = "";
    if (!panel || !badge) return;

    let parsed;
    try {
      parsed = window.jsyaml.load(text);
    } catch (err) {
      renderStatus(badge, "error", "YAML syntax error");
      panel.innerHTML = renderIssue(
        "err",
        "Cannot parse YAML",
        err.message || String(err)
      );
      return;
    }

    if (parsed === null || parsed === undefined) {
      renderStatus(badge, "warn", "Empty document");
      panel.innerHTML = renderIssue("warn", "Nothing to validate", "Add some YAML above.");
      return;
    }

    const detected = detectKindAndVersion(text, parsed);
    if (!detected) {
      renderStatus(badge, "warn", "Unknown kind");
      panel.innerHTML = renderIssue(
        "warn",
        "Can't tell which spec file this is",
        "We infer the file type from the top-level keys: `spec:` (v2.12 install), `visuals:` (v2.14), `agents:`, `workflow:`, `prompts:`, `safety_profile:`, `grok:` (v2.13 config), `deploy:`, `docs:`, `tools:`, `ui:`, `analytics:`, `test_suites:`, `updates:`."
      );
      return;
    }

    const { kind, version } = detected;

    let schema;
    try {
      schema = await loadSchema(kind, version);
    } catch (err) {
      renderStatus(badge, "error", "Schema unavailable");
      panel.innerHTML = renderIssue(
        "err",
        `Couldn't load ${kind} schema (${version})`,
        err.message || String(err)
      );
      return;
    }

    const ajv = getAjv();
    let validate;
    try {
      validate = ajv.compile(schema);
    } catch (err) {
      renderStatus(badge, "error", "Schema error");
      panel.innerHTML = renderIssue(
        "err",
        "Schema failed to compile",
        err.message || String(err)
      );
      return;
    }

    const ok = validate(parsed);
    if (ok) {
      renderStatus(badge, "ok", `Valid ${kind}.yaml · ${version}`);
      panel.innerHTML =
        `<div class="grok-playground__issue">Detected as <strong>${escapeHtml(
          kind
        )}.yaml</strong> (${escapeHtml(version)}). All checks passed.</div>` +
        renderStats(parsed, kind);
    } else {
      renderStatus(badge, "error", `${validate.errors.length} issue(s)`);
      panel.innerHTML = (validate.errors || [])
        .map((e) =>
          renderIssue(
            "err",
            `${e.instancePath || "/"} — ${e.message}`,
            `params: ${JSON.stringify(e.params)}`
          )
        )
        .join("");
    }

    if (previewHost && kind === "grok-visuals" && parsed && parsed.visuals) {
      previewHost.innerHTML = renderVisualsPreview(parsed.visuals, ok);
    }
  }

  function getAjv() {
    if (ajvInstance) return ajvInstance;
    const AjvCtor = window.ajv2020 || window.Ajv2020 || window.Ajv;
    if (!AjvCtor) throw new Error("Ajv not loaded");
    ajvInstance = new AjvCtor({ allErrors: true, strict: false });
    return ajvInstance;
  }

  async function loadSchema(kind, version) {
    const cacheKey = `${version}/${kind}`;
    if (schemaCache[cacheKey]) return schemaCache[cacheKey];

    const versionCfg = SCHEMA_MAP[version];
    if (!versionCfg) throw new Error(`Unknown schema version: ${version}`);
    const file = versionCfg.files[kind];
    if (!file) throw new Error(`${kind} not defined in ${version}`);

    const url = SCHEMA_ROOT + versionCfg.dir + file;
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const json = await res.json();
    schemaCache[cacheKey] = json;
    return json;
  }

  // Returns {kind, version} or null. Version is one of "v2.12", "latest", "v2.14".
  // Precedence:
  //   1. `visuals:` top-level key → {grok-visuals, v2.14}.
  //   2. `spec: grok-install/...` → {grok-install, v2.12}.
  //   3. `compatibility:` header hint → v2.13 ("latest").
  //   4. Top-level key heuristic on known v2.13 top-levels.
  //   5. Legacy v2.12 agent/workflow/prompts/security detection.
  function detectKindAndVersion(text, parsed) {
    if (!parsed) {
      try {
        parsed = window.jsyaml.load(text);
      } catch {
        return null;
      }
    }
    if (!parsed || typeof parsed !== "object") return null;

    if (parsed.visuals && typeof parsed.visuals === "object") {
      return { kind: "grok-visuals", version: "v2.14" };
    }

    if (typeof parsed.spec === "string" && parsed.spec.startsWith("grok-install/")) {
      return { kind: "grok-install", version: "v2.12" };
    }

    const v213 = detectV213Kind(parsed);
    if (v213) return { kind: v213, version: "latest" };

    // v2.12 fallback heuristics (no compatibility header)
    if (Array.isArray(parsed.agents)) return { kind: "grok-agent", version: "v2.12" };
    if (parsed.workflow && typeof parsed.workflow === "object")
      return { kind: "grok-workflow", version: "v2.12" };
    if (parsed.prompts && typeof parsed.prompts === "object")
      return { kind: "grok-prompts", version: "v2.12" };
    if (typeof parsed.safety_profile === "string")
      return { kind: "grok-security", version: "v2.12" };

    return null;
  }

  function detectV213Kind(parsed) {
    const hasHeader =
      Array.isArray(parsed.compatibility) &&
      typeof parsed.version === "string" &&
      typeof parsed.author === "string";

    // Top-level key → v2.13 kind
    const TOP_LEVEL = {
      grok: "grok-config",
      deploy: "grok-deploy",
      docs: "grok-docs",
      test_suites: "grok-test",
      tools: "grok-tools",
      ui: "grok-ui",
      analytics: "grok-analytics",
      updates: "grok-update",
    };
    for (const key of Object.keys(TOP_LEVEL)) {
      if (parsed[key] && typeof parsed[key] === "object") {
        return TOP_LEVEL[key];
      }
    }

    // With the v2.13 header present, still disambiguate carried files.
    if (hasHeader) {
      if (Array.isArray(parsed.agents)) return "grok-agent";
      if (parsed.workflow && typeof parsed.workflow === "object") return "grok-workflow";
      if (parsed.prompts && typeof parsed.prompts === "object") return "grok-prompts";
      if (typeof parsed.safety_profile === "string") return "grok-security";
    }
    return null;
  }

  function inferInstallRepo(yamlText) {
    try {
      const doc = window.jsyaml.load(yamlText);
      if (doc && typeof doc.repository === "string") {
        const m = doc.repository.match(/github\.com[/:]([^/]+)\/([^/.]+)/i);
        if (m) return `${m[1]}/${m[2]}`;
      }
      if (doc && typeof doc.name === "string") {
        return `your-org/${doc.name}`;
      }
    } catch {
      /* ignore */
    }
    return null;
  }

  function renderStatus(badge, kind, label) {
    const cls =
      kind === "ok"
        ? "grok-playground__badge--ok"
        : kind === "warn"
        ? "grok-playground__badge--warn"
        : "grok-playground__badge--err";
    badge.className = `grok-playground__badge ${cls}`;
    badge.textContent = label;
  }

  function renderIssue(kind, title, body) {
    const cls =
      kind === "err"
        ? "grok-playground__issue grok-playground__issue--err"
        : "grok-playground__issue";
    return `<div class="${cls}"><strong>${escapeHtml(
      title
    )}</strong><br><span style="color:var(--grok-dim); font-size:0.76rem;">${escapeHtml(
      body
    )}</span></div>`;
  }

  function renderStats(parsed, kind) {
    const rows = [];
    if (kind === "grok-install") {
      rows.push(["spec", parsed.spec]);
      rows.push(["entrypoint", parsed.entrypoint || "—"]);
      rows.push(["env vars", (parsed.env || []).length]);
    } else if (kind === "grok-agent") {
      rows.push(["agents", (parsed.agents || []).length]);
      rows.push([
        "tools used",
        [...new Set((parsed.agents || []).flatMap((a) => a.tools || []))].length,
      ]);
    } else if (kind === "grok-workflow") {
      rows.push(["steps", (parsed.workflow.steps || []).length]);
      rows.push([
        "conditional steps",
        (parsed.workflow.steps || []).filter((s) => s.when).length,
      ]);
    } else if (kind === "grok-prompts") {
      rows.push(["prompts", Object.keys(parsed.prompts).length]);
    } else if (kind === "grok-security") {
      rows.push(["profile", parsed.safety_profile]);
      rows.push(["permissions", (parsed.permissions || []).length]);
      rows.push(["approval-gated", (parsed.requires_approval || []).length]);
    } else if (kind === "grok-config") {
      rows.push(["model", (parsed.grok && parsed.grok.default_model) || "—"]);
      rows.push(["shortcuts", Object.keys(parsed.shortcuts || {}).length]);
    } else if (kind === "grok-deploy") {
      rows.push(["targets", Object.keys(parsed.deploy.targets || {}).length]);
    } else if (kind === "grok-docs") {
      rows.push(["doc targets", Object.keys(parsed.docs || {}).length]);
    } else if (kind === "grok-test") {
      rows.push(["suites", Object.keys(parsed.test_suites || {}).length]);
    } else if (kind === "grok-tools") {
      rows.push(["tools", Object.keys(parsed.tools || {}).length]);
    } else if (kind === "grok-ui") {
      const u = parsed.ui || {};
      rows.push(["theme", u.theme || "system"]);
      rows.push(["widgets", ((u.dashboard && u.dashboard.widgets) || []).length]);
    } else if (kind === "grok-analytics") {
      rows.push(["enabled", String(!!(parsed.analytics && parsed.analytics.enabled))]);
      rows.push(["events", ((parsed.analytics && parsed.analytics.events) || []).length]);
    } else if (kind === "grok-update") {
      rows.push(["jobs", Object.keys(parsed.updates || {}).length]);
    } else if (kind === "grok-visuals") {
      const v = parsed.visuals || {};
      rows.push(["type", v.type || "—"]);
      rows.push(["layout", v.layout || "card"]);
      rows.push(["alt", v.alt ? `${v.alt.length} chars` : "—"]);
    }
    if (!rows.length) return "";
    return (
      `<div style="margin-top:0.6rem;font-size:0.76rem;color:var(--grok-dim)">` +
      rows
        .map(
          ([k, v]) =>
            `<div>${escapeHtml(k)}: <strong style="color:var(--grok-text)">${escapeHtml(
              String(v)
            )}</strong></div>`
        )
        .join("") +
      `</div>`
    );
  }

  function renderVisualsPreview(v, isValid) {
    const type = v.type || "image";
    const layout = v.layout || "card";
    const theme = v.theme || "auto";
    const title = v.title ? escapeHtml(v.title) : "";
    const caption = v.caption ? escapeHtml(v.caption) : "";
    const description = v.description ? escapeHtml(v.description) : "";
    const alt = escapeHtml(v.alt || "");
    const src = escapeHtml(v.src || "");
    const poster = v.poster ? escapeHtml(v.poster) : "";

    let media = "";
    if (type === "video") {
      const posterAttr = poster ? ` poster="${poster}"` : "";
      media = `<video class="visuals-preview__media" controls preload="metadata"${posterAttr} aria-label="${alt}"><source src="${src}"></video>`;
    } else if (type === "carousel") {
      media = `<div class="visuals-preview__media visuals-preview__media--placeholder" role="img" aria-label="${alt}"><span>Carousel · ${src}</span></div>`;
    } else {
      media = `<img class="visuals-preview__media" src="${src}" alt="${alt}" loading="lazy" />`;
    }

    let ctaHtml = "";
    if (v.cta && v.cta.label && v.cta.url) {
      ctaHtml = `<a class="visuals-preview__cta" href="${escapeHtml(
        v.cta.url
      )}" rel="noopener">${escapeHtml(v.cta.label)}</a>`;
    }

    const validityBadge = isValid
      ? `<span class="visuals-preview__badge visuals-preview__badge--ok">schema · ok</span>`
      : `<span class="visuals-preview__badge visuals-preview__badge--err">schema · error</span>`;

    return [
      `<figure class="visuals-preview visuals-preview--${escapeHtml(layout)} visuals-preview--${escapeHtml(theme)}" aria-live="polite">`,
      `  <div class="visuals-preview__head">`,
      `    <span class="visuals-preview__kind">v2.14 visuals · ${escapeHtml(type)}</span>`,
      `    ${validityBadge}`,
      `  </div>`,
      `  ${media}`,
      `  <figcaption class="visuals-preview__body">`,
      title ? `    <h3 class="visuals-preview__title">${title}</h3>` : "",
      caption ? `    <p class="visuals-preview__caption">${caption}</p>` : "",
      description ? `    <p class="visuals-preview__desc">${description}</p>` : "",
      `  </figcaption>`,
      ctaHtml ? `  <div class="visuals-preview__footer">${ctaHtml}</div>` : "",
      `</figure>`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));
  }

  function flash(btn, text) {
    const orig = btn.textContent;
    btn.textContent = text;
    setTimeout(() => (btn.textContent = orig), 1400);
  }

  const SAMPLES = {
    "hello-grok": DEFAULT_YAML,
    "reply-bot": [
      "spec: grok-install/v2.12",
      "name: reply-engagement-bot",
      "description: Watches X mentions and drafts thoughtful replies behind an approval gate.",
      "entrypoint: .grok/grok-workflow.yaml",
      "model: grok-4",
      "runtime:",
      "  python: \">=3.11\"",
      "env:",
      "  - XAI_API_KEY",
      "  - X_BEARER_TOKEN",
      "schedule:",
      "  interval: 5m",
      "",
    ].join("\n"),
    "research-swarm": [
      "spec: grok-install/v2.12",
      "name: research-swarm",
      "description: Researcher + critic + publisher multi-agent swarm.",
      "entrypoint: .grok/grok-workflow.yaml",
      "model: grok-4",
      "runtime:",
      "  python: \">=3.11\"",
      "env:",
      "  - XAI_API_KEY",
      "  - TAVILY_API_KEY",
      "",
    ].join("\n"),
    "agent-file": [
      "agents:",
      "  - id: greeter",
      "    model: grok-4",
      "    prompt_ref: greeter_system",
      "    tools:",
      "      - now",
      "    max_turns: 4",
      "",
    ].join("\n"),
    "security-strict": [
      "safety_profile: strict",
      "permissions:",
      "  - tool:post_reply",
      "  - network:api.twitter.com",
      "requires_approval:",
      "  - post_reply",
      "rate_limits:",
      "  tool_calls_per_minute: 15",
      "",
    ].join("\n"),

    // v2.14 visuals samples — preview card renders live on the right.
    "janvisuals": [
      "version: 2.14.0",
      "author: \"@JanSol0s\"",
      "compatibility:",
      "  - grok-install.yaml@2.14+",
      "  - grok@2026.4+",
      "",
      "visuals:",
      "  type: image",
      "  src: https://agentmindcloud.github.io/grok-docs/assets/img/logo.svg",
      "  alt: \"Grok-install logo — a cyan terminal cursor on a black grid.\"",
      "  title: \"Install JanVisuals on X\"",
      "  caption: \"The reference v2.14 visuals example — dark theme, high contrast.\"",
      "  theme: auto",
      "  layout: card",
      "  accessibility:",
      "    reduced_motion: true",
      "    contrast_ratio: 7.2",
      "    captions: false",
      "  cta:",
      "    label: \"Install on X\"",
      "    url: \"https://x.com/intent/post?text=%40grok+install+AgentMindCloud%2Fjanvisuals\"",
      "",
    ].join("\n"),

    "visuals-research-swarm": [
      "version: 2.14.0",
      "author: \"@JanSol0s\"",
      "compatibility:",
      "  - grok-install.yaml@2.14+",
      "  - grok@2026.4+",
      "",
      "visuals:",
      "  type: image",
      "  src: https://agentmindcloud.github.io/grok-docs/assets/img/logo.svg",
      "  alt: \"Three-agent research swarm: researcher, critic, publisher, wired in a feedback loop.\"",
      "  title: \"Research swarm · v2.14\"",
      "  caption: \"Researcher → critic → publisher, with a conditional re-research loop.\"",
      "  layout: banner",
      "  accessibility:",
      "    reduced_motion: true",
      "    contrast_ratio: 5.2",
      "  cta:",
      "    label: \"Open in playground\"",
      "    url: \"../playground/\"",
      "",
    ].join("\n"),

    "visuals-reply-bot": [
      "version: 2.14.0",
      "author: \"@JanSol0s\"",
      "compatibility:",
      "  - grok-install.yaml@2.14+",
      "  - grok@2026.4+",
      "",
      "visuals:",
      "  type: image",
      "  src: https://agentmindcloud.github.io/grok-docs/assets/img/logo.svg",
      "  alt: \"Reply-engagement bot card — an X timeline with a pending approval dialog for an outbound reply.\"",
      "  title: \"Reply engagement bot\"",
      "  caption: \"Approval-gated outbound replies. strict safety profile.\"",
      "  description: \"Watches X mentions on a 5-minute interval and drafts thoughtful replies. Every outbound post pauses for human confirmation.\"",
      "  layout: inline",
      "  theme: dark",
      "  accessibility:",
      "    reduced_motion: true",
      "    contrast_ratio: 4.5",
      "",
    ].join("\n"),
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  if (typeof window !== "undefined" && window.document$) {
    try {
      window.document$.subscribe(() => boot());
    } catch (_) {
      /* ignore */
    }
  }
})();
