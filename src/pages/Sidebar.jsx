import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Home, User } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  

  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Employees", icon: User, path: "/employeedashboard" },
    { name: "User Profile", icon: User, path: "/products" },
    { name: "Products", icon: User, path: "/products" },
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

        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-10">
          <img
            src="/lantern_logo-4.png"
            alt="logo"
            className="w-14 h-14 rounded-xl shadow-md"
          />
          <h2 className="text-2xl font-bold mt-3 tracking-wide">MY APP</h2>
          <div className="h-1 w-16 bg-pink-500 rounded-full mt-2" />
        </div>

        {/* Navigation */}
        <nav className="space-y-3">
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
                <Icon className="w-5 h-5 text-white" />
                <span className="text-base font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User section */}
        <div className="absolute bottom-6 left-6 right-6 space-y-4">
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-600 hover:bg-red-700 font-semibold rounded-xl transition-all shadow-md"
          >
            Logout
          </button>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" />
            <div>
              <p className="font-medium text-sm">User Name</p>
              <p className="text-white/70 text-xs">user@example.com</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
