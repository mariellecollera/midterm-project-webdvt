import { NavLink, useLocation } from "react-router-dom";
import lumon_logo from "../assets/lumon_logo.svg";

const TABS = [{ to: "/", label: "Dashboard", end: true }];

function getExtraTab(pathname) {
  if (pathname === "/summary") return "Summary";
  if (pathname === "/add") return "Add Transaction";
  if (pathname.startsWith("/transaction/")) return "View Transaction";
  return null;
}

export default function Header() {
  const { pathname } = useLocation();
  const extraTab = getExtraTab(pathname);

  return (
    <>
      <img src={lumon_logo} className="w-12 h-9 sm:w-16 sm:h-12" alt="LUMON" />
      <nav className="flex" aria-label="Primary">
        {TABS.map((tab) => (
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
    </>
  );
}
