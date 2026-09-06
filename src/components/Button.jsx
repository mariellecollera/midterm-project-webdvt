const VARIANT_STYLES = {
  primary: {
    backgroundColor: "var(--color-btn-primary-bg)",
    color: "var(--color-btn-primary-text)",
  },
  secondary: {
    backgroundColor: "var(--color-btn-secondary-bg)",
    color: "var(--color-btn-secondary-text)",
    border: "1.5px solid var(--color-btn-secondary-border)",
  },
  delete: {
    backgroundColor: "var(--color-btn-secondary-bg)",
    color: "var(--color-expense-text)",
    border: "1.5px solid var(--color-expense-text)",
  },
};

export default function Button({
  children,
  variant,
  type = "button",
  onClick,
  disabled,
  className = "",
  style: styleOverride,
  ...rest
}) {
  const variantStyle = VARIANT_STYLES[variant] || {};

  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-full px-6 py-3 text-xs font-semibold font-display transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${className} hover:opacity-80`}
      style={{ ...variantStyle, ...styleOverride }}
      {...rest}
    >
      {children}
    </button>
  );
}
