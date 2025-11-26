import React, { useState, useEffect } from "react";

const API_BASE = "http://127.0.0.1:8000/api/products/";

export default function ProductDashboard() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [modalMsg, setModalMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  // Load data
  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (!search) setFiltered(products);
    else {
      setFiltered(
        products.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, products]);

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await fetch(API_BASE);
      const json = await res.json();

      if (json.status === "success") {
        setProducts(json.data || []);
        setMsg({ text: "", type: "" });
      } else {
        setMsg({ text: "Failed to load products", type: "error" });
      }
    } catch {
      setMsg({ text: "Server error", type: "error" });
    }
    setLoading(false);
  }

  function openAdd() {
    setEditingId(null);
    setForm({ name: "", price: "", description: "" });
    setModalMsg("");
    setOpen(true);
  }

  function openEdit(id) {
    const p = products.find((x) => x.id === id);
    if (!p) return;

    setEditingId(id);
    setForm({
      name: p.name,
      price: p.price,
      description: p.description,
    });

    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setModalMsg("");
  }

  async function submit(e) {
    e.preventDefault();
    setModalMsg("Saving...");

    const payload = {
      name: form.name.trim(),
      price: form.price,
      description: form.description.trim(),
    };

    try {
      const url = editingId ? API_BASE + editingId + "/" : API_BASE;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.status === "success") {
        loadProducts();
        setModalMsg("Saved!");
        setTimeout(() => setOpen(false), 700);
      } else {
        setModalMsg(json.message || "Failed");
      }
    } catch {
      setModalMsg("Server error");
    }
  }

  async function del(id) {
    if (!window.confirm("Delete product?")) return;
    const res = await fetch(API_BASE + id + "/", { method: "DELETE" });
    const json = await res.json();
    if (json.status === "success") loadProducts();
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 overflow-auto">
      {/* Centered Container */}
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Product Dashboard</h1>
          <p className="text-gray-500 text-sm">
            Create, update and delete product records.
          </p>
        </div>

        {/* Tools */}
        <div className="bg-white p-5 rounded-2xl shadow-md border flex flex-col sm:flex-row sm:items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="w-full sm:w-80 px-3 py-2 border rounded-xl focus:ring-2 focus:ring-purple-300"
          />

          <button
            onClick={openAdd}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl shadow"
          >
            + Add Product
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

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="h-10 w-10 border-t-2 border-purple-600 animate-spin rounded-full" />
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-600 border-b">
                <tr>
                  {["ID", "Name", "Price", "Description", "Actions"].map((h) => (
                    <th key={h} className="px-6 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No products found
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-black">{p.id}</td>
                      <td className="px-6 py-4 text-black">{p.name}</td>
                      <td className="px-6 py-4 text-black">${p.price}</td>
                      <td className="px-6 py-4 max-w-xs truncate text-black">
                        {p.description}
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => openEdit(p.id)}
                          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => del(p.id)}
                          className="px-3 py-1 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">
            
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingId ? "Edit Product" : "Add Product"}
              </h2>
              <button onClick={closeModal}>✕</button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <Input label="Name" value={form.name} onChange={(val) => setForm({ ...form, name: val })} />
              <Input label="Price" type="number" value={form.price} onChange={(val) => setForm({ ...form, price: val })} />
              <Input label="Description" value={form.description} onChange={(val) => setForm({ ...form, description: val })} />

              {modalMsg && (
                <div className="p-2 rounded-lg bg-yellow-100">{modalMsg}</div>
              )}

              <div className="flex justify-end gap-3">
                <button onClick={closeModal} type="button" className="px-4 py-2 border rounded-lg">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg"
                >
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

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
