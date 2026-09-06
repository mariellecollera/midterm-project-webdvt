import { Link, NavLink } from "react-router-dom";
import lumon_logo from "../assets/lumon_logo.svg";

const TABS = [{ to: "/", label: "Home", end: true }];

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
      <div className="mx-auto max-w-5xl px-2 py-6 sm:px-6">
        <img src={lumon_logo} className="w-12 h-9 sm:w-16 sm:h-12" />
        <nav className="flex" aria-label="Primary">
          {TABS.map((tab) =>
            tab.isLogo ? (
              <Link
                key={tab.label}
                to={tab.to}
                aria-label="Go to home"
                title="Go to home"
                className="flex h-9 w-12 shrink-0 items-center justify-center rounded-t-xl border border-b-0 border-dashed transition-opacity hover:opacity-70 sm:h-12 sm:w-16"
                style={{
                  borderColor: "var(--color-border-soft)",
                  color: "var(--color-text-muted)",
                }}
              />
            ) : (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  `rounded-t-xl px-5 py-2 text-xs font-semibold font-display transition-colors duration-300 ease-in-out sm:px-8 sm:py-3 sm:text-sm ${
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
                  boxShadow: isActive ? "none" : "var(--shadow-tab)",
                })}
              >
                {tab.label}
              </NavLink>
            ),
          )}
          {extraTab && (
            <span
              className="-mb-px rounded-t-xl px-5 py-2 font-display text-xs font-semibold sm:px-8 sm:py-3 sm:text-sm"
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
      </div>
    </div>
  );
}
