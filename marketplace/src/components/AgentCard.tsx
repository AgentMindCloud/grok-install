import Link from 'next/link';
import type { Manifest } from '@/lib/catalog';
import TargetBadge from './TargetBadge';

export default function AgentCard({ manifest }: { manifest: Manifest }) {
  return (
    <Link
      href={`/agent/${manifest.name}`}
      className="block rounded-lg border border-white/10 hover:border-primary p-4 transition"
    >
      <h3 className="font-mono text-primary text-lg mb-1">{manifest.name}</h3>
      <p className="text-sm text-white/70 mb-3 line-clamp-2">{manifest.description}</p>
      <div className="flex flex-wrap gap-1">
        {manifest.deploy.targets.map((t) => (
          <TargetBadge key={t} target={t} />
        ))}
      </div>
    </Link>
  );
}
