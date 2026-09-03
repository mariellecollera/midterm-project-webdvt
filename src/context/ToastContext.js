import { createContext, useContext } from "react";

export const ToastContext = createContext(undefined);

export function useToast() {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error("useToast() must be used inside a <ToastProvider>");
  }

  return context;
}
