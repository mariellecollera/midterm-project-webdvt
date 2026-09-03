import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import TransactionDetail from './pages/TransactionDetail';
import Summary from './pages/Summary';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/add" element={<AddTransaction />} />
      <Route path="/transaction/:id" element={<TransactionDetail />} />
      <Route path="/summary" element={<Summary />} />
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
}
