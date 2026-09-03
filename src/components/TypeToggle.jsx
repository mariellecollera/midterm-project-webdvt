const OPTIONS = ['Income', 'Expense'];

export default function TypeToggle({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {OPTIONS.map((option) => {
        const active = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className="flex-1 rounded-xl py-3 text-sm font-semibold transition-colors"
            style={{
              border: '1.5px solid var(--color-border)',
              backgroundColor: active ? 'var(--color-btn-primary-bg)' : 'transparent',
              color: active ? 'var(--color-btn-primary-text)' : 'var(--color-text-primary)',
            }}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
