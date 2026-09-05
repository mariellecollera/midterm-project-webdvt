import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import Widget from "../components/Widget";
import StatBox from "../components/StatBox";
import { formatCurrency } from "../utils/format";
import SearchBar from "../components/SearchBar";
import Dropdown from "../components/Dropdown";
import Button from "../components/Button";
import TransactionCard from "../components/TransactionCard";
import { useTransactions } from "../hooks/useTransactions";
import { CATEGORIES } from "../data/categories";

const TYPE_OPTIONS = [
  { value: "All", label: "All Types" },
  { value: "Income", label: "Income" },
  { value: "Expense", label: "Expense" },
];

const CATEGORY_OPTIONS = [
  { value: "All", label: "All Categories" },
  ...CATEGORIES.map((c) => ({ value: c, label: c })),
];

export default function Dashboard() {
  const { transactions } = useTransactions();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Derived totals recompute only when the underlying transaction list
  // changes, not on every filter/search keystroke.
  const { totalIncome, totalExpenses } = useMemo(() => {
    let income = 0;
    let expenses = 0;
    for (const t of transactions) {
      if (t.type === "Income") income += Number(t.amount) || 0;
      else expenses += Number(t.amount) || 0;
    }
    return { totalIncome: income, totalExpenses: expenses };
  }, [transactions]);

  const balance = totalIncome - totalExpenses;

  // Filtering is recomputed only when its real inputs change (useMemo),
  // and the resulting cards are memoized individually (TransactionCard),
  // so typing in search doesn't force every card to re-render.
  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return transactions.filter((t) => {
      const matchesSearch =
        !query || t.description.toLowerCase().includes(query);
      const matchesType = typeFilter === "All" || t.type === typeFilter;
      const matchesCategory =
        categoryFilter === "All" || t.category === categoryFilter;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, search, typeFilter, categoryFilter]);

  return (
    <Layout variant="panel">
      <Widget title="Current Balance">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="flex flex-wrap items-center text-2xl font-bold gap-3"
            style={{
              fontFamily: "var(--font-display)",
              color:
                balance < 0
                  ? "var(--color-expense-text)"
                  : "var(--color-text-primary)",
            }}
          >
            {formatCurrency(balance)}
          </div>
        </div>
      </Widget>

      <div className="mt-8 flex items-start justify-between">
        <h2
          className="font-display text-lg"
          style={{ color: "var(--color-text-primary)" }}
        >
          Transactions
        </h2>
        <Link to="/add">
          <Button variant="primary">+ Add Transaction</Button>
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <div className="w-full sm:w-auto sm:flex-1">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <Dropdown
          ariaLabel="Filter by type"
          value={typeFilter}
          onChange={setTypeFilter}
          options={TYPE_OPTIONS}
        />
        <Dropdown
          ariaLabel="Filter by category"
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={CATEGORY_OPTIONS}
        />
      </div>

      {filteredTransactions.length === 0 ? (
        <p
          className="mt-10 text-center text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          No transactions match your filters yet.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4">
          {filteredTransactions.map((t) => (
            <TransactionCard key={t.id} transaction={t} />
          ))}
        </div>
      )}
    </Layout>
  );
}
