import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'lumon-transactions';

const SEED_DATA = [
  { id: crypto.randomUUID(), description: 'Grocery Run', date: '2026-08-26', type: 'Expense', category: 'Food', amount: 670.75 },
  { id: crypto.randomUUID(), description: 'eGov Prize', date: '2026-08-26', type: 'Income', category: 'Miscellaneous', amount: 20000 },
  { id: crypto.randomUUID(), description: 'Electric Bill', date: '2026-08-20', type: 'Expense', category: 'Utilities', amount: 800 },
  { id: crypto.randomUUID(), description: 'Streaming Bundle', date: '2026-08-18', type: 'Expense', category: 'Subscriptions', amount: 502.25 },
];

function readFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_DATA;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_DATA;
  } catch {
    return SEED_DATA;
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
      prev.map((t) => (t.id === id ? { ...t, ...data, id } : t))
    );
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getTransaction = useCallback(
    (id) => transactions.find((t) => t.id === id),
    [transactions]
  );

  return { transactions, addTransaction, updateTransaction, deleteTransaction, getTransaction };
}
