import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

import EmployeeDashboard from "./pages/Employee";
import ProductDashboard from "./pages/Dashboard";
import Sidebar from "./pages/Sidebar";
import Login from "./Auth/Login";
import Dashboard from "./Components/Layout/DashBoardLayout";
import ExpensePage from "./pages/Expense";
import DebugToken from "./pages/TEST.JSX";
import Settings from "./pages/Settings";

function MainLayout() {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6">
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {

   const [data, setData] = useState(null);

  useEffect(() => {
    // Example static data just to test UI
    setData({
      total_income: 65000.0,
      total_expenses: 17000.0,
      pending_to_receive: 8000.0,
      pending_to_pay: 7000.0,
      balance: 48000.0,
      recent_transactions: [
        { title: "Salary", amount: "50000.00", transaction_type: "INCOME", status: "COMPLETED", date: "2025-11-26" }
      ]
    });
  }, []);
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN PAGE */}
        <Route path="/login" element={<Login />} />

        {/* ALL PAGES WITH SIDEBAR */}
        <Route element={<MainLayout />}>
          <Route path="/employeedashboard" element={<EmployeeDashboard />} />
          <Route path="/products" element={<ProductDashboard />} />
          <Route path="/dashboard" element={<Dashboard  data={data}/>} />
          <Route path="/expense" element={<ExpensePage/>} />
          <Route path="/setting" element={<Settings/>} />
        </Route>

        {/* DEFAULT ROUTE */}
        <Route path="*" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
}
