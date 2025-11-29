import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useTheme } from "../context/ThemeContext";
import { Plus, Trash2, Edit, TrendingUp, AlertCircle } from "lucide-react";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const { isDark, theme } = useTheme();

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    month: new Date().toISOString().split('T')[0].slice(0, 7) + '-01' // First day of current month
  });

  // Fetch budgets and summary
  const loadBudgets = async () => {
    try {
      setLoading(true);
      setError("");

      const [budgetsResponse, summaryResponse] = await Promise.all([
        axiosInstance.get("budgets/"),
        axiosInstance.get("budgets/summary/")
      ]);

      setBudgets(budgetsResponse.data);
      setSummary(summaryResponse.data);
    } catch (err) {
      console.error("Error loading budgets:", err);
      setError("Failed to load budgets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  // Open Add Modal
  const openAddModal = () => {
    setEditingBudget(null);
    setFormData({
      category: "",
      amount: "",
      month: new Date().toISOString().split('T')[0].slice(0, 7) + '-01'
    });
    setShowModal(true);
    setError("");
  };

  // Open Edit Modal
  const openEditModal = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount,
      month: budget.month
    });
    setShowModal(true);
    setError("");
  };

  // Handle Form Input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");

      if (parseFloat(formData.amount) <= 0) {
        setError("Amount must be greater than 0");
        return;
      }

      if (editingBudget) {
        await axiosInstance.put(`budgets/${editingBudget.id}/`, formData);
      } else {
        await axiosInstance.post("budgets/", formData);
      }

      await loadBudgets();
      setShowModal(false);
    } catch (err) {
      console.error("Error saving budget:", err);
      setError(err.response?.data?.error || "Failed to save budget. Please try again.");
    }
  };

  // Delete Budget
  const deleteBudget = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await axiosInstance.delete(`budgets/${id}/`);
        await loadBudgets();
      } catch (err) {
        console.error("Error deleting budget:", err);
        setError("Failed to delete budget. Please try again.");
      }
    }
  };

  // Get utilization color
  const getUtilizationColor = (percentage) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Get utilization text color
  const getUtilizationTextColor = (percentage) => {
    if (percentage >= 90) return "text-red-600 dark:text-red-400";
    if (percentage >= 75) return "text-yellow-600 dark:text-yellow-400";
    return "text-green-600 dark:text-green-400";
  };

  if (loading) {
    return (
      <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-100'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="h-10 w-10 border-t-2 border-purple-600 animate-spin rounded-full mx-auto mb-4"></div>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading Budgets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className={`rounded-2xl shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Budget Management</h1>
              <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Track and manage your monthly budgets</p>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
            >
              <Plus size={20} /> Add Budget
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className={`rounded-xl flex items-center gap-2 p-4 ${
            isDark 
              ? 'bg-red-900 border-red-700 text-red-200' 
              : 'bg-red-100 border-red-400 text-red-700'
          } border`}>
            <AlertCircle size={20} />
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className={`ml-auto ${
                isDark ? 'text-red-300 hover:text-red-100' : 'text-red-700 hover:text-red-900'
              }`}
            >
              ✕
            </button>
          </div>
        )}

        {/* Budget Summary */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className={`rounded-2xl shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Total Budget</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    ₹{summary.total_budget?.toLocaleString() || 0}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-blue-900' : 'bg-blue-100'
                }`}>
                  <TrendingUp className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className={`rounded-2xl shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Total Spent</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">
                    ₹{summary.total_spent?.toLocaleString() || 0}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-orange-900' : 'bg-orange-100'
                }`}>
                  <span className="text-orange-600 font-bold">₹</span>
                </div>
              </div>
            </div>

            <div className={`rounded-2xl shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Total Remaining</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    ₹{summary.total_remaining?.toLocaleString() || 0}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-green-900' : 'bg-green-100'
                }`}>
                  <span className="text-green-600 font-bold">+</span>
                </div>
              </div>
            </div>

            <div className={`rounded-2xl shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Utilization</p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">
                    {summary.overall_utilization?.toFixed(1)}%
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-purple-900' : 'bg-purple-100'
                }`}>
                  <span className="text-purple-600 font-bold">%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Budgets List */}
        <div className={`rounded-2xl shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>Your Budgets</h2>

          {budgets.length === 0 ? (
            <div className={`text-center py-10 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <p className="text-xl mb-2">No budgets found</p>
              <p className="text-sm">Create your first budget to start tracking</p>
            </div>
          ) : (
            <div className="space-y-4">
              {budgets.map((budget) => (
                <div
                  key={budget.id}
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    isDark 
                      ? 'bg-gray-750 border-gray-700' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-semibold text-lg ${
                        isDark ? 'text-white' : 'text-gray-800'
                      }`}>
                        {budget.category}
                      </h3>
                      <span className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {new Date(budget.month).toLocaleDateString('en-IN', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Budget: </span>
                        <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          ₹{budget.amount?.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Spent: </span>
                        <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          ₹{budget.spent_amount?.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Remaining: </span>
                        <span className={`font-semibold ${
                          budget.remaining_amount < 0 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-green-600 dark:text-green-400'
                        }`}>
                          ₹{budget.remaining_amount?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className={getUtilizationTextColor(budget.utilization_percentage)}>
                          {budget.utilization_percentage?.toFixed(1)}% utilized
                        </span>
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                          ₹{budget.spent_amount?.toLocaleString()} of ₹{budget.amount?.toLocaleString()}
                        </span>
                      </div>
                      <div className={`w-full rounded-full h-2 ${
                        isDark ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        <div
                          className={`h-2 rounded-full ${getUtilizationColor(budget.utilization_percentage)}`}
                          style={{ width: `${Math.min(budget.utilization_percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => openEditModal(budget)}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deleteBudget(budget.id)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Budget Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
          <div className={`rounded-xl shadow-lg w-full max-w-md p-6 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {editingBudget ? "Edit Budget" : "Add Budget"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Category
                </label>
                <input
                  name="category"
                  placeholder="e.g., Food, Rent, Entertainment"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Amount (₹)
                </label>
                <input
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Month
                </label>
                <input
                  name="month"
                  type="month"
                  value={formData.month.slice(0, 7)}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    month: e.target.value + '-01'
                  }))}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`px-5 py-2 rounded-xl transition ${
                    isDark 
                      ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' 
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                >
                  {editingBudget ? "Update" : "Add"} Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}