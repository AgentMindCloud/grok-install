import IndexBrowser from '@/components/IndexBrowser';
import { loadCatalog } from '@/lib/catalog';

export default function HomePage() {
  const catalog = loadCatalog();
  return (
    <>
      <h1 className="text-3xl font-bold mb-2 text-white">Agent catalog</h1>
      <p className="text-white/70 mb-6">
        {catalog.length} agents, all conforming to the v2.14 spec.
      </p>
      <IndexBrowser catalog={catalog} />
    </>
  );
}
