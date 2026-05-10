'use client';

export default function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="search"
      placeholder="Search by name or slug…"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 px-4 py-2 rounded-md bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-primary"
    />
  );
}
