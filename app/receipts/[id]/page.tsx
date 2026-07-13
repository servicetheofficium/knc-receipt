"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Printer, Pencil, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase, Receipt } from "@/lib/supabase";
import "../../receipt/receipt.css";

export default function ReceiptDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from("receipts").select("*").eq("id", id).single();
      setReceipt(data);
      setLoading(false);
    }
    fetch();
  }, [id]);

  if (loading) return <p className="p-6 text-gray-500 text-sm">Loading...</p>;
  if (!receipt) return <p className="p-6 text-red-500 text-sm">Receipt not found.</p>;

  const dateStr = new Date(receipt.date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="receipt-page">
      <section className="receipt">
        <div className="center">
          <Image
            src="/school_logo.png"
            alt="KNC School Logo"
            width={80}
            height={80}
            priority
            style={{ margin: "0 auto 6px", width: "80px", height: "80px" }}
          />
          <h1>KNC School</h1>
          <p>Language & Education Center</p>
          <p>Bangkok, Thailand</p>
          <p>Tel: 09X-XXX-XXXX</p>
        </div>

        <div className="line" />

        <div className="info-row"><span>Receipt No</span><span>{receipt.receipt_no}</span></div>
        <div className="info-row"><span>Date</span><span>{dateStr}</span></div>
        <div className="info-row"><span>Staff</span><span>{receipt.staff}</span></div>

        <div className="line" />

        <h3>Student Information</h3>
        <div className="info-row"><span>Name</span><span>{receipt.student_name}</span></div>
        {receipt.age && <div className="info-row"><span>Age</span><span>{receipt.age}</span></div>}
        <div className="info-row"><span>Course</span><span>{receipt.course}</span></div>

        <div className="line" />

        <h3>Parent Information</h3>
        <div className="info-row"><span>Name</span><span>{receipt.parent_name || "-"}</span></div>
        <div className="info-row"><span>Phone</span><span>{receipt.parent_phone || "-"}</span></div>
        <div className="info-row"><span>Address</span><span>{receipt.parent_address || "-"}</span></div>

        <div className="line" />

        <div className="table-head">
          <strong>Item</strong>
          <strong>Amount</strong>
        </div>

        {receipt.items.map((item, i) => (
          <div key={i} className="item-row">
            <span>{item.name}</span>
            <span>{Number(item.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
          </div>
        ))}

        <div className="line" />

        <div className="total-row">
          <strong>TOTAL</strong>
          <strong>{Number(receipt.total).toLocaleString("en-US", { minimumFractionDigits: 2 })} THB</strong>
        </div>

        <div className="line" />

        <div className="info-row"><span>Payment Method</span><span>{receipt.payment_method}</span></div>
        <div className="info-row"><span>Paid Amount</span><span>{Number(receipt.paid_amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></div>
        <div className="info-row"><span>Change</span><span>{Number(receipt.change_amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></div>

        <div className="line" />

        <div className="center">
          <h3>Thank you!</h3>
          <p>Please keep this receipt.</p>
          <p>Line: @kncschool</p>
          <p>--- We wish you a great day! ---</p>
        </div>
      </section>

      <div className="print:hidden flex flex-col gap-2 mt-4 w-full">
        <Button
          size="lg"
          className="w-full gap-2 bg-black hover:bg-gray-800 text-white"
          onClick={() => window.print()}
        >
          <Printer className="w-4 h-4" />
          Print Receipt
        </Button>
        <div className="flex gap-2">
          <Link
            href={`/receipts/${id}/edit`}
            className="flex-1 flex items-center justify-center gap-2 h-11 px-4 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-medium transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Link>
          <Button
            variant="ghost"
            size="lg"
            className="flex-1 gap-2 text-gray-600 hover:bg-gray-100"
            onClick={() => router.push("/receipts")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>
    </main>
  );
}
