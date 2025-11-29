import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../api/axiosInstance";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const transactionsContainerRef = useRef(null);

const fetchDashboardData = async () => {
  try {
    setLoading(true);
    setError("");
    
    // Check if token exists before making request
    const token = localStorage.getItem('access');
    if (!token) {
      setError("Please login to continue.");
      setTimeout(() => window.location.href = "/login", 1000);
      return;
    }
    
    const response = await axiosInstance.get("dashboard/");
    setData(response.data);
    
  } catch (err) {
    console.error("Dashboard error:", err);
    
    if (err.response?.status === 401) {
      setError("Session expired. Please login again.");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      setTimeout(() => window.location.href = "/login", 2000);
    } else if (err.code === 'ECONNABORTED') {
      setError("Request timeout. Please try again.");
    } else {
      setError(err.response?.data?.error || "Failed to load dashboard data.");
    }
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (!transactionsContainerRef.current || !data?.recent_transactions?.length) return;

    const container = transactionsContainerRef.current;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    
    if (scrollHeight > clientHeight) {
      container.scrollTop = scrollHeight - clientHeight;
    }
  }, [data?.recent_transactions]);

  // Format amount display
  const formatAmount = (amount) => {
    return `₹${parseFloat(amount || 0).toLocaleString()}`;
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 border-t-2 border-purple-600 animate-spin rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-600 font-bold text-xl mb-4">{error}</div>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <p className="text-xl mb-4">No data available</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Reload Data
          </button>
        </div>
      </div>
    );
  }

  const {
    total_income = 0,
    total_expenses = 0,
    pending_to_receive = 0,
    pending_to_pay = 0,
    balance = 0,
    recent_transactions = [],
  } = data;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Financial Dashboard</h1>
              <p className="text-gray-600 mt-2">Overview of your financial transactions</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Received</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {formatAmount(total_income)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">↑</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Spent</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {formatAmount(total_expenses)}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">↓</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending to Receive</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {formatAmount(pending_to_receive)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending to Send</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {formatAmount(pending_to_pay)}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold">⚠️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-2xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-lg">Current Balance</p>
              <p className="text-4xl font-bold mt-2">
                {formatAmount(balance)}
              </p>
              <p className="text-purple-200 mt-2">
                {balance >= 0 ? 'Positive balance' : 'Negative balance'}
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
            <span className="text-gray-500 text-sm">
              {recent_transactions.length} transactions
            </span>
          </div>

          {recent_transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No transactions found</p>
              <p className="text-sm mt-1">Start by adding your first transaction</p>
            </div>
          ) : (
            <div 
              ref={transactionsContainerRef}
              className="space-y-4 max-h-96 overflow-y-auto"
            >
              {recent_transactions.map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.transaction_type === 'INCOME' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.transaction_type === 'INCOME' ? '↑' : '↓'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{transaction.title}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-semibold text-lg ${
                      transaction.transaction_type === 'INCOME' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.transaction_type === 'INCOME' ? '+' : '-'}
                      {formatAmount(transaction.amount)}
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'COMPLETED' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}