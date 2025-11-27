import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Home, User, Settings, HelpCircle } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  // Updated menu items with checkbox states
  const menuItems = [
    { name: "Home", icon: Home, path: "/dashboard", checked: false },
    { name: "Expenses", icon: User, path: "/expense", checked: true },
    // { name: "Trips", icon: User, path: "/trips", checked: false },
    // { name: "Approvals", icon: User, path: "/approvals", checked: false },
    { name: "Settings", icon: Settings, path: "/setting", checked: false },
    { name: "Support", icon: HelpCircle, path: "/support", checked: false },
  ];

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
    setOpen(false);
  };

  return (
    <div className="relative select-none">
      {/* Mobile top bar */}
      <div
        className={`lg:hidden fixed top-3 left-1/2 -translate-x-1/2 w-[92%] 
        backdrop-blur-xl bg-white/10 border border-white/20 
        text-white px-5 py-3 flex justify-between items-center 
        z-50 shadow-xl rounded-2xl transition-all`}
      >
        <h1 className="font-bold text-xl tracking-wide drop-shadow-md">My App</h1>

        <button
          onClick={() => setOpen(true)}
          className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all shadow-md"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-gradient-to-b from-black-900/40 to-white-700/20 backdrop-blur-2xl text-white shadow-2xl border-r border-white/20 transform transition-transform duration-300 z-50 p-6
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Mobile Close button */}
        <div className="lg:hidden flex justify-end mb-5">
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="flex items-center gap-3 mb-8 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold">AP</span>
          </div>
          <div>
            <p className="font-medium text-sm">Akash Pandey</p>
            <p className="text-white/70 text-xs">akash@example.com</p>
          </div>
        </div>

        {/* Navigation with Checkboxes */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-3 rounded-xl transition-all duration-200
                  ${
                    isActive
                      ? "bg-white/20 border border-white/40 shadow-md"
                      : "hover:bg-white/10"
                  }`
                }
              >
                {/* Custom Checkbox */}
                {/* <div className="relative flex items-center justify-center">
                  <div 
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center
                      ${item.checked 
                        ? "bg-white border-white" 
                        : "bg-transparent border-white/70"}`}
                  >
                    {item.checked && (
                      <svg 
                        className="w-3 h-3 text-black" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="3" 
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    )}
                  </div>
                </div> */}
                
                <Icon className="w-5 h-5 text-white" />
                <span className="text-base font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-600 hover:bg-red-700 font-semibold rounded-xl transition-all shadow-md"
          >
            Logout
          </button>
        </div>
      </aside>
    </div>
  );
}