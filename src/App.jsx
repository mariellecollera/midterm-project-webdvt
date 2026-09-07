import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import AddTransaction from "./pages/AddTransaction";
import TransactionDetail from "./pages/TransactionDetail";
import Summary from "./pages/Summary";
import EditBudget from "./pages/EditBudget";

export default function App() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg-app)" }}
    >
      <div className="mx-auto max-w-5xl px-2 py-6 sm:px-6">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/add" element={<AddTransaction />} />
          <Route path="/transaction/:id" element={<TransactionDetail />} />
          <Route path="/edit-budget" element={<EditBudget />} />
        </Routes>
      </div>
    </div>
  );
}
