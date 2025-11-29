import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../api/axiosInstance";
import { useTheme } from "../context/ThemeContext";
import { Pencil, Trash2, Plus, AlertCircle, ChevronDown } from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/api/transactions/";

export default function ExpensePage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Dropdown state
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "SPEND",
    transaction_type: "EXPENSE",
    status: "COMPLETED",
    date: "",
  });

  // Theme context
  const { isDark, theme } = useTheme();

  // Category options
  const categories = [
    { value: "RECEIVED", label: "Received", color: "bg-green-500", icon: "+" },
    { value: "SENT", label: "Sent", color: "bg-red-500", icon: "-" },
    { value: "SPEND", label: "Spend", color: "bg-orange-500", icon: "-" },
  ];

  // Transaction type options
  const transactionTypes = [
    { value: "INCOME", label: "Income" },
    { value: "EXPENSE", label: "Expense" }
  ];

  // Helper: map UI category to backend transaction_type
  const mapCategoryToType = (category) =>
    category === "RECEIVED" ? "INCOME" : "EXPENSE";

  // Helper: map transaction_type to default category
  const mapTypeToCategory = (transactionType) =>
    transactionType === "INCOME" ? "RECEIVED" : "SPEND";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Expenses with proper error handling
  const loadExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔍 Loading transactions...");
      
      // Test server connection first
      try {
        await fetch('http://127.0.0.1:8000/api/test/');
        console.log("✅ Server is reachable");
      } catch (serverError) {
        console.error("❌ Server not reachable:", serverError);
        throw new Error("Cannot connect to server. Please make sure Django backend is running.");
      }

      const response = await axiosInstance.get("transactions/");
      console.log("✅ Transactions response:", response.data);

      // Support both: response.data = [...] OR { data: [...] }
      const raw = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      // Ensure each item has a UI category
      const mapped = raw.map((tx) => ({
        ...tx,
        category: tx.category || (tx.transaction_type === "INCOME" ? "RECEIVED" : "SENT"),
      }));

      setExpenses(mapped);
    } catch (err) {
      console.error("💥 Error loading expenses:", err);
      
      if (err.code === 'ERR_NETWORK') {
        setError("Network Error: Cannot connect to server. Please check if Django backend is running on http://127.0.0.1:8000");
      } else if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setTimeout(() => window.location.href = "/login", 2000);
      } else if (err.response?.data) {
        setError(err.response.data.detail || err.response.data.message || "Failed to load transactions.");
      } else {
        setError("Failed to load transactions. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  // Open Add Modal with specific category
  const openAddModal = (category) => {
    setEditingExpense(null);
    const transactionType = mapCategoryToType(category);
    setFormData({
      title: "",
      amount: "",
      category: category,
      transaction_type: transactionType,
      status: "COMPLETED",
      date: new Date().toISOString().split("T")[0],
    });
    setShowModal(true);
    setShowDropdown(false);
    setError(null);
  };

  // Open Edit Modal
  const openEditModal = (exp) => {
    setEditingExpense(exp);
    setFormData({
      title: exp.title,
      amount: exp.amount,
      category: exp.category,
      transaction_type: exp.transaction_type,
      status: exp.status,
      date: exp.date,
    });
    setShowModal(true);
    setError(null);
  };

  // Handle Form Input
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "transaction_type") {
      const newCategory = mapTypeToCategory(value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        category: newCategory
      }));
    } else if (name === "category") {
      const newTransactionType = mapCategoryToType(value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        transaction_type: newTransactionType
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Submit Form with proper error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Validate amount
      if (parseFloat(formData.amount) <= 0) {
        setError("Amount must be greater than 0");
        setSubmitting(false);
        return;
      }

      const payload = {
        title: formData.title,
        amount: formData.amount,
        category: formData.category,
        transaction_type: formData.transaction_type,
        status: formData.status,
        date: formData.date,
      };

      console.log("💾 Saving transaction:", payload);

      if (editingExpense) {
        await axiosInstance.put(`transactions/${editingExpense.id}/`, payload);
        console.log("✅ Transaction updated successfully");
      } else {
        await axiosInstance.post("transactions/", payload);
        console.log("✅ Transaction created successfully");
      }

      await loadExpenses();
      setShowModal(false);
      setFormData({
        title: "",
        amount: "",
        category: "SPEND",
        transaction_type: "EXPENSE",
        status: "COMPLETED",
        date: "",
      });
    } catch (err) {
      console.error("💥 Error saving expense:", err);
      
      if (err.code === 'ERR_NETWORK') {
        setError("Network Error: Cannot connect to server. Please check your connection.");
      } else if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setTimeout(() => window.location.href = "/login", 2000);
      } else {
        // Try to extract useful error message from DRF
        const data = err.response?.data;
        let errorMessage = data?.message || data?.error || data?.detail || "Failed to save transaction. Please try again.";

        // If DRF sent field errors like { transaction_type: ["This field is required."] }
        if (typeof data === "object" && !Array.isArray(data)) {
          const firstKey = Object.keys(data)[0];
          if (Array.isArray(data[firstKey])) {
            errorMessage = `${firstKey}: ${data[firstKey][0]}`;
          } else if (typeof data[firstKey] === 'string') {
            errorMessage = data[firstKey];
          }
        }

        setError(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Expense with proper error handling
  const deleteExpense = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        console.log("🗑️ Deleting transaction:", id);
        await axiosInstance.delete(`transactions/${id}/`);
        console.log("✅ Transaction deleted successfully");
        await loadExpenses();
      } catch (err) {
        console.error("💥 Error deleting expense:", err);
        
        if (err.code === 'ERR_NETWORK') {
          setError("Network Error: Cannot connect to server. Please check your connection.");
        } else if (err.response?.status === 401) {
          setError("Authentication failed. Please login again.");
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          setTimeout(() => window.location.href = "/login", 2000);
        } else {
          setError("Failed to delete transaction. Please try again.");
        }
      }
    }
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setError(null);
  };

  // Get category badge style
  const getCategoryStyle = (category) => {
    switch (category) {
      case "RECEIVED":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "SENT":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      case "SPEND":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Format amount display
  const formatAmount = (expense) => {
    const amt = parseFloat(expense.amount || 0).toFixed(2);
    const sign = expense.category === "RECEIVED" ? "+" : "-";
    return `${sign}₹${amt}`;
  };

  if (loading) {
    return (
      <div className={`p-6 min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-100'} mt-16 lg:mt-0 flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading Transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-100'} mt-16 lg:mt-0`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Transactions</h1>

        {/* Dropdown Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            <Plus size={20} /> Add Transaction
            <ChevronDown
              size={18}
              className={`transition-transform ${
                showDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg z-50 overflow-hidden border ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => openAddModal(cat.value)}
                  className={`w-full px-4 py-3 text-left transition flex items-center gap-3 group ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <span
                    className={`${cat.color} text-white w-8 h-8 rounded-full flex items-center justify-center font-bold`}
                  >
                    {cat.icon}
                  </span>
                  <span className={`font-medium ${
                    isDark 
                      ? 'text-gray-300 group-hover:text-indigo-400' 
                      : 'text-gray-700 group-hover:text-indigo-600'
                  }`}>
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className={`mb-4 p-4 rounded-xl flex items-center gap-2 border ${
          isDark 
            ? 'bg-red-900 border-red-700 text-red-200' 
            : 'bg-red-100 border-red-400 text-red-700'
        }`}>
          <AlertCircle size={20} />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className={`ml-auto ${
              isDark ? 'text-red-300 hover:text-red-100' : 'text-red-700 hover:text-red-900'
            }`}
          >
            ✕
          </button>
        </div>
      )}

      {/* Table */}
      <div className={`rounded-xl shadow-md p-5 overflow-x-auto ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        {expenses.length === 0 ? (
          <div className={`text-center py-10 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <p className="text-xl mb-2">No transactions found</p>
            <p className="text-sm">
              Click &quot;Add Transaction&quot; to create your first transaction
            </p>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className={isDark ? 'bg-gray-700' : 'bg-gray-200'}>
                <th className={`p-3 text-left ${
                  isDark ? 'text-gray-300' : 'text-gray-800'
                }`}>Title</th>
                <th className={`p-3 text-left ${
                  isDark ? 'text-gray-300' : 'text-gray-800'
                }`}>Amount</th>
                <th className={`p-3 text-left ${
                  isDark ? 'text-gray-300' : 'text-gray-800'
                }`}>Category</th>
                <th className={`p-3 text-left ${
                  isDark ? 'text-gray-300' : 'text-gray-800'
                }`}>Type</th>
                <th className={`p-3 text-left ${
                  isDark ? 'text-gray-300' : 'text-gray-800'
                }`}>Status</th>
                <th className={`p-3 text-left ${
                  isDark ? 'text-gray-300' : 'text-gray-800'
                }`}>Date</th>
                <th className={`p-3 text-center ${
                  isDark ? 'text-gray-300' : 'text-gray-800'
                }`}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((exp) => (
                <tr
                  key={exp.id}
                  className={`border-b transition ${
                    isDark 
                      ? 'border-gray-700 hover:bg-gray-750' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <td className={`p-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{exp.title}</td>
                  <td
                    className={`p-3 font-semibold ${
                      exp.category === "RECEIVED"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {formatAmount(exp)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryStyle(
                        exp.category
                      )}`}
                    >
                      {exp.category}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        exp.transaction_type === "INCOME"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {exp.transaction_type}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        exp.status === "COMPLETED"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {exp.status}
                    </span>
                  </td>
                  <td className={`p-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{exp.date}</td>

                  <td className="p-3 flex gap-3 justify-center">
                    <button
                      onClick={() => openEditModal(exp)}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => deleteExpense(exp.id)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
          <div className={`rounded-xl shadow-lg w-full max-w-md p-6 relative ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {editingExpense ? "Edit Transaction" : "Add Transaction"}
            </h2>

            {error && (
              <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 border ${
                isDark 
                  ? 'bg-red-900 border-red-700 text-red-200' 
                  : 'bg-red-100 border-red-400 text-red-700'
              }`}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Title
                </label>
                <input
                  name="title"
                  placeholder="Enter transaction title"
                  value={formData.title}
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
                  Amount
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
                  Transaction Type
                </label>
                <select
                  name="transaction_type"
                  value={formData.transaction_type}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                >
                  {transactionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                >
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Date
                </label>
                <input
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
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
                  onClick={closeModal}
                  type="button"
                  className={`px-5 py-2 rounded-xl transition ${
                    isDark 
                      ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' 
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : editingExpense ? (
                    "Update"
                  ) : (
                    "Add"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}