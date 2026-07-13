"use client";

import "./receipt.css";

export default function ReceiptPage() {
  return (
    <main className="receipt-page">
      <section className="receipt">
        <div className="center">
          <h1>KNC School</h1>
          <p>Language & Education Center</p>
          <p>Bangkok, Thailand</p>
          <p>Tel: 020339299</p>
        </div>

        <div className="line" />

        <div className="info-row"><span>Receipt No</span><span>R-000123</span></div>
        <div className="info-row"><span>Date</span><span>29/06/2026 14:35</span></div>
        <div className="info-row"><span>Staff</span><span>Admin</span></div>

        <div className="line" />

        <h3>Student Information</h3>
        <div className="info-row"><span>Name</span><span>Mg Mg</span></div>
        <div className="info-row"><span>Phone</span><span>09X-XXX-XXXX</span></div>
        <div className="info-row"><span>Passport No</span><span>MA123456</span></div>
        <div className="info-row"><span>Course</span><span>Thai Course 6 Months</span></div>
        <div className="info-row"><span>Duration</span><span>6 Months</span></div>

        <div className="line" />

        <div className="table-head">
          <strong>Item</strong>
          <strong>Amount</strong>
        </div>

        <div className="item-row"><span>Thai Course 6 Months</span><span>23,000.00</span></div>
        <div className="item-row"><span>Visa Fee</span><span>2,000.00</span></div>

        <div className="line" />

        <div className="total-row">
          <strong>TOTAL</strong>
          <strong>25,000.00 THB</strong>
        </div>

        <div className="line" />

        <div className="info-row"><span>Payment Method</span><span>Cash</span></div>
        <div className="info-row"><span>Paid Amount</span><span>25,000.00</span></div>
        <div className="info-row"><span>Change</span><span>0.00</span></div>

        <div className="line" />

        <div className="center">
          <h3>Thank you!</h3>
          <p>Please keep this receipt.</p>
          <p>Line: @kncschool</p>
          <p>--- We wish you a great day! ---</p>
        </div>
      </section>

      <button className="print-button" onClick={() => window.print()}>
        Print Receipt
      </button>
    </main>
  );
}
