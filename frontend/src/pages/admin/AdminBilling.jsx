import { useEffect, useMemo, useState } from "react";
import {
  createCoupon,
  getAdminBillingHistory,
  refundBilling,
} from "../../api/billingApi";

function formatMoney(value, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: String(currency || "usd").toUpperCase(),
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

function canRefundBill(bill) {
  const status = String(bill.paymentStatus || bill.status || "").toLowerCase();

  return status === "paid" && Boolean(bill.stripePaymentIntentId);
}

export default function AdminBilling() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refundState, setRefundState] = useState({});
  const [refundingId, setRefundingId] = useState("");

  const [couponForm, setCouponForm] = useState({
    code: "",
    type: "percent",
    value: "",
    minAmount: "",
    applicableTo: "all",
  });

  const loadBills = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminBillingHistory();
      setBills(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load admin billing");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  const stats = useMemo(() => {
    const revenue = bills.reduce(
      (sum, item) => sum + Number(item.total || item.amount || 0),
      0,
    );

    const refunded = bills.reduce(
      (sum, item) => sum + Number(item.refundAmount || 0),
      0,
    );

    return {
      records: bills.length,
      revenue,
      refunded,
    };
  }, [bills]);

  const handleRefund = async (bill) => {
    if (!canRefundBill(bill)) {
      alert("Only paid records with a Stripe payment intent can be refunded.");
      return;
    }

    const refundInfo = refundState[bill._id] || {};
    const refundAmount = Number(
      refundInfo.amount || bill.total || bill.amount || 0,
    );
    const reason = refundInfo.reason || "Admin refund";

    if (!refundAmount || refundAmount <= 0) {
      alert("Enter a valid refund amount");
      return;
    }

    const confirmed = window.confirm(
      `Refund ${formatMoney(refundAmount, bill.currency)} for this payment?`,
    );

    if (!confirmed) return;

    try {
      setRefundingId(bill._id);

      await refundBilling(bill._id, {
        refundAmount,
        reason,
      });

      await loadBills();

      alert("Refund completed successfully");
    } catch (error) {
      console.error("Refund failed:", error);
      alert(error?.response?.data?.message || "Refund failed");
    } finally {
      setRefundingId("");
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();

    try {
      await createCoupon({
        code: couponForm.code,
        type: couponForm.type,
        value: Number(couponForm.value || 0),
        minAmount: Number(couponForm.minAmount || 0),
        applicableTo: [couponForm.applicableTo],
      });

      setCouponForm({
        code: "",
        type: "percent",
        value: "",
        minAmount: "",
        applicableTo: "all",
      });

      alert("Coupon created");
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to create coupon");
    }
  };

  if (loading) {
    return <div className="p-6">Loading admin billing...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.22em] text-rose-500">
            Admin Billing
          </p>

          <h1 className="mt-2 text-3xl font-bold text-zinc-900">
            Revenue, coupons, refunds, and Stripe sync
          </h1>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                Records
              </p>
              <p className="mt-2 text-3xl font-bold">{stats.records}</p>
            </div>

            <div className="rounded-2xl border border-zinc-200 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                Revenue
              </p>
              <p className="mt-2 text-3xl font-bold">
                {formatMoney(stats.revenue)}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                Refunded
              </p>
              <p className="mt-2 text-3xl font-bold">
                {formatMoney(stats.refunded)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-zinc-900">Create Coupon</h2>

          <form
            onSubmit={handleCreateCoupon}
            className="mt-5 grid gap-4 md:grid-cols-5"
          >
            <input
              type="text"
              placeholder="Code"
              value={couponForm.code}
              onChange={(e) =>
                setCouponForm((prev) => ({ ...prev, code: e.target.value }))
              }
              className="rounded-xl border border-zinc-300 px-4 py-3"
            />

            <select
              value={couponForm.type}
              onChange={(e) =>
                setCouponForm((prev) => ({ ...prev, type: e.target.value }))
              }
              className="rounded-xl border border-zinc-300 px-4 py-3"
            >
              <option value="percent">Percent</option>
              <option value="fixed">Fixed</option>
            </select>

            <input
              type="number"
              placeholder="Value"
              value={couponForm.value}
              onChange={(e) =>
                setCouponForm((prev) => ({ ...prev, value: e.target.value }))
              }
              className="rounded-xl border border-zinc-300 px-4 py-3"
            />

            <input
              type="number"
              placeholder="Min Amount"
              value={couponForm.minAmount}
              onChange={(e) =>
                setCouponForm((prev) => ({
                  ...prev,
                  minAmount: e.target.value,
                }))
              }
              className="rounded-xl border border-zinc-300 px-4 py-3"
            />

            <select
              value={couponForm.applicableTo}
              onChange={(e) =>
                setCouponForm((prev) => ({
                  ...prev,
                  applicableTo: e.target.value,
                }))
              }
              className="rounded-xl border border-zinc-300 px-4 py-3"
            >
              <option value="all">All</option>
              <option value="booking">Booking</option>
              <option value="class">Class</option>
            </select>

            <button
              type="submit"
              className="rounded-xl bg-zinc-900 px-4 py-3 font-semibold text-white transition hover:bg-rose-600 md:col-span-5"
            >
              Create Coupon
            </button>
          </form>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="border-b border-zinc-200 px-6 py-5">
            <h2 className="text-xl font-bold text-zinc-900">Billing Records</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-500">
                <tr>
                  <th className="px-6 py-4">Invoice</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Refunded</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Stripe PI</th>
                  <th className="px-6 py-4">Refund Action</th>
                </tr>
              </thead>

              <tbody>
                {bills.map((bill) => {
                  const refundable = canRefundBill(bill);
                  const status = String(
                    bill.paymentStatus || bill.status || "pending",
                  ).toLowerCase();

                  return (
                    <tr key={bill._id} className="border-t border-zinc-100">
                      <td className="px-6 py-4 font-medium">
                        {bill.invoiceNumber || bill._id?.slice(-8)}
                      </td>

                      <td className="px-6 py-4">
                        {bill.title || bill.description || "Billing record"}
                      </td>

                      <td className="px-6 py-4 capitalize">
                        {bill.type || "booking"}
                      </td>

                      <td className="px-6 py-4">
                        {formatDate(bill.createdAt)}
                      </td>

                      <td className="px-6 py-4">
                        {formatMoney(bill.total || bill.amount, bill.currency)}
                      </td>

                      <td className="px-6 py-4">
                        {formatMoney(bill.refundAmount, bill.currency)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            status === "refunded"
                              ? "bg-rose-50 text-rose-700"
                              : status === "paid"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-zinc-500">
                        {bill.stripePaymentIntentId
                          ? bill.stripePaymentIntentId.slice(0, 14) + "..."
                          : "Missing"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex min-w-[280px] flex-col gap-2">
                          <input
                            type="number"
                            placeholder="Refund amount"
                            value={
                              refundState[bill._id]?.amount ||
                              (refundable
                                ? Number(bill.total || bill.amount || 0)
                                : "")
                            }
                            onChange={(e) =>
                              setRefundState((prev) => ({
                                ...prev,
                                [bill._id]: {
                                  ...prev[bill._id],
                                  amount: e.target.value,
                                },
                              }))
                            }
                            disabled={!refundable || refundingId === bill._id}
                            className="rounded-xl border border-zinc-300 px-3 py-2 disabled:bg-zinc-100 disabled:text-zinc-400"
                          />

                          <input
                            type="text"
                            placeholder="Refund reason"
                            value={refundState[bill._id]?.reason || ""}
                            onChange={(e) =>
                              setRefundState((prev) => ({
                                ...prev,
                                [bill._id]: {
                                  ...prev[bill._id],
                                  reason: e.target.value,
                                },
                              }))
                            }
                            disabled={!refundable || refundingId === bill._id}
                            className="rounded-xl border border-zinc-300 px-3 py-2 disabled:bg-zinc-100 disabled:text-zinc-400"
                          />

                          <button
                            onClick={() => handleRefund(bill)}
                            disabled={!refundable || refundingId === bill._id}
                            className="rounded-xl bg-rose-600 px-4 py-2 font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
                          >
                            {refundingId === bill._id
                              ? "Refunding..."
                              : status === "refunded"
                                ? "Already Refunded"
                                : !bill.stripePaymentIntentId
                                  ? "Missing Stripe PI"
                                  : status !== "paid"
                                    ? "Not Paid"
                                    : "Refund with Stripe"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {!bills.length && (
              <div className="p-6 text-zinc-500">
                No billing records available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
