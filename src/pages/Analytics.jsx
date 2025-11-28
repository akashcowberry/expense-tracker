import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [filter, setFilter] = useState("month");

  const loadAnalytics = async () => {
    const res = await axios.get(`http://127.0.0.1:8000/api/analytics/?filter=${filter}`);
    setAnalytics(res.data);
  };

  useEffect(() => {
    loadAnalytics();
  }, [filter]);

  if (!analytics) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>

      {/* Filter Buttons */}
      <div className="mb-4 flex gap-3">
        <button
          onClick={() => setFilter("week")}
          className={`px-4 py-2 rounded-lg ${filter === "week" ? "bg-indigo-600 text-white" : "bg-gray-300"}`}
        >
          Last 7 Days
        </button>
        <button
          onClick={() => setFilter("month")}
          className={`px-4 py-2 rounded-lg ${filter === "month" ? "bg-indigo-600 text-white" : "bg-gray-300"}`}
        >
          Last 1 Month
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-bold text-green-600">Total Income</h2>
          <p className="text-2xl font-bold text-blue-950">₹{analytics.total_income}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-bold text-red-600">Total Expense</h2>
          <p className="text-2xl text-blue-950 font-bold ">₹{analytics.total_expense}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-green-400 font-bold">Balance</h2>
          <p className="text-2xl font-bold text-blue-950">₹{analytics.balance}</p>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-black font-bold mb-4">Income vs Expense</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics.graph}>
            <Line type="monotone" dataKey="income" stroke="#4ade80" strokeWidth={2} />
            <Line type="monotone" dataKey="expense" stroke="#f87171" strokeWidth={2} />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
