import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Expense Tracker Menu Items
  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    // {
    //   name: "Transactions",
    //   icon: Receipt,
    //   path: "/expense",
    // },
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
    // {
    //   name: "Recurring Payments",
    //   icon: Receipt,
    //   path: "/recurring",
    // },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },
    // {
    //   name: "Support",
    //   icon: HelpCircle,
    //   path: "/support",
    // },
  ];

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
    setOpen(false);
  };

  return (
    <div className="relative select-none">

      {/* Mobile Top Bar */}
      <div
        className={`lg:hidden fixed top-3 left-1/2 -translate-x-1/2 w-[92%] 
        backdrop-blur-xl bg-white/10 border border-white/20 
        text-white px-5 py-3 flex justify-between items-center 
        z-50 shadow-xl rounded-2xl`}
      >
        <h1 className="font-bold text-xl tracking-wide">Expense Tracker</h1>

        <button
          onClick={() => setOpen(true)}
          className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
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
          bg-gradient-to-b from-gray-900/90 to-gray-700/40 
          backdrop-blur-2xl text-white shadow-2xl 
          border-r border-white/10 p-6 transition-transform duration-300 z-50
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Mobile Close */}
        <div className="lg:hidden flex justify-end mb-5">
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-white/10"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-3 mb-8 p-3 
          bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
            <span className="text-white font-bold">AP</span>
          </div>
          <div>
            <p className="font-medium text-sm">Akash Pandey</p>
            <p className="text-white/70 text-xs">akash@example.com</p>
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
                  ${isActive
                    ? "bg-white/20 border border-white/30 shadow-md"
                    : "hover:bg-white/10"}`
                }
              >
                <Icon className="w-5 h-5 text-white" />
                <span className="text-white font-medium ">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-600 hover:bg-red-700 
              font-semibold rounded-xl shadow-md text-amber-700"
          >
            Logout
          </button>
        </div>
      </aside>
    </div>
  );
}
