// Build-time catalog fetcher.
//
// Shells out to `grok-install list-agents --json <agents-dir>` and writes
// the result to .catalog.json (gitignored). Pages then load that JSON at
// build time via `lib/catalog.ts`. The build fails loud if the CLI exits
// non-zero (e.g. a schema-invalid manifest → exit code 2 from list-agents).

import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const marketplaceRoot = resolve(here, '..');
const repoRoot = resolve(marketplaceRoot, '..');
const agentsDir = resolve(repoRoot, 'agents');
const out = resolve(marketplaceRoot, '.catalog.json');

console.log(`[fetch-catalog] grok-install list-agents --json ${agentsDir}`);
let json;
try {
  json = execSync(`grok-install list-agents --json "${agentsDir}"`, {
    encoding: 'utf-8',
    stdio: ['inherit', 'pipe', 'inherit'],
  });
} catch (err) {
  console.error('[fetch-catalog] grok-install list-agents failed.');
  console.error('Ensure the CLI is installed:  pip install -e ".[dev]"  (from repo root)');
  process.exit(1);
}

let count;
try {
  count = JSON.parse(json).length;
} catch (err) {
  console.error('[fetch-catalog] Could not parse list-agents output as JSON.');
  process.exit(1);
}

writeFileSync(out, json);
console.log(`[fetch-catalog] Wrote ${count} agents to ${out}`);
