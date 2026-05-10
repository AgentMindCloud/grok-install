import type { DeployTarget } from '@/lib/catalog';

export default function TargetBadge({ target }: { target: DeployTarget }) {
  return (
    <span className="text-xs font-mono px-2 py-0.5 rounded bg-secondary/20 text-secondary border border-secondary/30">
      {target}
    </span>
  );
}
