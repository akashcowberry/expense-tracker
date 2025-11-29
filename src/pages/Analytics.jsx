import React, { useEffect, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axiosInstance from "../api/axiosInstance";
import { useTheme } from "../context/ThemeContext"; // Import theme hook
import { TrendingUp, TrendingDown, DollarSign, Calendar, RefreshCw, AlertCircle } from "lucide-react";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [filter, setFilter] = useState("month");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isDark, theme } = useTheme(); // Get theme state

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log("🔍 Loading analytics with filter:", filter);
      const response = await axiosInstance.get(`analytics/?filter=${filter}`);
      console.log("✅ Analytics response:", response.data);
      setAnalytics(response.data);
    } catch (err) {
      console.error("💥 Analytics fetch error:", err);
      setError("Failed to load analytics. Please check your authentication.");
      
      if (err.response?.status === 401) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [filter]);

  // Theme-based styling variables
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const cardBorder = isDark ? "border-gray-700" : "border-gray-200";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-300" : "text-gray-600";
  const textMuted = isDark ? "text-gray-400" : "text-gray-500";
  
  const buttonActive = isDark 
    ? "bg-indigo-600 text-white border-indigo-500" 
    : "bg-indigo-600 text-white border-indigo-500";
  
  const buttonInactive = isDark 
    ? "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600" 
    : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300";

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toLocaleString('en-IN')}`;
  };

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
          <p className="font-semibold">{label}</p>
          <p className="text-green-500">
            Income: {formatCurrency(payload[0]?.value)}
          </p>
          <p className="text-red-500">
            Expense: {formatCurrency(payload[1]?.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`h-12 w-12 border-t-2 ${isDark ? 'border-indigo-400' : 'border-indigo-600'} animate-spin rounded-full mx-auto mb-4`}></div>
          <p className={`${textSecondary} text-lg`}>Loading Analytics...</p>
          <p className={`${textMuted} text-sm mt-2`}>Crunching the numbers</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-4">
            <AlertCircle className={`w-12 h-12 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
          </div>
          <div className={`text-xl font-bold mb-4 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
            {error}
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={loadAnalytics}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                isDark 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`text-xl mb-4 ${textSecondary}`}>No analytics data available</div>
          <button
            onClick={loadAnalytics}
            className={`px-4 py-2 rounded-lg transition ${
              isDark 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            Load Analytics
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className={`${cardBg} ${cardBorder} rounded-2xl shadow-lg border p-6`}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold ${textPrimary}`}>Financial Analytics</h1>
              <p className={`${textSecondary} mt-2`}>
                Insights into your income and expenses
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className={`w-5 h-5 ${textMuted}`} />
              <span className={`text-sm ${textMuted}`}>
                {filter === "week" ? "Last 7 Days" : "Last 30 Days"}
              </span>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className={`${cardBg} ${cardBorder} rounded-2xl shadow-lg border p-6`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className={`text-lg font-semibold ${textPrimary} mb-2`}>Time Period</h2>
              <p className={`text-sm ${textMuted}`}>Select the timeframe for analysis</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setFilter("week")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                  filter === "week" ? buttonActive : buttonInactive
                }`}
              >
                <span>Last 7 Days</span>
              </button>
              <button
                onClick={() => setFilter("month")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                  filter === "month" ? buttonActive : buttonInactive
                }`}
              >
                <span>Last 30 Days</span>
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Income Card */}
          <div className={`${cardBg} ${cardBorder} rounded-2xl shadow-lg border p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${textMuted} mb-1`}>Total Income</p>
                <p className={`text-3xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'} mb-2`}>
                  {formatCurrency(analytics.total_income)}
                </p>
                <div className={`flex items-center gap-1 text-sm ${isDark ? 'text-green-300' : 'text-green-600'}`}>
                  <TrendingUp size={16} />
                  <span>Positive cash flow</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isDark ? 'bg-green-900/30' : 'bg-green-100'
              }`}>
                <DollarSign className={isDark ? 'text-green-400' : 'text-green-600'} size={24} />
              </div>
            </div>
          </div>

          {/* Total Expense Card */}
          <div className={`${cardBg} ${cardBorder} rounded-2xl shadow-lg border p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${textMuted} mb-1`}>Total Expense</p>
                <p className={`text-3xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'} mb-2`}>
                  {formatCurrency(analytics.total_expense)}
                </p>
                <div className={`flex items-center gap-1 text-sm ${isDark ? 'text-red-300' : 'text-red-600'}`}>
                  <TrendingDown size={16} />
                  <span>Money out</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isDark ? 'bg-red-900/30' : 'bg-red-100'
              }`}>
                <TrendingDown className={isDark ? 'text-red-400' : 'text-red-600'} size={24} />
              </div>
            </div>
          </div>

          {/* Balance Card */}
          <div className={`${cardBg} ${cardBorder} rounded-2xl shadow-lg border p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${textMuted} mb-1`}>Net Balance</p>
                <p className={`text-3xl font-bold ${
                  analytics.balance >= 0 
                    ? (isDark ? 'text-blue-400' : 'text-blue-600')
                    : (isDark ? 'text-orange-400' : 'text-orange-600')
                } mb-2`}>
                  {formatCurrency(analytics.balance)}
                </p>
                <div className={`flex items-center gap-1 text-sm ${
                  analytics.balance >= 0 
                    ? (isDark ? 'text-blue-300' : 'text-blue-600')
                    : (isDark ? 'text-orange-300' : 'text-orange-600')
                }`}>
                  {analytics.balance >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span>{analytics.balance >= 0 ? 'Surplus' : 'Deficit'}</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                analytics.balance >= 0 
                  ? (isDark ? 'bg-blue-900/30' : 'bg-blue-100')
                  : (isDark ? 'bg-orange-900/30' : 'bg-orange-100')
              }`}>
                <span className={`text-lg font-bold ${
                  analytics.balance >= 0 
                    ? (isDark ? 'text-blue-400' : 'text-blue-600')
                    : (isDark ? 'text-orange-400' : 'text-orange-600')
                }`}>
                  {analytics.balance >= 0 ? '+' : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className={`${cardBg} ${cardBorder} rounded-2xl shadow-lg border p-6`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className={`text-xl font-bold ${textPrimary} mb-2`}>Income vs Expense Trend</h2>
              <p className={`text-sm ${textMuted}`}>
                Visual representation of your financial flow over time
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className={`text-sm ${textSecondary}`}>Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className={`text-sm ${textSecondary}`}>Expense</span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={analytics.graph || []}>
              <CartesianGrid 
                stroke={isDark ? '#374151' : '#e5e7eb'} 
                strokeDasharray="3 3" 
              />
              <XAxis 
                dataKey="date" 
                stroke={isDark ? '#9ca3af' : '#6b7280'}
                fontSize={12}
              />
              <YAxis 
                stroke={isDark ? '#9ca3af' : '#6b7280'}
                fontSize={12}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#10b981' }}
              />
              <Line 
                type="monotone" 
                dataKey="expense" 
                stroke="#ef4444" 
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#ef4444' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Date Range Info */}
        <div className={`${cardBg} ${cardBorder} rounded-2xl shadow-lg border p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold ${textPrimary}`}>Analysis Period</h3>
              <p className={`text-sm ${textMuted}`}>
                {analytics.range_start} to {analytics.range_end}
              </p>
            </div>
            <button
              onClick={loadAnalytics}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              <RefreshCw size={16} />
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}