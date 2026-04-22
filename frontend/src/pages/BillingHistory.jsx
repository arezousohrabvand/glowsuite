import { useEffect, useMemo, useState } from "react";
import axios from "axios";

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function statusBadge(status) {
  const value = String(status || "").toLowerCase();

  if (value === "paid") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (value === "failed" || value === "refunded") {
    return "bg-red-100 text-red-700";
  }

  return "bg-amber-100 text-amber-700";
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-zinc-900">{value}</p>
    </div>
  );
}

export default function BillingHistory() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        setLoading(true);
        setError("");

        const rawUserInfo = localStorage.getItem("userInfo");
        const userInfo = rawUserInfo ? JSON.parse(rawUserInfo) : null;

        const token =
          localStorage.getItem("token") ||
          userInfo?.token ||
          userInfo?.accessToken;

        const res = await axios.get(
          "http://localhost:5000/api/billing/my-history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setBills(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Billing fetch error:", err);
        setError(
          err.response?.data?.message || "Failed to load billing history",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBilling();
  }, []);

  const stats = useMemo(() => {
    const totalRecords = bills.length;

    const paidBills = bills.filter(
      (b) => b.paymentStatus === "paid" || b.status === "paid",
    );

    const paidCount = paidBills.length;

    const totalRevenue = paidBills.reduce(
      (sum, bill) => sum + Number(bill.total || bill.amount || 0),
      0,
    );

    return {
      totalRecords,
      paidCount,
      totalRevenue,
    };
  }, [bills]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          Loading billing history...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
            Billing
          </p>
          <h1 className="mt-2 text-3xl font-bold text-zinc-900">
            Billing History & Invoices
          </h1>
          <p className="mt-2 text-zinc-600">
            View your class and booking payments in one place.
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <SummaryCard label="Records" value={stats.totalRecords} />
          <SummaryCard label="Paid" value={stats.paidCount} />
          <SummaryCard label="Revenue" value={money(stats.totalRevenue)} />
        </div>

        {bills.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-zinc-900">
              No invoices yet
            </h2>
            <p className="mt-2 text-zinc-600">
              Once you complete a booking or class payment, it will show here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {bills.map((bill) => (
              <div
                key={bill._id}
                className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                      Invoice
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-zinc-900">
                      {bill.title || "GlowSuite Payment"}
                    </h2>
                    <div className="mt-2 space-y-1 text-sm text-zinc-500">
                      <p>Invoice #: {bill.invoiceNumber || "N/A"}</p>
                      <p>Type: {bill.type || "N/A"}</p>
                      <p>
                        Date:{" "}
                        {bill.createdAt
                          ? new Date(bill.createdAt).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-2 md:items-end">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${statusBadge(
                        bill.paymentStatus || bill.status,
                      )}`}
                    >
                      {bill.paymentStatus || bill.status}
                    </span>
                    <p className="text-2xl font-bold text-zinc-900">
                      {money(bill.total || bill.amount)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl bg-zinc-50 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                      Subtotal
                    </p>
                    <p className="mt-2 text-base font-semibold text-zinc-900">
                      {money(bill.subtotal)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-zinc-50 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                      Tax
                    </p>
                    <p className="mt-2 text-base font-semibold text-zinc-900">
                      {money(bill.taxAmount)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-zinc-50 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                      Discount
                    </p>
                    <p className="mt-2 text-base font-semibold text-zinc-900">
                      -{money(bill.discountAmount)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-zinc-50 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                      Total
                    </p>
                    <p className="mt-2 text-base font-semibold text-zinc-900">
                      {money(bill.total || bill.amount)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-zinc-200 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                      Description
                    </p>
                    <p className="mt-2 text-sm text-zinc-700">
                      {bill.description || "No description"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                      Stripe Reference
                    </p>
                    <div className="mt-2 space-y-1 text-sm text-zinc-700">
                      <p>Session: {bill.stripeSessionId || "N/A"}</p>
                      <p>
                        Payment Intent: {bill.stripePaymentIntentId || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
