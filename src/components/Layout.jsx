export default function Layout({
  children,
  variant = "panel",
  clickOutsideRef,
}) {
  return (
    <div
      ref={clickOutsideRef}
      className="px-4 py-6 md:p-8"
      style={{
        backgroundColor: "var(--color-tab-active-bg)",
        borderRadius: "0 2rem 1rem 1rem",
      }}
    >
      {variant === "panel" ? (
        <div
          className="p-4 sm:p-8"
          style={{
            backgroundColor: "var(--color-bg-card)",
            boxShadow: "var(--shadow-card)",
            border: "1px solid var(--color-border-soft)",
          }}
        >
          {children}
        </div>
      ) : (
        <div
          className="flex justify-center px-4 pb-16 pt-10 sm:px-6"
          style={{ minHeight: "calc(100vh - 96px)" }}
        >
          <div
            className="h-fit w-full max-w-lg rounded-2xl p-6 sm:p-9"
            style={{
              backgroundColor: "var(--color-bg-card)",
              boxShadow: "var(--shadow-card)",
              border: "1px solid var(--color-border-soft)",
            }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
