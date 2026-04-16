// Schema conformance tests. Mirrors scripts/validate.mjs but exposes per-file
// assertions so IDE test runners can pinpoint which example drifted.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import yaml from "js-yaml";

const repoRoot = new URL("..", import.meta.url).pathname;

const schema = JSON.parse(
  readFileSync(join(repoRoot, "standard", "grok-install.schema.json"), "utf8"),
);
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

function validateFile(relPath) {
  const doc = yaml.load(readFileSync(join(repoRoot, relPath), "utf8"));
  const ok = validate(doc);
  if (!ok) {
    const lines = (validate.errors ?? []).map(
      (e) => `  ${e.instancePath || "(root)"} ${e.message}`,
    );
    throw new Error(`${relPath} failed validation:\n${lines.join("\n")}`);
  }
}

describe("schema conformance", () => {
  it("schema.json parses as valid JSON Schema draft-07", () => {
    expect(() => ajv.compile(schema)).not.toThrow();
  });

  it("root grok-install.yaml validates", () => {
    expect(() => validateFile("grok-install.yaml")).not.toThrow();
  });

  const exampleDir = join(repoRoot, "standard", "examples");
  const examples = readdirSync(exampleDir).filter((f) => /\.ya?ml$/.test(f));

  it("at least one example exists", () => {
    expect(examples.length).toBeGreaterThan(0);
  });

  for (const file of examples) {
    it(`example validates: ${file}`, () => {
      expect(() => validateFile(`standard/examples/${file}`)).not.toThrow();
    });
  }
});

describe("schema negative cases", () => {
  it("rejects missing required fields", () => {
    expect(validate({})).toBe(false);
  });

  it("rejects unknown version", () => {
    expect(validate({ version: "9.99", name: "x", description: "x" })).toBe(
      false,
    );
  });

  it("accepts additional top-level keys (forward-compat)", () => {
    expect(
      validate({
        version: "2.12",
        name: "x",
        description: "x",
        future_block: { anything: true },
      }),
    ).toBe(true);
  });
});
