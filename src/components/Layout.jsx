import { NavLink } from "react-router-dom";

const TABS = [
  { to: "/", label: "Home", end: true },
  { to: "/summary", label: "Summary" },
];

/**
 * Layout wraps every page: LUMON wordmark + pill tab navigation.
 * `variant="panel"` renders the light, full-width mint canvas used by
 * * Home/Summary. `variant="modal"` renders the centered floating-card
 * treatment used by Add Transaction / Transaction Detail.
 */
export default function Layout({
  children,
  variant = "panel",
  extraTab,
  clickOutsideRef,
}) {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg-app)" }}
    >
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        <div className="mb-1 pl-1">
          <span
            className="font-display text-lg tracking-wide"
            style={{ color: "var(--color-text-primary)" }}
          >
            LUMON
          </span>
        </div>

        <nav className="flex" aria-label="Primary">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `px-8 py-3 text-sm font-semibold font-display transition-colors rounded-t-xl -mb-px ${
                  isActive ? "z-10" : ""
                }`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive
                  ? "var(--color-tab-active-bg)"
                  : "var(--color-tab-inactive-bg)",
                color: isActive
                  ? "var(--color-tab-active-text)"
                  : "var(--color-tab-inactive-text)",
              })}
            >
              {tab.label}
            </NavLink>
          ))}
          {extraTab && (
            <span
              className="-mb-px rounded-t-xl px-8 py-3 font-display text-sm font-semibold"
              style={{
                backgroundColor: "var(--color-tab-active-bg)",
                color: "var(--color-tab-active-text)",
              }}
            >
              {extraTab}
            </span>
          )}
        </nav>

        <div
          ref={clickOutsideRef}
          className="p-6"
          style={{
            backgroundColor: "var(--color-tab-active-bg)",
            borderRadius: "0 2rem 0 0",
          }}
        >
          {variant === "panel" ? (
            <div
              className="p-5 sm:p-8"
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
                className="h-fit w-full max-w-2xl rounded-2xl p-6 sm:p-9"
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
      </div>
    </div>
  );
}
