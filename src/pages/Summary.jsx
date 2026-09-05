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

  const range = useMemo(() => {
    if (filter === "Daily") return { start: currentDate, end: currentDate };
    if (filter === "Weekly")
      return { start: startOfWeek(currentDate), end: endOfWeek(currentDate) };
    return { start: startOfMonth(currentDate), end: endOfMonth(currentDate) };
  }, [filter, currentDate]);

  const periodTransactions = useMemo(
    () =>
      transactions.filter((transaction) =>
        isWithinRange(transaction.date, range.start, range.end),
      ),
    [transactions, range],
  );

  const { totalExpenses, totalIncome, byCategory } = useMemo(() => {
    const totals = {};
    let total = 0;
    let income = 0;
    for (const transaction of periodTransactions) {
      const amt = Number(transaction.amount) || 0;
      if (transaction.type === "Income") {
        income += amt;
        continue;
      }
      if (transaction.type !== "Expense") continue;
      total += amt;
      totals[transaction.category] = (totals[transaction.category] || 0) + amt;
    }
    const rows = Object.entries(totals)
      .map(([category, amount]) => ({
        category,
        amount,
        percent: total > 0 ? Math.round((amount / total) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
    return { totalExpenses: total, totalIncome: income, byCategory: rows };
  }, [periodTransactions]);

  const topCategories = byCategory.slice(0, 3);

  const label = useMemo(() => {
    if (filter === "Daily") return formatDisplayDate(currentDate);
    if (filter === "Weekly")
      return `${formatDisplayDate(range.start)} - ${formatDisplayDate(range.end)}`;
    const date = new Date(`${currentDate}T00:00:00`);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  }, [filter, currentDate, range]);

  function handleFilterChange(nextFilter) {
    setFilter(nextFilter);
    setCurrentDate(todayISO());
  }

  function goPrev() {
    setCurrentDate((date) => shiftDate(date, filter, -1));
  }

  function goNext() {
    setCurrentDate((date) => shiftDate(date, filter, 1));
  }

  return (
    <Layout variant="panel" extraTab="Summary">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div className="flex items-center justify-center gap-2">
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
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full sm:w-64">
            <TypeToggle
              choices={FILTERS}
              value={filter}
              onChange={handleFilterChange}
            />
          </div>

          <ThemeToggle />
        </div>
      </div>
      <div className="mt-6">
        <Widget title="Budget Summary">
          <div className="mt-4 text-center"></div>
        </Widget>
      </div>

      <div className="mt-6">
        <Widget title="Category Breakdown">
          <div className="mt-4 text-center">
            {byCategory.length === 0 ? (
              <p
                className="mt-6 text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                No transactions logged in this period.
              </p>
            ) : (
              <div className="mt-4 flex flex-col gap-4">
                <h3 className="text-left text-sm font-display">
                  Top Categories
                </h3>
                <div className="flex gap-3">
                  {topCategories.map((row) => (
                    <div key={row.category} className="min-w-0 flex-1">
                      <StatBox
                        label={row.category}
                        value={row.percent + "%"}
                        valueColor="var(--color-text-primary)"
                      ></StatBox>
                    </div>
                  ))}
                </div>
                <h3 className="text-left text-sm font-display">
                  Expenses by Category
                </h3>
                {byCategory.map((row) => (
                  <div key={row.category} className=" text-left">
                    <div className="flex items-center justify-between gap-4">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {row.category}
                      </span>
                      <span
                        className="text-sm font-bold"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {formatCurrency(row.amount)}
                      </span>
                    </div>
                    <div
                      className="mt-2 h-5 overflow-hidden "
                      style={{ backgroundColor: "var(--color-badge-bg)" }}
                      role="progressbar"
                      aria-valuenow={row.percent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${row.category} share of expenses`}
                    >
                      <div
                        className="h-full  transition-[width] duration-300"
                        style={{
                          width: `${row.percent}%`,
                          backgroundColor: "var(--color-btn-primary-bg)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Widget>
      </div>
    </Layout>
  );
}
