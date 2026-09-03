import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddTransaction from "./pages/AddTransaction";
import TransactionDetail from "./pages/TransactionDetail";
import Summary from "./pages/Summary";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add" element={<AddTransaction />} />
      <Route path="/transaction/:id" element={<TransactionDetail />} />
      <Route path="/summary" element={<Summary />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
