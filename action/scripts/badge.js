// badge.js — emits /badges/grok-native-certified.svg in brand colors. The SVG
// is fully self-contained (no external fonts) so it renders identically on
// GitHub, npm, shields.io caches, and static sites.
'use strict';

const fs = require('fs');
const path = require('path');
const core = require('@actions/core');

const BRAND = {
  bg:       '#0A0A0A',
  text:     '#FFFFFF',
  cyan:     '#00F0FF',
  green:    '#00FF9D',
  red:      '#FF2D55',
  border:   'rgba(0,240,255,0.40)'
};

function approxWidth(str, px = 11) {
  return Math.ceil(str.length * px * 0.6);
}

function buildSvg({ label, value, accent }) {
  const labelText = label.toUpperCase();
  const valueText = value.toUpperCase();
  const labelW = Math.max(140, approxWidth(labelText, 10) + 28);
  const valueW = Math.max(110, approxWidth(valueText, 10) + 28);
  const totalW = labelW + valueW;
  const h = 36;
  const r = 8;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${h}" viewBox="0 0 ${totalW} ${h}" role="img" aria-label="${labelText}: ${valueText}">
  <title>${labelText}: ${valueText}</title>
  <defs>
    <linearGradient id="border" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0%"  stop-color="${BRAND.cyan}" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="${accent}"   stop-opacity="0.45"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="0.6" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect x="0.5" y="0.5" width="${totalW - 1}" height="${h - 1}" rx="${r}" ry="${r}" fill="${BRAND.bg}" stroke="url(#border)" stroke-width="1"/>
  <rect x="${labelW}" y="1" width="1" height="${h - 2}" fill="rgba(0,240,255,0.15)"/>
  <g font-family="'JetBrains Mono', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace" font-size="12" font-weight="700">
    <text x="${labelW / 2}" y="22" text-anchor="middle" fill="${BRAND.text}" letter-spacing="1.2">${escapeXml(labelText)}</text>
    <text x="${labelW + valueW / 2}" y="22" text-anchor="middle" fill="${accent}" letter-spacing="1.2" filter="url(#glow)">${escapeXml(valueText)}</text>
  </g>
</svg>
`;
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function main() {
  const workingDir = process.env.WORKING_DIRECTORY || '.';
  const reportPath = process.env.REPORT_PATH;
  if (!reportPath || !fs.existsSync(reportPath)) {
    core.warning('No report.json — skipping badge generation.');
    return;
  }
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

  const passed = report.passed === true;
  const score  = Number(report.safetyScore ?? 0);

  let value, accent;
  if (passed && score >= 90)      { value = 'CERTIFIED';     accent = BRAND.green; }
  else if (passed)                { value = `PASS · ${score}`; accent = BRAND.cyan; }
  else                            { value = `FAIL · ${score}`; accent = BRAND.red; }

  const svg = buildSvg({ label: 'Grok-Native', value, accent });

  const outDir = path.join(workingDir, 'badges');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'grok-native-certified.svg');
  fs.writeFileSync(outPath, svg);

  const rel = path.join('badges', 'grok-native-certified.svg');
  core.setOutput('badge-path', rel);
  core.info(`Wrote badge → ${outPath}`);
}

try {
  main();
} catch (err) {
  core.setFailed(`badge.js failed: ${err.message}`);
}
