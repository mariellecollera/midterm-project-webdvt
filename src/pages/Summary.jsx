import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Layout from "../components/Layout";
import Widget from "../components/Widget";
import ThemeToggle from "../components/ThemeToggle";
import TypeToggle from "../components/TypeToggle";
import StatBox from "../components/StatBox";
import { useTransactions } from "../hooks/useTransactions";
import {
  formatCurrency,
  formatDisplayDate,
  todayISO,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  shiftDate,
  isWithinRange,
} from "../utils/format";
import { FILTERS } from "../data/filters";

export default function Summary() {
  const { transactions } = useTransactions();
  const [filter, setFilter] = useState("Daily");
  const [currentDate, setCurrentDate] = useState(todayISO());

  // Compute the date range for the selected filter
  const range = useMemo(() => {
    if (filter === "Daily") return { start: currentDate, end: currentDate };
    if (filter === "Weekly")
      return { start: startOfWeek(currentDate), end: endOfWeek(currentDate) };
    return { start: startOfMonth(currentDate), end: endOfMonth(currentDate) };
  }, [filter, currentDate]);

  // Filter transactions to the selected period
  const periodTransactions = useMemo(
    () =>
      transactions.filter((t) => isWithinRange(t.date, range.start, range.end)),
    [transactions, range],
  );

  // Aggregate expenses by category for the period
  const { totalExpenses, byCategory } = useMemo(() => {
    const totals = {};
    let total = 0;
    for (const t of periodTransactions) {
      if (t.type !== "Expense") continue;
      const amt = Number(t.amount) || 0;
      total += amt;
      totals[t.category] = (totals[t.category] || 0) + amt;
    }
    const rows = Object.entries(totals)
      .map(([category, amount]) => ({
        category,
        amount,
        percent: total > 0 ? Math.round((amount / total) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
    return { totalExpenses: total, byCategory: rows };
  }, [periodTransactions]);

  const topCategories = byCategory.slice(0, 3);

  const label = useMemo(() => {
    if (filter === "Daily") return formatDisplayDate(currentDate);
    if (filter === "Weekly")
      return `${formatDisplayDate(range.start)} – ${formatDisplayDate(range.end)}`;
    const d = new Date(currentDate + "T00:00:00");
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  }, [filter, currentDate, range]);

  function handleFilterChange(next) {
    setFilter(next);
    setCurrentDate(todayISO());
  }

  function goPrev() {
    setCurrentDate((d) => shiftDate(d, filter, -1));
  }
  function goNext() {
    setCurrentDate((d) => shiftDate(d, filter, 1));
  }

  return (
    <Layout variant="panel">
      {/* Filter toggle + date navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous period"
            className="rounded-lg p-1.5 transition-opacity hover:opacity-70"
            style={{ color: "var(--color-text-primary)" }}
          >
            <ChevronLeft size={20} />
          </button>
          <span
            className="min-w-[10rem] text-center text-md font-semibold font-display"
            style={{ color: "var(--color-text-primary)" }}
          >
            {label}
          </span>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next period"
            className="rounded-lg p-1.5 transition-opacity hover:opacity-70"
            style={{ color: "var(--color-text-primary)" }}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="w-full sm:w-64">
          <TypeToggle
            choices={FILTERS}
            value={filter}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      <div className="mt-6">
        <Widget title="Expenses per Category">
          <div className="mt-8">
            {byCategory.length === 0 ? (
              <p
                className="mt-6 text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                No expenses in this period — try a different range.
              </p>
            ) : (
              <div className="mt-5 flex flex-col gap-4">
                {byCategory.map((row) => (
                  <div key={row.category} className="flex items-center gap-4">
                    <span
                      className="w-32 shrink-0 text-sm font-medium"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {row.category}
                    </span>
                    <div
                      className="h-9 flex-1 overflow-hidden rounded-md"
                      style={{ backgroundColor: "var(--color-badge-bg)" }}
                      role="progressbar"
                      aria-valuenow={row.percent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${row.category} share of expenses`}
                    >
                      <div
                        className="flex h-full items-center justify-center text-xs font-semibold"
                        style={{
                          width: `${row.percent}%`,
                          backgroundColor: "var(--color-btn-primary-bg)",
                          color: "var(--color-btn-primary-text)",
                          minWidth: "2.5rem",
                        }}
                      >
                        {row.percent}%
                      </div>
                    </div>
                    <span
                      className="w-28 shrink-0 text-right text-sm font-semibold"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {formatCurrency(row.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <StatBox
                label="Total Expenses"
                value={formatCurrency(totalExpenses)}
                valueColor="var(--color-text-primary)"
              />

              {topCategories.map((row) => (
                <div key={row.category}>
                  <StatBox
                    label={row.category}
                    value={`${row.percent}%`}
                    valueColor="var(--color-text-primary)"
                  ></StatBox>
                </div>
              ))}
            </div>
          </div>
        </Widget>
      </div>
    </Layout>
  );
}
