import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label="Toggle light and dark theme"
      className="flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-1.5 text-sm font-semibold"
      style={{
        border: "1.5px solid var(--color-border)",
        color: "var(--color-text-primary)",
      }}
    >
      <span
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
        style={{ backgroundColor: "var(--color-btn-primary-bg)" }}
      >
        <Sun
          size={12}
          aria-hidden="true"
          className="pointer-events-none absolute left-1.5 text-white"
        />
        <Moon
          size={12}
          aria-hidden="true"
          className="pointer-events-none absolute right-1.5 text-white"
        />
        <span
          className="relative z-10 inline-block h-4.5 w-4.5 transform rounded-full bg-white transition-transform"
          style={{
            transform: isDark ? "translateX(22px)" : "translateX(4px)",
            width: "18px",
            height: "18px",
          }}
        />
      </span>
    </button>
  );
}
