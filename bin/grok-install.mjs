#!/usr/bin/env node
// grok-install CLI. Keep the surface area small: one subcommand today,
// room to grow. Delegates the real work to scripts/*.
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");

const [, , sub, ...rest] = process.argv;

const USAGE = `grok-install — CLI for the grok-install open standard.

Usage:
  grok-install validate [paths...]   Validate YAML against the v2.12 schema
  grok-install version               Print the CLI version
  grok-install help                  Show this help

Examples:
  grok-install validate                           # validates the repo defaults
  grok-install validate ./grok-install.yaml       # validate a single file
  grok-install validate ./standard/examples       # validate every YAML in a dir
`;

async function main() {
  switch (sub) {
    case undefined:
    case "help":
    case "--help":
    case "-h":
      process.stdout.write(USAGE);
      return 0;

    case "version":
    case "--version":
    case "-v": {
      const { readFileSync } = await import("node:fs");
      const pkg = JSON.parse(
        readFileSync(resolve(repoRoot, "package.json"), "utf8"),
      );
      console.log(pkg.version);
      return 0;
    }

    case "validate": {
      // Delegate to the existing validator; forward argv so relative paths
      // resolve against the user's CWD (scripts/validate.mjs already does this).
      process.argv = [process.argv[0], "scripts/validate.mjs", ...rest];
      await import(resolve(repoRoot, "scripts/validate.mjs"));
      return 0;
    }

    default:
      process.stderr.write(`Unknown command: ${sub}\n\n${USAGE}`);
      return 2;
  }
}

main().then(
  (code) => process.exit(code ?? 0),
  (err) => {
    process.stderr.write(`${err.stack ?? err.message ?? err}\n`);
    process.exit(1);
  },
);
