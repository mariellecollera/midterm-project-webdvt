import { NavLink, useLocation } from "react-router-dom";
import mdr from "../assets/mdr.svg";
import { LayoutDashboard, ChartLine } from "lucide-react";

const TABS = [
  { to: "/", label: "Dashboard", end: true, icon: LayoutDashboard },
  { to: "/summary", label: "Summary", icon: ChartLine },
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
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                aria-label={tab.label}
                className={({ isActive }) =>
                  `flex items-center justify-center gap-2 rounded-t-xl px-4 py-3 text-xs font-semibold font-display transition-colors duration-300 ease-in-out sm:px-8 sm:py-3 sm:text-sm ${
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
                <Icon size={16} aria-hidden="true" />
                <span className="hidden sm:inline">{tab.label}</span>
              </NavLink>
            );
          })}
          {extraTab && (
            <span
              className="-mb-px flex items-center rounded-t-xl px-5 py-2 font-display text-xs font-semibold sm:px-8 sm:py-3 sm:text-sm"
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
