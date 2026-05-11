// annotations.js — read the normalized report.json and emit GitHub workflow
// commands (::error / ::warning / ::notice). The runner converts these into
// Check annotations that appear inline on the Files Changed tab of a PR.
'use strict';

const fs = require('fs');

const reportPath = process.env.REPORT_PATH;
const mode = (process.env.INPUT_MODE || 'strict').toLowerCase();

if (!reportPath || !fs.existsSync(reportPath)) {
  console.log('::warning title=GrokInstall::No report.json found — skipping annotations.');
  process.exit(0);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const findings = Array.isArray(report.findings) ? report.findings : [];

// GitHub workflow-command escaping rules.
const escapeData = (v) => String(v).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
const escapeProp = (v) => escapeData(v).replace(/:/g, '%3A').replace(/,/g, '%2C');

const severityToCommand = (severity) => {
  if (mode === 'warn') return 'warning';
  switch (severity) {
    case 'error':   return 'error';
    case 'warning': return 'warning';
    default:        return 'notice';
  }
};

for (const f of findings) {
  const cmd = severityToCommand(f.severity);
  const props = [];
  const title = `GrokInstall ${f.source}: ${f.rule}`;
  props.push(`title=${escapeProp(title)}`);
  if (f.file)   props.push(`file=${escapeProp(f.file)}`);
  if (f.line)   props.push(`line=${escapeProp(f.line)}`);
  if (f.column) props.push(`col=${escapeProp(f.column)}`);

  const suffix = f.docs ? `  (docs: ${f.docs})` : '';
  const message = escapeData(`${f.message}${suffix}`);

  process.stdout.write(`::${cmd} ${props.join(',')}::${message}\n`);
}

const s = report.counts || {};
const summary = `GrokInstall — errors=${s.error || 0} warnings=${s.warning || 0} info=${s.info || 0} safety=${report.safetyScore ?? 'n/a'}`;
process.stdout.write(`::notice title=GrokInstall Summary::${escapeData(summary)}\n`);

// Job summary (Markdown) — rendered on the Actions run page.
const summaryPath = process.env.GITHUB_STEP_SUMMARY;
if (summaryPath) {
  const passedBadge = report.passed
    ? '![passed](https://img.shields.io/badge/GrokInstall-passed-00FF9D?style=for-the-badge&labelColor=0A0A0A)'
    : '![failed](https://img.shields.io/badge/GrokInstall-failed-FF2D55?style=for-the-badge&labelColor=0A0A0A)';

  const rows = findings.slice(0, 50).map((f) => {
    const loc = [f.file, f.line].filter(Boolean).join(':');
    const docs = f.docs ? `[docs](${f.docs})` : '—';
    return `| \`${loc || '—'}\` | \`${f.rule}\` | ${f.severity} | ${String(f.message).replace(/\|/g, '\\|').slice(0, 200)} | ${docs} |`;
  });

  const md = [
    '## GrokInstall Report',
    '',
    passedBadge,
    '',
    `**Safety score:** ${report.safetyScore}/100`,
    `**Findings:** ${s.error || 0} errors · ${s.warning || 0} warnings · ${s.info || 0} info`,
    '',
    '| Location | Rule | Severity | Message | Docs |',
    '| --- | --- | --- | --- | --- |',
    ...(rows.length ? rows : ['| — | — | — | No findings. Clean run. | — |']),
    '',
    findings.length > 50 ? `_Showing first 50 of ${findings.length} findings._` : '',
    '',
    '<sub>Powered by GrokInstall · <a href="https://grokagents.dev">grokagents.dev</a></sub>'
  ].join('\n');

  fs.appendFileSync(summaryPath, md + '\n');
}
