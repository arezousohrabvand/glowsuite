import { useEffect, useMemo, useState } from "react";
import { getBillingHistory } from "../api/billingApi";

const DEFAULT_TAX_RATE = 0.0825;

function formatMoney(value, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: String(currency || "usd").toUpperCase(),
  }).format(Number(value || 0));
}

function formatDate(date) {
  return date ? new Date(date).toLocaleDateString() : "—";
}

function getTitle(bill) {
  return bill.title || bill.description || bill.type || "Billing Record";
}

function getCurrency(bill) {
  return String(bill.currency || "usd").toLowerCase();
}

function getSubtotal(bill) {
  return Number(bill.subtotal ?? bill.amount ?? 0);
}

function getTaxAmount(bill) {
  return Number(bill.taxAmount ?? 0);
}

function getDiscountAmount(bill) {
  return Number(bill.discountAmount ?? 0);
}

function getRefundAmount(bill) {
  return Number(bill.refundAmount ?? 0);
}

function getTotal(bill) {
  if (bill.total !== undefined && bill.total !== null) {
    return Number(bill.total || 0);
  }

  const subtotal = getSubtotal(bill);
  const tax = getTaxAmount(bill);
  const discount = getDiscountAmount(bill);

  return subtotal + tax - discount;
}

function getNetPaid(bill) {
  return Math.max(getTotal(bill) - getRefundAmount(bill), 0);
}

function getPaymentStatus(bill) {
  return String(bill.paymentStatus || bill.status || "unknown").toLowerCase();
}

function getTaxRate(bill) {
  if (bill.taxRate !== undefined && bill.taxRate !== null) {
    return Number(bill.taxRate || 0);
  }

  const subtotal = getSubtotal(bill);
  const taxAmount = getTaxAmount(bill);

  if (subtotal > 0 && taxAmount > 0) {
    return taxAmount / subtotal;
  }

  return DEFAULT_TAX_RATE;
}

function StatusBadge({ status }) {
  const map = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    failed: "bg-red-100 text-red-700",
    refunded: "bg-blue-100 text-blue-700",
    cancelled: "bg-zinc-200 text-zinc-700",
    unknown: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        map[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

function BillingCard({ bill }) {
  const currency = getCurrency(bill);
  const subtotal = getSubtotal(bill);
  const taxAmount = getTaxAmount(bill);
  const discountAmount = getDiscountAmount(bill);
  const refundAmount = getRefundAmount(bill);
  const total = getTotal(bill);
  const netPaid = getNetPaid(bill);
  const paymentStatus = getPaymentStatus(bill);
  const taxRate = getTaxRate(bill);
  const isRefunded = paymentStatus === "refunded";

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-bold text-zinc-900">{getTitle(bill)}</h3>
          <p className="text-sm text-zinc-500">
            {formatDate(bill.createdAt)} • Invoice {bill.invoiceNumber || "—"}
          </p>
        </div>

        <StatusBadge status={paymentStatus} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-5">
        <div className="rounded-xl bg-zinc-50 p-3">
          <p className="text-xs text-zinc-400">Subtotal</p>
          <p className="mt-1 font-semibold text-zinc-900">
            {formatMoney(subtotal, currency)}
          </p>
        </div>

        <div className="rounded-xl bg-zinc-50 p-3">
          <p className="text-xs text-zinc-400">
            Tax ({(taxRate * 100).toFixed(2)}%)
          </p>
          <p className="mt-1 font-semibold text-zinc-900">
            {formatMoney(taxAmount, currency)}
          </p>
        </div>

        <div className="rounded-xl bg-zinc-50 p-3">
          <p className="text-xs text-zinc-400">Discount</p>
          <p className="mt-1 font-semibold text-zinc-900">
            {discountAmount > 0
              ? `-${formatMoney(discountAmount, currency)}`
              : formatMoney(0, currency)}
          </p>
        </div>

        <div className="rounded-xl bg-zinc-50 p-3">
          <p className="text-xs text-zinc-400">Charged</p>
          <p className="mt-1 text-lg font-bold text-zinc-900">
            {formatMoney(total, currency)}
          </p>
        </div>

        <div className="rounded-xl bg-zinc-50 p-3">
          <p className="text-xs text-zinc-400">
            {isRefunded ? "Net After Refund" : "Net Paid"}
          </p>
          <p className="mt-1 text-lg font-bold text-zinc-900">
            {formatMoney(netPaid, currency)}
          </p>
        </div>
      </div>

      {isRefunded && (
        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.18em] text-blue-500">
            Refund Details
          </p>
          <div className="mt-2 grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-sm text-blue-700">
                Refunded Amount:{" "}
                <span className="font-semibold">
                  {formatMoney(refundAmount, currency)}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-blue-700 break-all">
                Refund Reference:{" "}
                <span className="font-semibold">
                  {bill.stripeRefundId || "N/A"}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-zinc-50 p-3">
          <p className="text-xs text-zinc-400">Payment Status</p>
          <p className="mt-1 font-semibold text-zinc-900">
            {bill.paymentStatus || bill.status || "unknown"}
          </p>
        </div>

        <div className="rounded-xl bg-zinc-50 p-3">
          <p className="text-xs text-zinc-400">Stripe Session</p>
          <p className="mt-1 break-all text-sm font-medium text-zinc-900">
            {bill.stripeSessionId || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Billing() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getBillingHistory();
        setBills(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to load billing history",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = useMemo(() => {
    const totalCharged = bills.reduce((sum, bill) => sum + getTotal(bill), 0);
    const totalRefunded = bills.reduce(
      (sum, bill) => sum + getRefundAmount(bill),
      0,
    );
    const netRevenue = totalCharged - totalRefunded;

    return {
      totalRecords: bills.length,
      paidCount: bills.filter((bill) => getPaymentStatus(bill) === "paid")
        .length,
      refundedCount: bills.filter(
        (bill) => getPaymentStatus(bill) === "refunded",
      ).length,
      totalCharged,
      totalRefunded,
      netRevenue,
    };
  }, [bills]);

  if (loading) {
    return <div className="p-10 text-zinc-600">Loading billing...</div>;
  }

  if (error) {
    return <div className="p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="mx-auto max-w-6xl p-8">
      <h1 className="mb-6 text-3xl font-bold text-zinc-900">
        Billing & Payments
      </h1>

      <div className="mb-8 grid gap-4 md:grid-cols-5">
        <div className="rounded-2xl bg-white p-4 shadow">
          <p className="text-sm text-zinc-400">Records</p>
          <p className="text-2xl font-bold text-zinc-900">
            {stats.totalRecords}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow">
          <p className="text-sm text-zinc-400">Paid</p>
          <p className="text-2xl font-bold text-zinc-900">{stats.paidCount}</p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow">
          <p className="text-sm text-zinc-400">Refunded</p>
          <p className="text-2xl font-bold text-zinc-900">
            {stats.refundedCount}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow">
          <p className="text-sm text-zinc-400">Charged</p>
          <p className="text-2xl font-bold text-zinc-900">
            {formatMoney(stats.totalCharged)}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow">
          <p className="text-sm text-zinc-400">Net Revenue</p>
          <p className="text-2xl font-bold text-zinc-900">
            {formatMoney(stats.netRevenue)}
          </p>
        </div>
      </div>

      {stats.totalRefunded > 0 && (
        <div className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-800">
          Total Refunded:{" "}
          <span className="font-semibold">
            {formatMoney(stats.totalRefunded)}
          </span>
        </div>
      )}

      {bills.length === 0 ? (
        <div className="text-center text-zinc-500">No billing records yet</div>
      ) : (
        <div className="space-y-4">
          {bills.map((bill) => (
            <BillingCard key={bill._id} bill={bill} />
          ))}
        </div>
      )}
    </div>
  );
}
