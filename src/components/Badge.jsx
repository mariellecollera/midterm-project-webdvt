export default function Badge({ children }) {
  return (
    <span
      className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
      style={{ backgroundColor: 'var(--color-badge-bg)', color: 'var(--color-badge-text)' }}
    >
      {children}
    </span>
  );
}
