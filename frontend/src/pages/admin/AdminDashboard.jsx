import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import { getAdminStats } from "../../api/adminApi";

function formatDateTime(booking) {
  if (booking.slotStart) {
    const d = new Date(booking.slotStart);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleString([], {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit",
      });
    }
  }

  return `${booking.date || "-"}${booking.time ? ` • ${booking.time}` : ""}`;
}

function getCustomerName(booking) {
  if (booking.user) {
    return `${booking.user.firstName || ""} ${booking.user.lastName || ""}`.trim();
  }

  return booking.customerName || booking.fullName || "Customer";
}

function getStylistName(booking) {
  if (booking.stylist) {
    return `${booking.stylist.firstName || ""} ${booking.stylist.lastName || ""}`.trim();
  }

  return booking.stylistName || "Stylist";
}

function getServiceName(booking) {
  return booking.service?.name || booking.serviceName || "Service";
}

function StatusBadge({ status }) {
  const normalized = String(status || "").toLowerCase();

  let classes = "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ";

  if (
    normalized === "paid" ||
    normalized === "completed" ||
    normalized === "confirmed"
  ) {
    classes += "bg-emerald-100 text-emerald-700";
  } else if (normalized === "pending" || normalized === "upcoming") {
    classes += "bg-amber-100 text-amber-700";
  } else if (
    normalized === "cancelled" ||
    normalized === "failed" ||
    normalized === "refunded"
  ) {
    classes += "bg-red-100 text-red-700";
  } else {
    classes += "bg-zinc-100 text-zinc-700";
  }

  return <span className={classes}>{status || "Unknown"}</span>;
}

function StatCard({ title, value, hint }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-2 text-3xl font-bold text-slate-900">{value}</h3>
      {hint ? <p className="mt-2 text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}

function ManagementCard({ title, description, to }) {
  return (
    <Link
      to={to}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load admin stats:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const upcomingApprovedBookings = useMemo(() => {
    const bookings = stats?.upcomingBookingsList || stats?.recentBookings || [];

    return bookings.filter((booking) => {
      const allowed = ["Upcoming", "Confirmed"].includes(booking.status);

      const bookingDate = booking.slotStart
        ? new Date(booking.slotStart)
        : booking.date
          ? new Date(booking.date)
          : null;

      const isFuture =
        !bookingDate || Number.isNaN(bookingDate.getTime())
          ? true
          : bookingDate >= new Date(new Date().setHours(0, 0, 0, 0));

      return allowed && isFuture;
    });
  }, [stats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
          <div className="h-[500px] rounded-3xl bg-white shadow-sm" />
          <div className="space-y-6">
            <div className="h-40 rounded-3xl bg-white shadow-sm" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="h-28 rounded-3xl bg-white shadow-sm" />
              <div className="h-28 rounded-3xl bg-white shadow-sm" />
              <div className="h-28 rounded-3xl bg-white shadow-sm" />
              <div className="h-28 rounded-3xl bg-white shadow-sm" />
            </div>
            <div className="h-72 rounded-3xl bg-white shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:px-8 lg:grid-cols-[280px_1fr]">
        <Sidebar />

        <main className="space-y-6">
          <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-pink-100 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-rose-100 blur-3xl" />

            <div className="relative grid gap-6 p-6 lg:grid-cols-[1.3fr_0.7fr] lg:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-500">
                  GlowSuite Admin
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                  Admin Dashboard
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                  Manage approved appointments, operations, services, customers,
                  and business activity from one clean workspace.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/admin/bookings"
                    className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-600"
                  >
                    Manage Bookings
                  </Link>
                  <Link
                    to="/admin/customers"
                    className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-900"
                  >
                    Customers
                  </Link>
                  <Link
                    to="/admin/services"
                    className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-900"
                  >
                    Services
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Today Focus
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    Approved Upcoming Appointments
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Active Customers
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {stats?.totalCustomers || 0}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Service Catalog
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {stats?.totalServices || 0} services
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Upcoming Approved"
              value={
                (stats?.upcomingBookings || 0) + (stats?.confirmedBookings || 0)
              }
              hint="Upcoming + Confirmed"
            />
            <StatCard
              title="Completed"
              value={stats?.completedBookings || 0}
              hint="Finished appointments"
            />
            <StatCard
              title="Customers"
              value={stats?.totalCustomers || 0}
              hint="Registered clients"
            />
            <StatCard
              title="Services"
              value={stats?.totalServices || 0}
              hint="Active service catalog"
            />
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">
                    Upcoming Approved Bookings
                  </h2>
                  <Link
                    to="/admin/bookings"
                    className="text-sm font-medium text-pink-600 hover:underline"
                  >
                    View all
                  </Link>
                </div>

                {upcomingApprovedBookings.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No upcoming approved bookings yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {upcomingApprovedBookings.map((booking) => (
                      <div
                        key={booking._id}
                        className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">
                            {getCustomerName(booking)}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            {getServiceName(booking)} •{" "}
                            {getStylistName(booking)}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-700">
                            {formatDateTime(booking)}
                          </p>
                          <div className="mt-2">
                            <StatusBadge status={booking.status} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">
                  Quick Management
                </h2>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <ManagementCard
                    title="Manage Bookings"
                    description="Approve, confirm, complete, cancel, and review bookings."
                    to="/admin/bookings"
                  />
                  <ManagementCard
                    title="Manage Customers"
                    description="View customer accounts, profiles, and activity."
                    to="/admin/customers"
                  />
                  <ManagementCard
                    title="Manage Services"
                    description="Create, edit, and remove salon services."
                    to="/admin/services"
                  />
                  <ManagementCard
                    title="Manage Classes"
                    description="Create classes and review enrollments."
                    to="/admin/classes"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">
                  Admin Actions
                </h2>

                <div className="mt-4 grid gap-3">
                  <Link
                    to="/admin/users"
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Manage User Roles
                  </Link>
                  <Link
                    to="/admin/calendar"
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Open Admin Calendar
                  </Link>
                  <Link
                    to="/admin/billing"
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Review Billing History
                  </Link>
                  <Link
                    to="/admin/revenue"
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Revenue Overview
                  </Link>
                </div>

                <div className="mt-6 rounded-2xl bg-gradient-to-br from-pink-600 to-rose-500 p-5 text-white">
                  <p className="text-xs uppercase tracking-[0.18em] text-pink-100">
                    Admin Note
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/90">
                    Focus on confirmed and upcoming bookings first so the daily
                    schedule stays clean and operational.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
