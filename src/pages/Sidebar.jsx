import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; // Import the theme hook
import {
  Menu,
  X,
  Home,
  Receipt,
  PlusCircle,
  Wallet,
  PieChart,
  Folder,
  Settings,
  HelpCircle,
  BarChart3,
  // CalendarRepeat,
} from "lucide-react";
import axiosInstance from "../api/axiosInstance";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { isDark, theme } = useTheme(); // Get theme state

  // Expense Tracker Menu Items
  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    {
      name: "Add Expense",
      icon: PlusCircle,
      path: "/expense",
    },
    {
      name: "Budgets",
      icon: Wallet,
      path: "/budgets",
    },
    {
      name: "Savings",
      icon: BarChart3,
      path: "/savings",
    },
    {
      name: "Categories",
      icon: Folder,
      path: "/categories",
    },
    {
      name: "Analytics",
      icon: PieChart,
      path: "/analytics",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/setting", // Fixed path to match your settings page
    },
  ];

  const logout = async () => {
    const refresh = localStorage.getItem("refresh");

    try {
      await axiosInstance.post("logout/", { refresh });
    } catch (error) {
      console.log("Logout API error", error);
    }

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");

    window.location.href = "/login";
  };

  // Theme-based styles
  const sidebarBg = isDark 
    ? "bg-gradient-to-b from-gray-900 to-gray-800" 
    : "bg-gradient-to-b from-gray-800 to-gray-700";

  const mobileTopBarBg = isDark
    ? "bg-gray-800/90 border-gray-700"
    : "bg-gray-900/90 border-gray-600";

  const cardBg = isDark
    ? "bg-gray-700/50 border-gray-600"
    : "bg-white/10 border-white/20";

  const textColor = isDark ? "text-gray-100" : "text-white";
  const hoverBg = isDark ? "hover:bg-gray-700" : "hover:bg-white/20";
  const activeBg = isDark 
    ? "bg-gray-700 border-gray-500" 
    : "bg-white/20 border-white/30";

  return (
    <div className={`relative select-none ${isDark ? 'bg-gray-900' : 'bg-white'} ${isDark ? 'text-white' : 'text-gray-900'} p-6 rounded-lg`}>
     
      {/* Mobile Top Bar */}
      <div
        className={`lg:hidden fixed top-3 left-1/2 -translate-x-1/2 w-[92%] 
        backdrop-blur-xl ${mobileTopBarBg} 
        text-white px-5 py-3 flex justify-between items-center 
        z-50 shadow-xl rounded-2xl`}
      >
        <h1 className="font-bold text-xl tracking-wide">Xpensa</h1>

        <button
          onClick={() => setOpen(true)}
          className={`p-3 rounded-xl ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white/10 hover:bg-white/20'} transition`}
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Background Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 
          ${sidebarBg}
          backdrop-blur-2xl text-white shadow-2xl 
          border-r ${isDark ? 'border-gray-700' : 'border-white/10'} p-6 transition-transform duration-300 z-50
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Mobile Close */}
        <div className="lg:hidden flex justify-end mb-5">
          <button
            onClick={() => setOpen(false)}
            className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-white/10'}`}
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* User Section */}
        <div className={`flex items-center gap-3 mb-8 p-3 
          ${cardBg} backdrop-blur-md rounded-xl border`}>
          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
            <span className="text-white font-bold">
              {localStorage.getItem("username") 
                ? localStorage.getItem("username")
                    .split(' ')
                    .map(name => name.charAt(0).toUpperCase())
                    .join('')
                    .substring(0, 2)
                : "U"
              }
            </span>
          </div>
          <div>
            <p className="font-medium text-sm text-white">
              {localStorage.getItem("username") || "User"}
            </p>
            <p className="text-white/70 text-xs">
              {localStorage.getItem("username") ? `${localStorage.getItem("username")}@example.com` : "user@example.com"}
            </p>
            {/* Theme indicator */}
            <div className="flex items-center gap-1 mt-1">
              <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-yellow-400' : 'bg-blue-400'}`}></div>
              <span className="text-white/50 text-xs">{theme} mode</span>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-3 rounded-xl transition-all
                  ${isActive ? activeBg : hoverBg}
                  ${textColor}`
                }
              >
                <Icon className="w-5 h-5 text-white" />
                <span className="text-white font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={logout}
            className={`w-full py-3 font-extrabold rounded-xl shadow-md transition
              ${isDark 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-red-500 hover:bg-red-400 text-white'}`}
          >
            Logout
          </button>
        </div>

        {/* Theme Indicator in Sidebar */}
        {/* <div className="absolute bottom-20 left-6 right-6">
          <div className={`flex items-center justify-center gap-2 p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-white/10'}`}>
            <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-yellow-400' : 'bg-blue-400'}`}></div>
            <span className="text-white/70 text-xs">
              {isDark ? 'Dark' : 'Light'} Theme
            </span>
          </div>
        </div> */}
      </aside>
    </div>
  );
}