// grok-docs — landing page terminal animation
// Types out an install command and streams mock output.

(function () {
  "use strict";

  const SCRIPT = [
    { t: "prompt", text: "$ " },
    { t: "type", text: "grok-install install AgentMindCloud/hello-grok" },
    { t: "newline" },
    { t: "wait", ms: 380 },
    { t: "dim", text: "→ Cloning repo..." },
    { t: "wait", ms: 320 },
    { t: "dim", text: "→ Running pre-install safety scan..." },
    { t: "wait", ms: 420 },
    { t: "ok", text: "✓ Verified by Grok  (0 issues, profile: standard)" },
    { t: "wait", ms: 260 },
    { t: "dim", text: "→ Resolving .grok/grok-agent.yaml..." },
    { t: "wait", ms: 220 },
    { t: "dim", text: "→ Loading prompts, tools, permissions..." },
    { t: "wait", ms: 260 },
    { t: "ok", text: "✓ Agent ready — 1 agent, 1 tool" },
    { t: "wait", ms: 300 },
    { t: "newline" },
    { t: "prompt", text: "greeter" },
    { t: "dim", text: " › " },
    { t: "type", text: "Hello, Grok.", speed: 60 },
    { t: "newline" },
    { t: "wait", ms: 280 },
    { t: "text", text: "Hi there — welcome aboard. It's " },
    { t: "ok", text: "14:32 UTC" },
    { t: "text", text: "." },
    { t: "newline" },
  ];

  function mount() {
    const host = document.querySelector("[data-grok-terminal]");
    if (!host) return;
    if (host.dataset.grokMounted === "1") return;
    host.dataset.grokMounted = "1";

    const body = host.querySelector(".grok-terminal__body");
    if (!body) return;

    // Respect reduced-motion: show final state immediately.
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    body.innerHTML = "";
    const caret = document.createElement("span");
    caret.className = "grok-terminal__caret";
    body.appendChild(caret);

    if (prefersReduced) {
      renderFinal(body, caret);
      return;
    }

    runScript(body, caret).catch(() => {
      /* noop: animation is decorative */
    });
  }

  async function runScript(body, caret) {
    for (const step of SCRIPT) {
      await applyStep(body, caret, step);
    }
  }

  function applyStep(body, caret, step) {
    return new Promise((resolve) => {
      switch (step.t) {
        case "prompt":
          insertSpan(body, caret, step.text, "grok-terminal__prompt");
          return resolve();
        case "dim":
          insertSpan(body, caret, step.text, "grok-terminal__dim");
          appendText(body, caret, "\n");
          return resolve();
        case "ok":
          insertSpan(body, caret, step.text, "grok-terminal__ok");
          return resolve();
        case "text":
          insertSpan(body, caret, step.text);
          return resolve();
        case "newline":
          appendText(body, caret, "\n");
          return resolve();
        case "wait":
          return setTimeout(resolve, step.ms || 200);
        case "type":
          return typeOut(body, caret, step.text, step.speed || 28).then(
            resolve
          );
        default:
          return resolve();
      }
    });
  }

  function insertSpan(body, caret, text, className) {
    const span = document.createElement("span");
    if (className) span.className = className;
    span.textContent = text;
    body.insertBefore(span, caret);
  }

  function appendText(body, caret, text) {
    body.insertBefore(document.createTextNode(text), caret);
  }

  async function typeOut(body, caret, text, speed) {
    const span = document.createElement("span");
    body.insertBefore(span, caret);
    for (let i = 0; i < text.length; i++) {
      span.textContent += text[i];
      await delay(speed + Math.random() * 20);
    }
  }

  function delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function renderFinal(body, caret) {
    const lines = [
      { cls: "grok-terminal__prompt", text: "$ " },
      { text: "grok-install install AgentMindCloud/hello-grok\n" },
      { cls: "grok-terminal__dim", text: "→ Cloning repo...\n" },
      { cls: "grok-terminal__dim", text: "→ Running pre-install safety scan...\n" },
      {
        cls: "grok-terminal__ok",
        text: "✓ Verified by Grok  (0 issues, profile: standard)\n",
      },
      { cls: "grok-terminal__dim", text: "→ Resolving .grok/grok-agent.yaml...\n" },
      { cls: "grok-terminal__ok", text: "✓ Agent ready — 1 agent, 1 tool\n\n" },
      { cls: "grok-terminal__prompt", text: "greeter" },
      { cls: "grok-terminal__dim", text: " › " },
      { text: "Hello, Grok.\n" },
      { text: "Hi there — welcome aboard. It's " },
      { cls: "grok-terminal__ok", text: "14:32 UTC" },
      { text: ".\n" },
    ];
    for (const l of lines) insertSpan(body, caret, l.text, l.cls);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
  // MkDocs Material instant navigation: remount on page change.
  if (typeof window !== "undefined" && window.document$) {
    try {
      window.document$.subscribe(() => mount());
    } catch (_) {
      /* ignore if RxJS not available */
    }
  }
})();
