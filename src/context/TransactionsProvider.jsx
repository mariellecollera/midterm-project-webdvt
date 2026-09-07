import { TransactionsContext } from "./TransactionsContext";
import { useTransactions as useTransactionsData } from "../hooks/useTransactions";

export function TransactionsProvider({ children }) {
  const value = useTransactionsData();

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}
