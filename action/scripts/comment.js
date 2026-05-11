// comment.js — post (or update) the GrokInstall PR comment. Finds an existing
// comment by a hidden HTML marker so subsequent runs overwrite instead of spam.
'use strict';

const fs = require('fs');
const core = require('@actions/core');
const github = require('@actions/github');

const MARKER = '<!-- grokinstall-action:pr-comment -->';

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    core.warning('No GITHUB_TOKEN available — skipping PR comment.');
    return;
  }

  const reportPath = process.env.REPORT_PATH;
  if (!reportPath || !fs.existsSync(reportPath)) {
    core.warning('No report.json — skipping PR comment.');
    return;
  }
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

  const ctx = github.context;
  if (ctx.eventName !== 'pull_request' || !ctx.payload.pull_request) {
    core.info('Not a pull_request event — skipping comment.');
    return;
  }

  const { owner, repo } = ctx.repo;
  const issue_number = ctx.payload.pull_request.number;
  const octokit = github.getOctokit(token);

  const body = renderBody(report);

  // Paginate; searching only recent pages is usually enough but paginate to be safe.
  const existing = await octokit.paginate(octokit.rest.issues.listComments, {
    owner, repo, issue_number, per_page: 100
  });

  const prior = existing.find((c) => typeof c.body === 'string' && c.body.includes(MARKER));

  if (prior) {
    await octokit.rest.issues.updateComment({ owner, repo, comment_id: prior.id, body });
    core.info(`Updated existing GrokInstall comment #${prior.id}`);
  } else {
    const { data } = await octokit.rest.issues.createComment({ owner, repo, issue_number, body });
    core.info(`Created GrokInstall comment #${data.id}`);
  }
}

function renderBody(report) {
  const passed = report.passed === true;
  const score = report.safetyScore ?? 0;
  const counts = report.counts || {};
  const findings = Array.isArray(report.findings) ? report.findings : [];
  const previewUrl = (process.env.VISUALS_PREVIEW_URL || report.visualsPreviewUrl || '').trim();

  const statusBadge = passed
    ? 'https://img.shields.io/badge/GrokInstall-passed-00FF9D?style=for-the-badge&labelColor=0A0A0A'
    : 'https://img.shields.io/badge/GrokInstall-failed-FF2D55?style=for-the-badge&labelColor=0A0A0A';

  const scoreColor = score >= 90 ? '00FF9D' : score >= 70 ? '00F0FF' : 'FF2D55';
  const scoreBadge = `https://img.shields.io/badge/safety_score-${score}%2F100-${scoreColor}?style=for-the-badge&labelColor=0A0A0A`;

  const rows = findings.slice(0, 50).map((f) => {
    const loc = [f.file, f.line].filter(Boolean).join(':') || '—';
    const msg = String(f.message || '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ').slice(0, 240);
    const docs = f.docs ? `[docs](${f.docs})` : '—';
    return `| \`${loc}\` | \`${f.rule}\` | **${f.severity}** | ${msg} | ${docs} |`;
  });

  const table = rows.length
    ? ['| File | Rule | Severity | Message | Docs |',
       '| --- | --- | --- | --- | --- |',
       ...rows].join('\n')
    : '_No findings. Clean run._';

  const truncated = findings.length > 50
    ? `\n\n_Showing first 50 of ${findings.length} findings. See the Actions run for the full list._`
    : '';

  const previewLine = previewUrl
    ? `\n🎨 **Visuals preview:** [${previewUrl}](${previewUrl})\n`
    : '';

  return [
    MARKER,
    `<h3>GrokInstall Report</h3>`,
    '',
    `<img src="${statusBadge}" alt="status" />&nbsp;<img src="${scoreBadge}" alt="safety score" />`,
    '',
    `**${counts.error || 0}** errors · **${counts.warning || 0}** warnings · **${counts.info || 0}** info`,
    previewLine,
    table + truncated,
    '',
    '<sub>Powered by <b>GrokInstall</b> · <a href="https://grokagents.dev">grokagents.dev</a> · <i>GrokInstall is an independent community project. Not affiliated with xAI, Grok, or X.</i></sub>'
  ].join('\n');
}

main().catch((err) => {
  core.setFailed(`comment.js failed: ${err.message}`);
});
