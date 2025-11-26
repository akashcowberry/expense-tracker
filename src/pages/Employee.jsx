import React, { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:8000/api/employee/"; 
const LOGO = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [modalMsg, setModalMsg] = useState("");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    position: "",
    hired_date: "",
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    setLoading(true);
    try {
      const res = await fetch(API_BASE);
      const json = await res.json();
      setEmployees(json.data || json || []);
    } catch {
      setMsg({ text: "Failed to load employees", type: "error" });
    }
    setLoading(false);
  }

  const filtered = employees.filter((e) =>
    [e.first_name, e.last_name, e.email, e.position]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  function openAdd() {
    setForm({ first_name: "", last_name: "", email: "", position: "", hired_date: "" });
    setEditingId(null);
    setModalMsg("");
    setModalOpen(true);
  }

  function openEdit(id) {
    const emp = employees.find((x) => x.id === id);
    if (!emp) return;

    setEditingId(id);
    setForm({
      first_name: emp.first_name,
      last_name: emp.last_name,
      email: emp.email,
      position: emp.position,
      hired_date: emp.hired_date?.split("T")[0] || "",
    });
    setModalOpen(true);
  }

  async function submit() {
    setModalMsg("Saving...");

    const payload = { ...form };

    const url = editingId ? API_BASE + editingId + "/" : API_BASE;
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (json.status === "success") {
        loadEmployees();
        setModalMsg("Saved successfully");
        setTimeout(() => setModalOpen(false), 700);
      } else {
        setModalMsg(json.message || "Failed");
      }
    } catch {
      setModalMsg("Server error");
    }
  }

  async function doDelete(id) {
    if (!window.confirm("Delete this employee?")) return;

    await fetch(API_BASE + id + "/", { method: "DELETE" });
    loadEmployees();
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 overflow-auto">
      {/* Centered container */}
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-md border border-gray-200">
          <img src={LOGO} className="h-12 w-12 rounded-lg" alt="logo" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Employee Dashboard</h1>
            <p className="text-gray-500 text-sm">Manage employee records efficiently</p>
          </div>
        </div>

        {/* Tools */}
        <div className="bg-white p-4 rounded-2xl shadow-md border flex flex-col sm:flex-row sm:items-center gap-4">
          <input
            className="w-full sm:w-80 border px-3 py-2 rounded-xl focus:ring-2 focus:ring-purple-300"
            placeholder="Search employees..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button
            onClick={openAdd}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl shadow"
          >
            + Add Employee
          </button>
        </div>

        {/* Message */}
        {msg.text && (
          <div
            className={`p-3 rounded-xl ${
              msg.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {msg.text}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-md border overflow-hidden">
          
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["ID", "Name", "Email", "Position", "Hired Date", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              )}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    No employees found
                  </td>
                </tr>
              )}

              {!loading &&
                filtered.map((emp) => (
                  <tr key={emp.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-black">{emp.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold">{emp.first_name}</div>
                      <div className="text-gray-500">{emp.last_name}</div>
                    </td>
                    <td className="px-6 py-4 text-black">{emp.email}</td>
                    <td className="px-6 py-4 text-black">{emp.position}</td>
                    <td className="px-6 py-4 text-black">{emp.hired_date?.split("T")[0] || "—"}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => openEdit(emp.id)}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => doDelete(emp.id)}
                        className="px-3 py-1 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xl shadow-xl space-y-4">
            
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingId ? "Edit Employee" : "Add Employee"}
              </h2>
              <button onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="First name" value={form.first_name} onChange={(v) => setForm({ ...form, first_name: v })} />
              <Input label="Last name" value={form.last_name} onChange={(v) => setForm({ ...form, last_name: v })} />
              <Input label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
              <Input label="Position" value={form.position} onChange={(v) => setForm({ ...form, position: v })} />
              <Input type="date" label="Hired date" value={form.hired_date} onChange={(v) => setForm({ ...form, hired_date: v })} />
            </div>

            {modalMsg && <div className="p-2 bg-yellow-100 rounded-lg">{modalMsg}</div>}

            <div className="flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg">
                Cancel
              </button>
              <button onClick={submit} className="px-4 py-2 bg-purple-600 text-white rounded-lg">
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Reusable Input Component
function Input({ label, type = "text", value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-300"
      />
    </div>
  );
}
