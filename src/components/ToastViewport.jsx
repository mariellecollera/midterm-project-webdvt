function toastStyle(type) {
  switch (type) {
    case "success":
      return {
        backgroundColor: "var(--color-income-bg)",
        color: "var(--color-income-text)",
      };
    case "error":
      return {
        backgroundColor: "var(--color-expense-bg)",
        color: "var(--color-expense-text)",
      };
    default:
      return {
        backgroundColor: "var(--color-btn-primary-bg)",
        color: "var(--color-btn-primary-text)",
      };
  }
}

export default function ToastViewport({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed inset-x-0 top-6 z-50 flex flex-col items-center gap-2 px-4"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="toast-enter flex items-center gap-3 rounded-full px-5 py-3 text-sm font-semibold font-display shadow-lg"
          style={toastStyle(toast.type)}
        >
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
            className="text-xs leading-none opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
