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
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
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

  // Map API response to your desired field names
  const {
    total_income = 0,           // From API
    total_expenses = 0,         // From API
    pending_to_receive = 0,     // From API
    pending_to_pay = 0,         // From API
    balance = 0,                // From API
    recent_transactions = [],   // From API
  } = data;

  // Transform API data to your desired field structure
  const transformedData = {
    total_received: total_income,           // Map total_income to total_received
    total_sent: total_expenses,             // Map total_expenses to total_sent
    pending_to_receive: pending_to_receive, // Same name
    pending_to_send: pending_to_pay,        // Map pending_to_pay to pending_to_send
    total_balance: balance,                 // Map balance to total_balance
    pending_balance: pending_to_receive - pending_to_pay, // Calculate pending balance
    overall_balance: balance + (pending_to_receive - pending_to_pay), // Calculate overall
    recent_transactions: recent_transactions,
    transaction_counts: {
      total: recent_transactions.length,
      received: recent_transactions.filter(t => t.transaction_type === 'INCOME' && t.status === 'COMPLETED').length,
      sent: recent_transactions.filter(t => t.transaction_type === 'EXPENSE' && t.status === 'COMPLETED').length,
      pending: recent_transactions.filter(t => t.status === 'PENDING').length
    }
  };

  const {
    total_received = 0,
    total_sent = 0,
    // pending_to_receive = 0,
    pending_to_send = 0,
    total_balance = 0,
    pending_balance = 0,
    overall_balance = 0,
    recent_transactions: transactions = [],
    transaction_counts = {}
  } = transformedData;

  const cardStyle = "p-5 shadow-xl rounded-xl backdrop-blur-xl bg-white/30 border border-white/40 text-gray-900 flex flex-col items-start";

  // Format amount with proper sign display
  const formatAmount = (amount, isPositive = true) => {
    const sign = isPositive ? '+' : '-';
    const absAmount = Math.abs(amount).toFixed(2);
    return `${sign}₹${absAmount}`;
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className={cardStyle}>
          <h1 className="text-3xl font-bold text-gray-800">Financial Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your financial transactions</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Received */}
          <div className={cardStyle}>
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Received</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {formatAmount(total_received, true)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">↑</span>
              </div>
            </div>
          </div>

          {/* Total Sent */}
          <div className={cardStyle}>
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Sent</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {formatAmount(total_sent, false)}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">↓</span>
              </div>
            </div>
          </div>

          {/* Pending to Receive */}
          <div className={cardStyle}>
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending to Receive</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {formatAmount(pending_to_receive, true)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">⏳</span>
              </div>
            </div>
          </div>

          {/* Pending to Send */}
          <div className={cardStyle}>
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending to Send</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {formatAmount(pending_to_send, false)}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold">⚠️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Balance */}
          <div className={cardStyle}>
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Balance</p>
                <p className={`text-2xl font-bold mt-1 ${total_balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatAmount(total_balance, total_balance >= 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">💰</span>
              </div>
            </div>
          </div>

          {/* Pending Balance */}
          <div className={cardStyle}>
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Balance</p>
                <p className={`text-2xl font-bold mt-1 ${pending_balance >= 0 ? 'text-blue-600' : 'text-yellow-600'}`}>
                  {formatAmount(pending_balance, pending_balance >= 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">⏳</span>
              </div>
            </div>
          </div>

          {/* Overall Balance */}
          <div className={cardStyle}>
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-gray-600 text-sm font-medium">Overall Balance</p>
                <p className={`text-2xl font-bold mt-1 ${overall_balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatAmount(overall_balance, overall_balance >= 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Counts */}
        <div className={cardStyle}>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Transaction Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{transaction_counts.total || 0}</p>
              <p className="text-gray-600 text-sm">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{transaction_counts.received || 0}</p>
              <p className="text-gray-600 text-sm">Received</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{transaction_counts.sent || 0}</p>
              <p className="text-gray-600 text-sm">Sent</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{transaction_counts.pending || 0}</p>
              <p className="text-gray-600 text-sm">Pending</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions with Auto-scroll */}
        <div className={cardStyle}>
          <div className="flex items-center justify-between mb-6 w-full">
            <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
            <span className="text-gray-500 text-sm">
              {transactions.length} transactions
            </span>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 w-full">
              <p>No transactions found</p>
              <p className="text-sm mt-1">Start by adding your first transaction</p>
            </div>
          ) : (
            <div 
              ref={transactionsContainerRef}
              className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100 pr-2 w-full"
            >
              {transactions.map((transaction, index) => {
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