export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled,
  className = '',
  style: styleOverride,
  ...rest
}) {
  const base =
    'inline-flex items-center justify-center gap-1.5 rounded-full px-6 py-2.5 text-sm font-semibold font-display transition-opacity disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyle =
    variant === 'primary'
      ? { backgroundColor: 'var(--color-btn-primary-bg)', color: 'var(--color-btn-primary-text)' }
      : {
          backgroundColor: 'var(--color-btn-secondary-bg)',
          color: 'var(--color-btn-secondary-text)',
          border: '1.5px solid var(--color-btn-secondary-border)',
        };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${className} hover:opacity-90`}
      style={{ ...variantStyle, ...styleOverride }}
      {...rest}
    >
      {children}
    </button>
  );
}
