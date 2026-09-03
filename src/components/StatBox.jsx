export default function StatBox({ label, value, valueColor }) {
  return (
    <div>
      <div
        className="px-4 py-2 text-center text-sm"
        style={{
          border: "1.5px solid var(--color-border)",
          color: "var(--color-text-primary)",
        }}
      >
        {label}
      </div>
      <div
        className="mt-2 px-4 py-3 text-center text-md font-bold font-display"
        style={{
          border: "1.5px solid var(--color-border)",
          color: valueColor || "var(--color-text-primary)",
        }}
      >
        {value}
      </div>
    </div>
  );
}
