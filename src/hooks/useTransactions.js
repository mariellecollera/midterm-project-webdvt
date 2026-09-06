import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "lumon-transactions";

function readFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeToStorage(transactions) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch {
    // storage can fail (quota, private mode) -- fail silently, in-memory
    // state still keeps the app usable for the current session.
  }
}

/**
 * useTransactions
 * ----------------
 * A single reusable hook that owns all persistent read/write access to
 * transaction data (backed by localStorage here, but any component that
 * needs transactions calls this hook instead of touching storage directly).
 *
 * Returns:
 *  - transactions: the current list
 *  - addTransaction(data)
 *  - updateTransaction(id, data)
 *  - deleteTransaction(id)
 *  - getTransaction(id)
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState(readFromStorage);

  // Keep localStorage in sync whenever the list changes.
  useEffect(() => {
    writeToStorage(transactions);
  }, [transactions]);

  const addTransaction = useCallback((data) => {
    const newTransaction = { id: crypto.randomUUID(), ...data };
    setTransactions((prev) => [newTransaction, ...prev]);
    return newTransaction;
  }, []);

  const updateTransaction = useCallback((id, data) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data, id } : t)),
    );
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getTransaction = useCallback(
    (id) => transactions.find((t) => t.id === id),
    [transactions],
  );

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransaction,
  };
}
