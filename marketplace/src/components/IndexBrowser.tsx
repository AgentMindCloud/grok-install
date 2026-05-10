'use client';

import { useMemo, useState } from 'react';
import type { DeployTarget, Manifest } from '@/lib/catalog';
import AgentCard from './AgentCard';
import SearchBar from './SearchBar';
import TargetFilter from './TargetFilter';

const TARGETS: readonly DeployTarget[] = [
  'cli',
  'action',
  'ide',
  'worker',
  'streamlit',
  'web',
] as const;

export default function IndexBrowser({ catalog }: { catalog: Manifest[] }) {
  const [query, setQuery] = useState('');
  const [target, setTarget] = useState<DeployTarget | null>(null);

  const filtered = useMemo(() => {
    return catalog.filter((m) => {
      if (target && !m.deploy.targets.includes(target)) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!m.name.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [catalog, query, target]);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchBar value={query} onChange={setQuery} />
        <TargetFilter targets={TARGETS} active={target} onChange={setTarget} />
      </div>
      {filtered.length === 0 ? (
        <p className="text-white/50">No agents match this filter.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <AgentCard key={m.name} manifest={m} />
          ))}
        </div>
      )}
    </>
  );
}
