import { useEffect, useMemo, useState } from "react";
import { getAdminEnrollments } from "../../api/adminApi";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

function StatusBadge({ value }) {
  const status = String(value || "unknown").toLowerCase();

  const styles =
    status === "paid"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
      : status === "pending" || status === "unpaid"
        ? "bg-amber-50 text-amber-700 ring-amber-100"
        : status === "refunded" || status === "cancelled"
          ? "bg-rose-50 text-rose-700 ring-rose-100"
          : "bg-zinc-50 text-zinc-700 ring-zinc-100";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${styles}`}
    >
      {value || "Unknown"}
    </span>
  );
}

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadEnrollments() {
    try {
      const data = await getAdminEnrollments();

      const cleanData = Array.isArray(data)
        ? data.filter((item) => item.customer && item.classItem)
        : [];

      setEnrollments(cleanData);
    } catch (error) {
      console.error("Failed to load enrollments:", error);
      alert(error.response?.data?.message || "Failed to load enrollments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEnrollments();
  }, []);

  const stats = useMemo(() => {
    const total = enrollments.length;
    const paid = enrollments.filter((e) => e.paymentStatus === "paid").length;
    const pending = enrollments.filter(
      (e) => e.paymentStatus === "unpaid",
    ).length;
    const revenue = enrollments
      .filter((e) => e.paymentStatus === "paid")
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    return { total, paid, pending, revenue };
  }, [enrollments]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 p-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          Loading class enrollments...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-3xl bg-zinc-950 p-8 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-300">
            Admin Classes
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Class Enrollments
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
            Track every customer enrolled in GlowSuite classes, monitor payment
            status, and review class demand from one clean dashboard.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                Total
              </p>
              <p className="mt-2 text-3xl font-bold">{stats.total}</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                Paid
              </p>
              <p className="mt-2 text-3xl font-bold">{stats.paid}</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                Pending
              </p>
              <p className="mt-2 text-3xl font-bold">{stats.pending}</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                Revenue
              </p>
              <p className="mt-2 text-3xl font-bold">${stats.revenue}</p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-200">
          <div className="border-b border-zinc-200 px-6 py-5">
            <h2 className="text-xl font-bold text-zinc-900">
              Enrollment Records
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Customer, class, payment, and enrollment status.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Class</th>
                  <th className="px-6 py-4">Schedule</th>
                  <th className="px-6 py-4">Enrollment</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Amount</th>
                </tr>
              </thead>

              <tbody>
                {enrollments.map((item) => (
                  <tr key={item._id} className="border-t border-zinc-100">
                    <td className="px-6 py-5">
                      <p className="font-semibold text-zinc-900">
                        {`${item.customer.firstName || ""} ${item.customer.lastName || ""}`.trim()}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {item.customer.email || "No email"}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-semibold text-zinc-900">
                        {item.classItem.title}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Capacity: {item.classItem.capacity || "—"}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-zinc-600">
                      <p>{formatDate(item.classItem.date)}</p>
                      <p className="mt-1 text-xs">
                        {item.classItem.time || "—"}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge value={item.status} />
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge value={item.paymentStatus} />
                    </td>

                    <td className="px-6 py-5 font-bold text-zinc-900">
                      ${Number(item.amount || 0)}
                    </td>
                  </tr>
                ))}

                {enrollments.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <p className="text-lg font-semibold text-zinc-900">
                        No valid class enrollments yet
                      </p>
                      <p className="mt-2 text-sm text-zinc-500">
                        Broken records with missing customer or class are
                        hidden.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
