import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export type DeployTarget = 'cli' | 'action' | 'ide' | 'worker' | 'streamlit' | 'web';

export interface Manifest {
  version: string;
  name: string;
  description: string;
  runtime: { engine: string; model: string };
  deploy: { targets: DeployTarget[] };
  updated_at?: string;
  entrypoint?: string;
  python_version?: string;
  env?: string[];
  schedule?: Record<string, unknown>;
  triggers?: unknown[];
  visuals?: Record<string, unknown>;
  // Schema's additionalProperties: true means manifests can carry arbitrary
  // extra top-level keys; the storefront just renders the JSON it sees.
  [key: string]: unknown;
}

const CATALOG_PATH = resolve(process.cwd(), '.catalog.json');

export function loadCatalog(): Manifest[] {
  const raw = readFileSync(CATALOG_PATH, 'utf-8');
  const data = JSON.parse(raw) as unknown;
  if (!Array.isArray(data)) {
    throw new Error(`.catalog.json did not parse to an array (got ${typeof data})`);
  }
  return data as Manifest[];
}

export function findManifest(slug: string): Manifest | undefined {
  return loadCatalog().find((m) => m.name === slug);
}
