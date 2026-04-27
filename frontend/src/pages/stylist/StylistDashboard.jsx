import { useEffect, useState } from "react";
import { getStylistDashboard } from "../../api/stylistApi";

export default function StylistDashboard() {
  const [data, setData] = useState({
    todayBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
    revenue: 0,
    recentBookings: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const result = await getStylistDashboard();
        setData(result);
      } catch (err) {
        console.error("Stylist dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-zinc-500">Loading stylist dashboard...</div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 p-6 md:p-10">
      <div className="mb-8">
        <p className="text-sm font-medium text-rose-500">Stylist Workspace</p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Stylist Dashboard
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Manage your appointments, daily schedule, and completed services.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard
          title="Today"
          value={data.todayBookings}
          subtitle="Bookings today"
        />
        <StatCard
          title="Upcoming"
          value={data.upcomingBookings}
          subtitle="Future appointments"
        />
        <StatCard
          title="Completed"
          value={data.completedBookings}
          subtitle="Finished services"
        />
        <StatCard
          title="Revenue"
          value={`$${data.revenue || 0}`}
          subtitle="Paid bookings"
        />
      </div>

      <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              Recent Bookings
            </h2>
            <p className="text-sm text-zinc-500">
              Your latest assigned appointments.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500">
                <th className="py-3">Customer</th>
                <th className="py-3">Service</th>
                <th className="py-3">Date</th>
                <th className="py-3">Time</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recentBookings?.length > 0 ? (
                data.recentBookings.map((booking) => (
                  <tr key={booking._id} className="border-b border-zinc-100">
                    <td className="py-4 font-medium text-zinc-900">
                      {booking.user?.firstName} {booking.user?.lastName}
                    </td>
                    <td className="py-4 text-zinc-600">
                      {booking.service?.name || booking.serviceName}
                    </td>
                    <td className="py-4 text-zinc-600">{booking.date}</td>
                    <td className="py-4 text-zinc-600">{booking.time}</td>
                    <td className="py-4">
                      <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600">
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-6 text-zinc-500" colSpan="5">
                    No bookings assigned yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-zinc-500">{title}</p>
      <h3 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
        {value}
      </h3>
      <p className="mt-2 text-sm text-zinc-500">{subtitle}</p>
    </div>
  );
}
