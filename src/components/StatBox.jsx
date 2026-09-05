export default function StatBox({ label, value, valueColor }) {
  return (
    <div className="w-full">
      <div
        className="px-2 py-1 text-center text-xs sm:px-4 sm:py-2 sm:text-sm"
        style={{
          border: "1.5px solid var(--color-border)",
          color: "var(--color-text-primary)",
        }}
      >
        {label}
      </div>
      <div
        className="mt-1 px-2 py-2 text-center text-sm font-bold font-display sm:mt-2 sm:px-4 sm:py-3 sm:text-md"
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
