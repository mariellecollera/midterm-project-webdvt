import { Search } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative flex-1">
      <Search
        size={16}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
        style={{ color: 'var(--color-text-secondary)' }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search transactions"
        className="w-full rounded-full py-2.5 pl-10 pr-4 text-sm outline-none"
        style={{
          border: '1.5px solid var(--color-border)',
          color: 'var(--color-text-primary)',
          backgroundColor: 'var(--color-bg-card)',
        }}
      />
    </div>
  );
}
