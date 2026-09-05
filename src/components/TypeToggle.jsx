export default function TypeToggle({ choices, value, onChange }) {
  const activeIndex = Math.max(choices.indexOf(value), 0);

  return (
    <div
      className="relative flex overflow-hidden rounded-2xl"
      style={{ border: "1.5px solid var(--color-border)" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 rounded-xl transition-transform duration-300 ease-in-out"
        style={{
          width: `${100 / choices.length}%`,
          backgroundColor: "var(--color-btn-primary-bg)",
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {choices.map((option) => {
        const active = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className="relative z-10 flex-1 py-3 text-sm font-semibold transition-colors duration-300 ease-in-out"
            style={{
              border: "none",
              backgroundColor: "transparent",
              color: active
                ? "var(--color-btn-primary-text)"
                : "var(--color-text-primary)",
              cursor: "pointer",
            }}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
