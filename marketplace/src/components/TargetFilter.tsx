'use client';

import type { DeployTarget } from '@/lib/catalog';

export default function TargetFilter({
  targets,
  active,
  onChange,
}: {
  targets: readonly DeployTarget[];
  active: DeployTarget | null;
  onChange: (t: DeployTarget | null) => void;
}) {
  const baseClass = 'px-3 py-1 rounded-md text-sm font-mono transition';
  const activeClass = 'bg-primary text-background';
  const inactiveClass = 'bg-white/5 text-white/70 hover:bg-white/10';

  return (
    <div className="flex gap-1 flex-wrap">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`${baseClass} ${active === null ? activeClass : inactiveClass}`}
      >
        all
      </button>
      {targets.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t === active ? null : t)}
          className={`${baseClass} ${active === t ? activeClass : inactiveClass}`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
