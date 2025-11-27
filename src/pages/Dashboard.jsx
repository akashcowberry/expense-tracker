import React, { useState, useEffect, useRef } from "react";

const API_BASE = "http://127.0.0.1:8000/api/";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const transactionsContainerRef = useRef(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");
      
      try {
        console.log('Fetching dashboard data...');
        const response = await fetch(API_BASE + "dashboard/");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const dashboardData = await response.json();
        console.log('Dashboard data received:', dashboardData);
        setData(dashboardData);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError("Failed to fetch dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Auto-scroll effect for transactions
  useEffect(() => {
    if (!transactionsContainerRef.current || !data?.recent_transactions?.length) return;

    const container = transactionsContainerRef.current;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    
    if (scrollHeight > clientHeight) {
      container.scrollTop = scrollHeight - clientHeight;
    }
  }, [data?.recent_transactions]);

  // Function to categorize transaction type
  const getTransactionCategory = (transaction) => {
    const type = transaction.transaction_type;
    const status = transaction.status;
    
    if (type === 'INCOME' && status === 'COMPLETED') {
      return 'received';
    } else if (type === 'INCOME' && status === 'PENDING') {
      return 'pending_receive';
    } else if (type === 'EXPENSE' && status === 'COMPLETED') {
      return 'spent';
    } else if (type === 'EXPENSE' && status === 'PENDING') {
      return 'pending_sent';
    }
    return 'other';
  };

  // Function to get display text for category
  const getCategoryDisplay = (category) => {
    switch (category) {
      case 'received':
        return { text: 'Received', color: 'bg-green-100 text-green-700', icon: '↑' };
      case 'spent':
        return { text: 'Spent', color: 'bg-red-100 text-red-700', icon: '↓' };
      case 'pending_receive':
        return { text: 'Pending Receive', color: 'bg-blue-100 text-blue-700', icon: '⏳' };
      case 'pending_sent':
        return { text: 'Pending Sent', color: 'bg-yellow-100 text-yellow-700', icon: '⏳' };
      default:
        return { text: 'Other', color: 'bg-gray-100 text-gray-700', icon: '•' };
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    try {
      // Handle both "2025-11-27" format and full ISO strings
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return original if invalid
      }
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
        <div className="text-center text-red-600 font-bold text-xl">
          {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-600">
          No data available
        </div>
      </div>
    );
  }

  // Destructure the data with safe fallbacks using the actual API response structure
  const {
    total_income = 0,
    total_expenses = 0,
    pending_to_receive = 200,
    pending_to_pay = 0,
    balance = 0,
    recent_transactions = [],
  } = data;

  console.log('Rendering with data:', {
    total_income,
    total_expenses,
    balance,
    transactionCount: recent_transactions.length
  });

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
          <h1 className="text-3xl font-bold text-gray-800">Financial Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your financial transactions</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Received</p>
                <p className="text-2xl font-bold text-green-600 mt-1">₹{total_income.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-red-600 mt-1">₹{total_expenses.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-blue-600 mt-1">₹{pending_to_receive.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-yellow-600 mt-1">₹{pending_to_pay.toLocaleString()}</p>
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
              <p className={`text-4xl font-bold mt-2 ${balance >= 0 ? 'text-white' : 'text-red-200'}`}>
                ₹{balance.toLocaleString()}
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

        {/* Recent Transactions with Auto-scroll */}
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
              className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100 pr-2"
            >
              {recent_transactions.map((transaction, index) => {
                const category = getTransactionCategory(transaction);
                const categoryInfo = getCategoryDisplay(category);
                
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        category === 'received' 
                          ? 'bg-green-100 text-green-600' 
                          : category === 'spent'
                          ? 'bg-red-100 text-red-600'
                          : category === 'pending_receive'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {categoryInfo.icon}
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
                        category === 'received' || category === 'pending_receive'
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {category === 'received' || category === 'pending_receive' ? '+' : '-'}
                        ₹{parseFloat(transaction.amount).toLocaleString()}
                      </p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                        {categoryInfo.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}