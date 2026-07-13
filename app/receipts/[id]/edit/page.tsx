"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase, Receipt, ReceiptItem } from "@/lib/supabase";

export default function EditReceiptPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    date: "",
    staff: "",
    student_name: "",
    age: 0,
    course: "",
    parent_name: "",
    parent_phone: "",
    parent_address: "",
    payment_method: "Cash",
    paid_amount: 0,
  });
  const [items, setItems] = useState<ReceiptItem[]>([]);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from("receipts").select("*").eq("id", id).single();
      if (data) {
        const r = data as Receipt;
        setForm({
          date: new Date(r.date).toISOString().slice(0, 16),
          staff: r.staff,
          student_name: r.student_name,
          age: r.age ?? 0,
          course: r.course,
          parent_name: r.parent_name ?? "",
          parent_phone: r.parent_phone ?? "",
          parent_address: r.parent_address ?? "",
          payment_method: r.payment_method,
          paid_amount: r.paid_amount,
        });
        setItems(r.items);
      }
      setLoading(false);
    }
    fetch();
  }, [id]);

  const total = items.reduce((sum, i) => sum + Number(i.amount), 0);
  const change = Number(form.paid_amount) - total;

  function updateField(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateItem(index: number, field: keyof ReceiptItem, value: string | number) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: field === "amount" ? Number(value) : value } : item
      )
    );
  }

  function addItem() {
    setItems((prev) => [...prev, { name: "", amount: 0 }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from("receipts")
      .update({
        ...form,
        date: new Date(form.date).toISOString(),
        age: form.age ? Number(form.age) : null,
        items,
        total,
        paid_amount: Number(form.paid_amount),
        change_amount: change,
      })
      .eq("id", id);

    setSaving(false);
    if (error) {
      alert("Error updating receipt: " + error.message);
      return;
    }
    router.push(`/receipts/${id}`);
  }

  if (loading) return <p className="p-6 text-gray-500 text-sm">Loading...</p>;

  const inputClass = "w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700 text-sm">
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Edit Receipt</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 space-y-6">

          {/* Receipt Info */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Receipt Info</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                <input type="datetime-local" value={form.date} onChange={(e) => updateField("date", e.target.value)} required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Staff</label>
                <input type="text" value={form.staff} onChange={(e) => updateField("staff", e.target.value)} required className={inputClass} />
              </div>
            </div>
          </section>

          {/* Student Info */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Student Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" value={form.student_name} onChange={(e) => updateField("student_name", e.target.value)} required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input type="number" value={form.age || ""} onChange={(e) => updateField("age", e.target.value)} min="1" max="100" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
                <input type="text" value={form.course} onChange={(e) => updateField("course", e.target.value)} required className={inputClass} />
              </div>
            </div>
          </section>

          {/* Parent Info */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Parent Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Name</label>
                <input type="text" value={form.parent_name} onChange={(e) => updateField("parent_name", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Phone</label>
                <input type="text" value={form.parent_phone} onChange={(e) => updateField("parent_phone", e.target.value)} className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea value={form.parent_address} onChange={(e) => updateField("parent_address", e.target.value)} rows={2} className={inputClass} />
              </div>
            </div>
          </section>

          {/* Items */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Items</h2>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input type="text" placeholder="Item name" value={item.name} onChange={(e) => updateItem(i, "name", e.target.value)} required className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  <input type="number" placeholder="Amount" value={item.amount || ""} onChange={(e) => updateItem(i, "amount", e.target.value)} min="0" step="0.01" required className="w-32 border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addItem} className="mt-2 text-sm text-blue-600 hover:underline">+ Add Item</button>
            <div className="mt-3 flex justify-end">
              <span className="text-sm font-bold text-gray-800">Total: {total.toLocaleString("en-US", { minimumFractionDigits: 2 })} THB</span>
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Payment</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                <select value={form.payment_method} onChange={(e) => updateField("payment_method", e.target.value)} className={inputClass}>
                  <option>Cash</option>
                  <option>Bank Transfer</option>
                  <option>QR Code</option>
                  <option>Card</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount</label>
                <input type="number" value={form.paid_amount || ""} onChange={(e) => updateField("paid_amount", e.target.value)} min="0" step="0.01" required className={inputClass} />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Change: <span className="font-medium">{change.toLocaleString("en-US", { minimumFractionDigits: 2 })} THB</span>
            </p>
          </section>

          <button type="submit" disabled={saving} className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 disabled:opacity-50">
            {saving ? "Saving..." : "Update Receipt"}
          </button>
        </form>
      </div>
    </div>
  );
}
