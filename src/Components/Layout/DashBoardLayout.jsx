import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL) // API FROM .env
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch dashboard data");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center text-2xl font-semibold text-gray-600 animate-pulse">
        Loading Dashboard...
      </div>
    );

  if (error || !data)
    return (
      <div className="p-10 text-center text-red-600 font-bold text-xl">
        {error}
      </div>
    );

  // SAFE DESTRUCTURE with fallback values
  const {
    total_income = 0,
    total_expenses = 0,
    pending_to_receive = 0,
    pending_to_pay = 0,
    balance = 0,
    recent_transactions = [],
  } = data || {};

  const cardStyle =
    "p-5 shadow-xl rounded-xl backdrop-blur-xl bg-white/30 border border-white/40 text-gray-900 flex flex-col items-start";

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 mt-20 lg:mt-0">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900">
        Dashboard Overview
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className={cardStyle}>
          <p className="text-gray-600">Total Income</p>
          <p className="text-3xl font-bold text-green-600">₹{total_income}</p>
        </div>

        <div className={cardStyle}>
          <p className="text-gray-600">Total Expenses</p>
          <p className="text-3xl font-bold text-red-600">₹{total_expenses}</p>
        </div>

        <div className={cardStyle}>
          <p className="text-gray-600">Pending to Receive</p>
          <p className="text-3xl font-bold text-blue-600">
            ₹{pending_to_receive}
          </p>
        </div>

        <div className={cardStyle}>
          <p className="text-gray-600">Pending to Pay</p>
          <p className="text-3xl font-bold text-yellow-600">
            ₹{pending_to_pay}
          </p>
        </div>
      </div>

      {/* Net Balance */}
      <div className="mb-10">
        <div className="p-6 bg-indigo-700 text-white rounded-xl shadow-xl">
          <p className="text-lg opacity-80">Net Balance</p>
          <p className="text-5xl font-extrabold">₹{balance}</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="backdrop-blur-xl bg-white/50 p-6 rounded-xl shadow-xl border border-white/50">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          Recent Transactions
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-300/70 text-gray-900">
                <th className="p-3 font-semibold">Title</th>
                <th className="p-3 font-semibold">Amount</th>
                <th className="p-3 font-semibold">Type</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Date</th>
              </tr>
            </thead>

            <tbody>
              {recent_transactions.length > 0 ? (
                recent_transactions.map((txn, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-200/50 transition"
                  >
                    <td className="p-3 text-gray-900">{txn.title}</td>
                    <td className="p-3 font-semibold">
                      {txn.transaction_type === "INCOME" ? (
                        <span className="text-green-600">+ ₹{txn.amount}</span>
                      ) : (
                        <span className="text-red-600">- ₹{txn.amount}</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          txn.transaction_type === "INCOME"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {txn.transaction_type}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          txn.status === "COMPLETED"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-900">{txn.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-4 text-gray-600 font-medium"
                  >
                    No transactions available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
