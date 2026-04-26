import { useEffect, useMemo, useState } from "react";
import axios from "axios";

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));
}

export default function AdminRevenue() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadRevenue() {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:5000/api/admin/revenue", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setData(res.data);
    } catch (err) {
      console.error("Revenue error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRevenue();
  }, []);

  const stats = useMemo(() => {
    if (!data) return { total: 0, bookings: 0, classes: 0 };

    return {
      total: data.totalRevenue || 0,
      bookings: data.bookingRevenue || 0,
      classes: data.classRevenue || 0,
    };
  }, [data]);

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HERO */}
        <section className="rounded-3xl bg-zinc-950 p-8 text-white shadow-xl">
          <p className="text-sm uppercase tracking-[0.25em] text-rose-300 font-semibold">
            Financial Overview
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Revenue Dashboard
          </h1>

          <p className="mt-3 text-sm text-white/70 max-w-2xl">
            Track total revenue from bookings and classes. Monitor financial
            performance like a real SaaS dashboard.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <StatCard label="Total Revenue" value={stats.total} />
            <StatCard label="Bookings Revenue" value={stats.bookings} />
            <StatCard label="Classes Revenue" value={stats.classes} />
          </div>
        </section>

        {/* DETAILS */}
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            Revenue Details
          </h2>

          {loading ? (
            <p>Loading revenue...</p>
          ) : !data ? (
            <p className="text-zinc-500">No data available</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              <DetailCard title="Total" value={stats.total} />
              <DetailCard title="Bookings" value={stats.bookings} />
              <DetailCard title="Classes" value={stats.classes} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
      <p className="text-xs uppercase tracking-[0.2em] text-white/50">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold">{formatMoney(value)}</p>
    </div>
  );
}

function DetailCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-zinc-200 p-5">
      <p className="text-sm text-zinc-500">{title}</p>
      <p className="mt-2 text-2xl font-bold text-zinc-900">
        {formatMoney(value)}
      </p>
    </div>
  );
}
