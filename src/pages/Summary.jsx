import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from "recharts";
import Layout from "../components/Layout";
import Widget from "../components/Widget";
import ThemeToggle from "../components/ThemeToggle";
import TypeToggle from "../components/TypeToggle";
import StatBox from "../components/StatBox";
import { useTransactions } from "../hooks/useTransactions";
import {
  currencyColor,
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
import { CATEGORY_COLORS } from "../data/categories";

export default function Summary() {
  const { transactions, budget } = useTransactions();
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

  const { totalExpenses, totalIncome, totalTransactions, byCategory } =
    useMemo(() => {
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
        totals[transaction.category] =
          (totals[transaction.category] || 0) + amt;
      }
      const rows = Object.entries(totals)
        .map(([category, amount]) => ({
          category,
          amount,
          color: CATEGORY_COLORS[category] || "var(--color-btn-primary-bg)",
          percent: total > 0 ? Math.round((amount / total) * 100) : 0,
        }))
        .sort((a, b) => b.amount - a.amount);
      return {
        totalExpenses: total,
        totalIncome: income,
        totalTransactions: periodTransactions.length,
        byCategory: rows,
      };
    }, [periodTransactions]);

  const netFlow = totalIncome - totalExpenses;
  const budgetPercent =
    budget > 0 ? Math.min(100, Math.round((totalExpenses / budget) * 100)) : 0;
  const isOverBudget = budget > 0 && totalExpenses > budget;

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
    <Layout variant="panel">
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="w-full sm:w-64">
            <TypeToggle
              choices={FILTERS}
              value={filter}
              onChange={handleFilterChange}
            />
          </div>
          <div className="self-end sm:self-auto">
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Widget title="Budget Summary">
          <div className="mt-6">
            <div
              className="flex items-center justify-between"
              style={{ color: "var(--color-text-primary)" }}
            >
              <span>Budget Used</span>
              <span className="text-sm font-display font-semibold ">
                {formatCurrency(totalExpenses)} / {formatCurrency(budget)}
              </span>
            </div>
            <div
              className="mt-2 h-4 w-full overflow-hidden"
              style={{ backgroundColor: "var(--color-bg-input)" }}
            >
              <div
                className="h-full transition-all duration-300 ease-in-out"
                style={{
                  width: `${budgetPercent}%`,
                  backgroundColor: isOverBudget
                    ? "var(--color-expense-text)"
                    : "var(--color-btn-primary-bg)",
                }}
              />
            </div>
            <p
              className="mt-1 italic text-xs"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {budgetPercent}% of budget used
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatBox
              label="Total Expenses"
              value={formatCurrency(totalExpenses)}
              valueColor="var(--color-display)"
            />
            <StatBox
              label="Total Income"
              value={formatCurrency(totalIncome)}
              valueColor="var(--color-display)"
            />
            <StatBox label="Total Transactions" value={totalTransactions} />
            <StatBox
              label="Net Flow"
              value={formatCurrency(netFlow)}
              valueColor={currencyColor(netFlow)}
            />
          </div>
        </Widget>
      </div>

      <div className="mt-6">
        <Widget title="Spending by Category">
          {byCategory.length === 0 ? (
            <p
              className="mt-6 text-sm text-center"
              style={{ color: "var(--color-text-secondary)" }}
            >
              No transactions logged in this period.
            </p>
          ) : (
            <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
              <div
                className="relative h-64 w-full max-w-[20rem] sm:h-72 sm:flex-1"
                aria-label="Donut chart showing expenses by category"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={byCategory}
                      dataKey="amount"
                      nameKey="category"
                      innerRadius="62%"
                      outerRadius="88%"
                      paddingAngle={1}
                      stroke="var(--color-bg-card)"
                      strokeWidth={2}
                      shape={(props) => (
                        <Sector
                          cx={props.cx}
                          cy={props.cy}
                          innerRadius={props.innerRadius}
                          outerRadius={props.outerRadius}
                          startAngle={props.startAngle}
                          endAngle={props.endAngle}
                          fill={props.payload.color}
                          stroke={props.stroke}
                          strokeWidth={props.strokeWidth}
                        />
                      )}
                    >
                      <Tooltip
                        formatter={(value, name) => [
                          formatCurrency(value),
                          name,
                        ]}
                        wrapperStyle={{ zIndex: 50 }}
                        contentStyle={{
                          backgroundColor: "var(--color-bg-card)",
                          border: "1.5px solid var(--color-border)",
                          borderRadius: "0.5rem",
                          color: "var(--color-text-primary)",
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className="font-display text-3xl font-bold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {byCategory[0].percent}%
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {byCategory[0].category}
                  </span>
                </div>
              </div>

              <div className="w-full space-y-3 sm:flex-1">
                {byCategory.map((row) => (
                  <div
                    key={row.category}
                    className="flex items-center justify-between gap-4 text-left"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{
                          backgroundColor: row.color,
                        }}
                        aria-hidden="true"
                      />
                      <div className="flex gap-1 truncate text-sm">
                        <span
                          className="font-semibold"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {row.category}
                        </span>
                        <span
                          className="italic"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          ({row.percent}%)
                        </span>
                      </div>
                    </div>
                    <span
                      className="shrink-0 text-sm font-bold"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {formatCurrency(row.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Widget>
      </div>
    </Layout>
  );
}
