"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, Receipt } from "@/lib/supabase";

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function fetchReceipts() {
    setLoading(true);
    const { data } = await supabase
      .from("receipts")
      .select("*")
      .order("created_at", { ascending: false });
    setReceipts(data ?? []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this receipt?")) return;
    await supabase.from("receipts").delete().eq("id", id);
    setReceipts((prev) => prev.filter((r) => r.id !== id));
  }

  useEffect(() => {
    fetchReceipts();
  }, []);

  const filtered = receipts.filter(
    (r) =>
      r.student_name.toLowerCase().includes(search.toLowerCase()) ||
      r.receipt_no.toLowerCase().includes(search.toLowerCase()) ||
      r.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto text-gray-900">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">KNC School — Receipts</h1>
          <Link
            href="/receipts/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium"
          >
            + New Receipt
          </Link>
        </div>

        <input
          type="text"
          placeholder="Search by name, receipt no, or course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-sm">No receipts found.</p>
        ) : (
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="w-full text-sm text-gray-900 min-w-[640px]">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Receipt No</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Student</th>
                  <th className="px-4 py-3 text-left">Course</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-blue-600">{r.receipt_no}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {new Date(r.date).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-4 py-3 text-gray-900">{r.student_name}</td>
                    <td className="px-4 py-3 text-gray-700">{r.course}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {r.total.toLocaleString("en-US", { minimumFractionDigits: 2 })} THB
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <Link
                        href={`/receipts/${r.id}`}
                        className="text-green-600 hover:underline text-xs font-medium"
                      >
                        Print
                      </Link>
                      <Link
                        href={`/receipts/${r.id}/edit`}
                        className="text-blue-600 hover:underline text-xs font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="text-red-500 hover:underline text-xs font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
