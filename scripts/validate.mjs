#!/usr/bin/env node
// Validate one or more grok-install.yaml files (or directories of them)
// against standard/grok-install.schema.json. Exits non-zero on any failure.
//
// Usage:
//   node scripts/validate.mjs                      # validates repo defaults
//   node scripts/validate.mjs path/to/file.yaml    # validates a specific file
//   node scripts/validate.mjs dir/                 # validates every *.yaml in dir
import { readFileSync, statSync, readdirSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import yaml from "js-yaml";

const here = fileURLToPath(new URL(".", import.meta.url));
const repoRoot = resolve(here, "..");
const schemaPath = join(repoRoot, "standard", "grok-install.schema.json");
const schema = JSON.parse(readFileSync(schemaPath, "utf8"));

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

const defaultTargets = ["grok-install.yaml", "standard/examples"];
const args = process.argv.slice(2);
const targets = (args.length ? args : defaultTargets).map((p) =>
  resolve(repoRoot, p),
);

function expand(target) {
  const st = statSync(target);
  if (st.isDirectory()) {
    return readdirSync(target)
      .filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"))
      .map((f) => join(target, f));
  }
  return [target];
}

const files = targets.flatMap(expand);
if (!files.length) {
  console.error("No YAML files found to validate.");
  process.exit(1);
}

let failed = 0;
for (const file of files) {
  const rel = relative(repoRoot, file);
  let doc;
  try {
    doc = yaml.load(readFileSync(file, "utf8"));
  } catch (e) {
    console.error(`FAIL ${rel}: YAML parse error: ${e.message}`);
    failed++;
    continue;
  }
  const ok = validate(doc);
  if (ok) {
    console.log(`PASS ${rel}`);
  } else {
    failed++;
    console.error(`FAIL ${rel}:`);
    for (const err of validate.errors ?? []) {
      const where = err.instancePath || "(root)";
      console.error(`  ${where} ${err.message}`);
    }
  }
}

console.log(`\n${files.length - failed}/${files.length} files valid`);
process.exit(failed ? 1 : 0);
