import { useMemo } from "react";
import Layout from "../components/Layout";
import Widget from "../components/Widget";
import ThemeToggle from "../components/ThemeToggle";
import { useTransactions } from "../hooks/useTransactions";
import { formatCurrency } from "../utils/format";
import StatBox from "../components/StatBox";

export default function Summary() {
  const { transactions } = useTransactions();

  const { totalExpenses, byCategory } = useMemo(() => {
    const totals = {};
    let total = 0;
    for (const t of transactions) {
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
  }, [transactions]);

  const topCategories = byCategory.slice(0, 3);

  return (
    <Layout variant="panel">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1
          className="font-display text-xl"
          style={{ color: "var(--color-text-primary)" }}
        >
          Summary of Transactions
        </h1>
        <ThemeToggle />
      </div>

      <div
        className="mt-4 h-6 w-full bg-repeat-y"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, var(--color-border) 0px, var(--color-border) 2px, transparent 2px, transparent 5px)",
        }}
        aria-hidden="true"
      />

      <div className="mt-6">
        <Widget title="Expenses Breakdown">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatBox
              label="Total Expenses"
              value={formatCurrency(totalExpenses)}
              valueColor="var(--color-text-primary)"
            ></StatBox>
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
        </Widget>
      </div>

      <div className="mt-8">
        <h2
          className="font-display text-lg"
          style={{ color: "var(--color-text-primary)" }}
        >
          Expenses per Category
        </h2>

        {byCategory.length === 0 ? (
          <p
            className="mt-6 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            No expenses logged yet — add a transaction to see your breakdown.
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
      </div>
    </Layout>
  );
}
