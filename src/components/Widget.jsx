export default function Widget({ title, children }) {
  return (
    <div
      className="rounded-2xl px-5 py-5 sm:px-8 sm:py-7"
      style={{
        border: "1.5px solid var(--color-border)",
        backgroundColor: "var(--color-transaction-card-bg)",
      }}
    >
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ border: "1.5px solid var(--color-border)" }}
      >
        <span
          className="font-display text-md"
          style={{ color: "var(--color-text-primary)" }}
        >
          {title}
        </span>
        <span
          className="font-display text-sm font-bold tracking-widest"
          style={{ color: "var(--color-text-primary)" }}
        >
          LUMON
        </span>
      </div>

      <div className="mt-6">{children}</div>
    </div>
  );
}
