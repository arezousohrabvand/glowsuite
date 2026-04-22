import { useEffect, useState } from "react";
import { getAdminBookings, updateAdminBookingStatus } from "../../api/adminApi";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadBookings() {
    try {
      setLoading(true);
      const data = await getAdminBookings(statusFilter);
      setBookings(data);
    } catch (error) {
      console.error("Failed to load admin bookings:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, [statusFilter]);

  async function handleStatusChange(bookingId, status) {
    try {
      await updateAdminBookingStatus(bookingId, status);
      await loadBookings();
    } catch (error) {
      console.error("Failed to update booking status:", error);
      alert(error.response?.data?.message || "Failed to update booking");
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Manage Bookings</h1>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-zinc-300 px-4 py-2"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <p>Loading bookings...</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <table className="min-w-full text-left">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Stylist</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-t">
                  <td className="px-4 py-3">
                    {booking.user
                      ? `${booking.user.firstName} ${booking.user.lastName}`
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    {booking.serviceName || booking.service?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    {booking.stylist
                      ? `${booking.stylist.firstName} ${booking.stylist.lastName}`
                      : booking.stylistName || "N/A"}
                  </td>
                  <td className="px-4 py-3">{booking.date}</td>
                  <td className="px-4 py-3">{booking.time}</td>
                  <td className="px-4 py-3">{booking.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          handleStatusChange(booking._id, "Confirmed")
                        }
                        className="rounded bg-emerald-600 px-3 py-1 text-white"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          handleStatusChange(booking._id, "Cancelled")
                        }
                        className="rounded bg-red-600 px-3 py-1 text-white"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={() =>
                          handleStatusChange(booking._id, "Completed")
                        }
                        className="rounded bg-blue-600 px-3 py-1 text-white"
                      >
                        Complete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {bookings.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-6 text-center text-zinc-500"
                  >
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
