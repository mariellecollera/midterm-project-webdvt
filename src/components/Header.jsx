import { useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useClickOutside } from "../hooks/useClickOutside";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useClickOutside(menuRef, () => setIsMenuOpen(false), isMenuOpen);

  return (
    <>
      <header className="relative">
        <div className="flex items-center gap-3 font-display font-semibold text-xs">
          <img
            src={mdr}
            className="w-12 h-9 sm:w-16 sm:h-12"
            alt="MICRODATA REFINEMENT"
          />
          MICRODATA REFINEMENT
        </div>

        <nav className="hidden sm:flex" aria-label="Primary">
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

        <nav className="flex sm:hidden" aria-label="Primary">
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            className="rounded-t-xl px-6 py-3 transition-colors duration-300 ease-in-out"
            style={{
              backgroundColor: isMenuOpen
                ? "var(--color-tab-active-bg)"
                : "var(--color-tab-inactive-bg)",
              color: isMenuOpen
                ? "var(--color-tab-active-text)"
                : "var(--color-tab-inactive-text)",
              boxShadow: isMenuOpen
                ? "var(--shadow-tab-active)"
                : "var(--shadow-tab-inactive)",
            }}
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          {extraTab && (
            <span
              className="-mb-px rounded-t-xl px-5 py-2 font-display text-xs font-semibold"
              style={{
                backgroundColor: "var(--color-tab-active-bg)",
                color: "var(--color-tab-active-text)",
              }}
            >
              {extraTab}
            </span>
          )}
        </nav>

        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute left-15 top-7 z-50 mt-2 w-auto rounded-2xl p-5 sm:hidden"
            style={{
              backgroundColor: "var(--color-tab-inactive-bg)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close navigation menu"
              className="absolute right-4 top-4 rounded p-1 transition-opacity hover:opacity-70"
            ></button>
            <nav className="flex flex-col gap-4" aria-label="Mobile primary">
              {TABS.map((tab) => (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.end}
                  onClick={() => setIsMenuOpen(false)}
                  className="font-display text-md uppercase transition-colors duration-300 ease-in-out"
                  style={({ isActive }) => ({
                    fontWeight: isActive ? "bold" : "normal",
                    color: isActive
                      ? "var(--color-text-primary)"
                      : "var(--color-tab-active-text)",
                    opacity: isActive ? 1 : 0.85,
                  })}
                >
                  {tab.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
