export function FieldLabel({ children }) {
  return (
    <label
      className="mb-2 block text-sm font-bold font-display"
      style={{ color: 'var(--color-text-primary)' }}
    >
      {children}
    </label>
  );
}

export function TextInput({ id, value, onChange, placeholder, type = 'text', readOnly, error, ...rest }) {
  return (
    <div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        readOnly={readOnly}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none disabled:opacity-60"
        style={{
          border: `1.5px solid ${error ? 'var(--color-expense-text)' : 'var(--color-border)'}`,
          color: 'var(--color-text-primary)',
          backgroundColor: readOnly ? 'var(--color-bg-input)' : 'var(--color-bg-card)',
        }}
        {...rest}
      />
      {error && (
        <p className="mt-1 text-xs font-medium" style={{ color: 'var(--color-expense-text)' }}>
          {error}
        </p>
      )}
    </div>
  );
}

export function SelectInput({ id, value, onChange, options, placeholder, error }) {
  return (
    <div>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl px-4 py-3 text-sm outline-none"
          style={{
            border: `1.5px solid ${error ? 'var(--color-expense-text)' : 'var(--color-border)'}`,
            color: value ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
            backgroundColor: 'var(--color-bg-card)',
          }}
        >
          <option value="" disabled>
            {placeholder || 'Select…'}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs"
          style={{ color: 'var(--color-text-primary)' }}
        >
          ▾
        </span>
      </div>
      {error && (
        <p className="mt-1 text-xs font-medium" style={{ color: 'var(--color-expense-text)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
