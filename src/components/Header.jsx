import { NavLink, useLocation } from "react-router-dom";
import mdr from "../assets/mdr.svg";

const TABS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/summary", label: "Summary" },
];

function getExtraTab(pathname) {
  if (pathname === "/edit-budget") return "Edit Budget";
  if (pathname === "/add") return "Add Transaction";
  if (pathname.startsWith("/transaction/")) return "View Transaction";
  return null;
}

export default function Header() {
  const { pathname } = useLocation();
  const extraTab = getExtraTab(pathname);

  return (
    <>
      <header>
        <div className="flex items-center gap-3 font-display font-semibold text-xs">
          <img
            src={mdr}
            className="w-12 h-9 sm:w-16 sm:h-12"
            alt="MICRODATA REFINEMENT"
          />
          MICRODATA REFINEMENT
        </div>

        <nav className="flex" aria-label="Primary">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `rounded-t-xl px-6 py-3 text-xs font-semibold font-display transition-colors duration-300 ease-in-out sm:px-8 sm:py-3 sm:text-sm ${
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
                boxShadow: isActive
                  ? "var(--shadow-tab-active)"
                  : "var(--shadow-tab-inactive)",
              })}
            >
              {tab.label}
            </NavLink>
          ))}
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
      </header>
    </>
  );
}
