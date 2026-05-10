import { notFound } from 'next/navigation';
import TargetBadge from '@/components/TargetBadge';
import { findManifest, loadCatalog } from '@/lib/catalog';

export function generateStaticParams() {
  return loadCatalog().map((m) => ({ slug: m.name }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AgentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const manifest = findManifest(slug);
  if (!manifest) notFound();

  return (
    <article>
      <h1 className="font-mono text-primary text-3xl mb-1">{manifest.name}</h1>
      <p className="text-white/80 mb-4">{manifest.description}</p>
      <div className="flex gap-1 flex-wrap mb-6">
        {manifest.deploy.targets.map((t) => (
          <TargetBadge key={t} target={t} />
        ))}
      </div>

      <section className="mb-6">
        <h2 className="text-secondary font-mono text-sm mb-2">Install</h2>
        <pre className="bg-white/5 border border-white/10 rounded-md p-4 font-mono text-sm text-white overflow-x-auto">
          <code>{`grok-install install ${manifest.name}`}</code>
        </pre>
      </section>

      <section>
        <h2 className="text-secondary font-mono text-sm mb-2">Manifest</h2>
        <pre className="bg-white/5 border border-white/10 rounded-md p-4 font-mono text-xs text-white/80 overflow-x-auto">
          <code>{JSON.stringify(manifest, null, 2)}</code>
        </pre>
      </section>
    </article>
  );
}
