import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminStats } from "../../api/adminApi";

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

  if (loading) {
    return <div className="p-6">Loading admin dashboard...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
        <StatCard title="Total Users" value={stats?.totalUsers || 0} />
        <StatCard title="Total Bookings" value={stats?.totalBookings || 0} />
        <StatCard title="Total Services" value={stats?.totalServices || 0} />
        <StatCard
          title="Pending Bookings"
          value={stats?.pendingBookings || 0}
        />
        <StatCard
          title="Upcoming Bookings"
          value={stats?.upcomingBookings || 0}
        />
        <StatCard
          title="Confirmed Bookings"
          value={stats?.confirmedBookings || 0}
        />
        <StatCard
          title="Completed Bookings"
          value={stats?.completedBookings || 0}
        />
        <StatCard
          title="Cancelled Bookings"
          value={stats?.cancelledBookings || 0}
        />
        <StatCard title="Customers" value={stats?.totalCustomers || 0} />
        <StatCard title="Stylists" value={stats?.totalStylists || 0} />
        <StatCard title="Instructors" value={stats?.totalInstructors || 0} />
        <StatCard title="Admins" value={stats?.totalAdmins || 0} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminNavCard
          title="Manage Bookings"
          description="Approve, cancel, and complete customer bookings"
          to="/admin/bookings"
        />
        <AdminNavCard
          title="Manage Services"
          description="Create, edit, and delete salon services"
          to="/admin/services"
        />
        <AdminNavCard
          title="Manage Users"
          description="Change user roles to stylist, admin, or instructor"
          to="/admin/users"
        />
        <AdminNavCard
          title="Admin Calendar"
          description="See day, week, and month booking view"
          to="/admin/calendar"
        />
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-zinc-500">{title}</p>
      <h3 className="mt-2 text-3xl font-bold text-zinc-900">{value}</h3>
    </div>
  );
}

function AdminNavCard({ title, description, to }) {
  return (
    <Link
      to={to}
      className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <h3 className="text-xl font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600">{description}</p>
    </Link>
  );
}
