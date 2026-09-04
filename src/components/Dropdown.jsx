export default function Dropdown({ value, onChange, options, ariaLabel }) {
  return (
    <div className="relative">
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-full py-2.5 pl-4 pr-9 text-sm font-medium outline-none"
        style={{
          border: "1.5px solid var(--color-border)",
          color: "var(--color-text-primary)",
          backgroundColor: "var(--color-bg-card)",
          cursor: "pointer",
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs"
        style={{ color: "var(--color-text-primary)" }}
      >
        ▾
      </span>
    </div>
  );
}
