#!/usr/bin/env node
// Build a static docs page from standard/spec.md.
// Deliberately tiny (no markdown lib): we only support the subset we write —
// headings, paragraphs, fenced code blocks, and inline backticks / links /
// bold / italic. Keeps the install surface minimal and the output auditable.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const srcPath = resolve(repoRoot, "standard/spec.md");
const outPath = resolve(repoRoot, "docs.html");

const md = readFileSync(srcPath, "utf8");

const escapeHtml = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

function renderInline(text) {
  // Order matters: escape everything first, then layer back the markup we want.
  let out = escapeHtml(text);
  // Links: [label](url) — we only allow http(s) and anchors.
  out = out.replace(/\[([^\]]+)\]\((https?:[^)\s]+|#[^)\s]+)\)/g, (_, l, u) => {
    const safeUrl = u.replace(/"/g, "&quot;");
    return `<a href="${safeUrl}">${l}</a>`;
  });
  // Inline code
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  // Bold then italic
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  return out;
}

const lines = md.split(/\r?\n/);
const headings = [];
const body = [];
let inCode = false;
let codeBuf = [];
let paraBuf = [];
let listBuf = [];

function flushPara() {
  if (!paraBuf.length) return;
  body.push(`<p>${renderInline(paraBuf.join(" "))}</p>`);
  paraBuf = [];
}
function flushList() {
  if (!listBuf.length) return;
  const items = listBuf.map((l) => `  <li>${renderInline(l)}</li>`).join("\n");
  body.push(`<ul>\n${items}\n</ul>`);
  listBuf = [];
}

for (const line of lines) {
  if (line.startsWith("```")) {
    flushPara();
    flushList();
    if (inCode) {
      body.push(`<pre><code>${escapeHtml(codeBuf.join("\n"))}\n</code></pre>`);
      codeBuf = [];
      inCode = false;
    } else {
      inCode = true;
    }
    continue;
  }
  if (inCode) {
    codeBuf.push(line);
    continue;
  }

  const h = /^(#{1,6})\s+(.*)$/.exec(line);
  if (h) {
    flushPara();
    flushList();
    const level = h[1].length;
    const text = h[2].trim();
    const slug = slugify(text);
    if (level >= 2 && level <= 3) headings.push({ level, text, slug });
    body.push(
      `<h${level} id="${slug}"><a class="anchor" href="#${slug}" aria-hidden="true">#</a> ${renderInline(text)}</h${level}>`,
    );
    continue;
  }

  if (/^\s*-\s+/.test(line)) {
    flushPara();
    listBuf.push(line.replace(/^\s*-\s+/, ""));
    continue;
  }

  if (!line.trim()) {
    flushPara();
    flushList();
    continue;
  }

  paraBuf.push(line.trim());
}
flushPara();
flushList();
if (inCode) {
  // Tolerate an unclosed fence rather than crashing.
  body.push(`<pre><code>${escapeHtml(codeBuf.join("\n"))}\n</code></pre>`);
}

const toc = headings
  .map(
    (h) =>
      `    <li class="toc-l${h.level}"><a href="#${h.slug}">${escapeHtml(h.text)}</a></li>`,
  )
  .join("\n");

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src data:; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'"
    />
    <title>grok-install Spec • v2.12</title>
    <link rel="stylesheet" href="style.css" />
    <style>
      :root { color-scheme: dark; }
      body {
        margin: 0;
        font-family: "Inter", system-ui, sans-serif;
        background: #0a0a0a;
        color: #e5e5e5;
        line-height: 1.6;
      }
      a { color: #00f0ff; }
      a:focus-visible { outline: 2px solid #00f0ff; outline-offset: 2px; border-radius: 4px; }
      .skip-link {
        position: absolute; left: -9999px; top: auto; width: 1px; height: 1px; overflow: hidden;
      }
      .skip-link:focus {
        position: fixed; top: 1rem; left: 1rem; width: auto; height: auto;
        padding: 0.5rem 1rem; background: #00f0ff; color: #000; border-radius: 0.5rem; z-index: 99;
      }
      .wrap { max-width: 72rem; margin: 0 auto; padding: 2rem; display: grid; gap: 2rem; grid-template-columns: 16rem 1fr; }
      @media (max-width: 800px) { .wrap { grid-template-columns: 1fr; } nav.toc { position: static; } }
      nav.toc {
        position: sticky; top: 1rem; align-self: start;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(0,240,255,0.2);
        border-radius: 1rem; padding: 1.25rem; font-size: 0.9rem; max-height: calc(100vh - 2rem); overflow: auto;
      }
      nav.toc ol { list-style: none; margin: 0; padding: 0; }
      nav.toc .toc-l3 { padding-left: 1rem; }
      nav.toc li { margin: 0.25rem 0; }
      main h1 { font-size: 2.25rem; margin-top: 0; }
      main h2 { margin-top: 2.5rem; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1.5rem; }
      main h3 { margin-top: 1.75rem; }
      code { background: rgba(0,240,255,0.08); padding: 0.1em 0.35em; border-radius: 4px; font-size: 0.92em; }
      pre { background: #0f0f0f; border: 1px solid rgba(0,240,255,0.15); padding: 1rem; border-radius: 0.75rem; overflow: auto; }
      pre code { background: transparent; padding: 0; border-radius: 0; }
      .anchor { color: #2a2a2a; margin-right: 0.4rem; text-decoration: none; }
      h2:hover .anchor, h3:hover .anchor { color: #00f0ff; }
      header.top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
      .chip { display: inline-block; font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 999px;
              background: rgba(0,240,255,0.1); color: #00f0ff; border: 1px solid rgba(0,240,255,0.3); }
      @media (prefers-reduced-motion: reduce) {
        * { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
      }
    </style>
  </head>
  <body>
    <a href="#content" class="skip-link">Skip to content</a>
    <div class="wrap">
      <nav class="toc" aria-label="Table of contents">
        <header class="top">
          <strong>Contents</strong>
          <span class="chip">v2.12</span>
        </header>
        <ol>
${toc}
        </ol>
        <p style="margin-top: 1rem; font-size: 0.8rem;"><a href="index.html">← Marketplace</a></p>
      </nav>
      <main id="content">
        ${body.join("\n        ")}
      </main>
    </div>
  </body>
</html>
`;

writeFileSync(outPath, html);
console.log(`Wrote ${outPath} (${headings.length} TOC entries)`);
