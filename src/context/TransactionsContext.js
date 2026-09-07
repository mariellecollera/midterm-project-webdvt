import { createContext, useContext } from "react";

export const TransactionsContext = createContext(undefined);

export function useTransactions() {
  const context = useContext(TransactionsContext);

  if (context === undefined) {
    throw new Error(
      "useTransactions() must be used inside a <TransactionsProvider>",
    );
  }

  return context;
}
