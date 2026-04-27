import { useEffect, useState } from "react";
import { getAdminBookings, updateAdminBookingStatus } from "../../api/adminApi";

function formatBookingDate(booking) {
  if (booking.date) return booking.date;

  if (booking.slotStart) {
    const d = new Date(booking.slotStart);
    if (!Number.isNaN(d.getTime())) return d.toLocaleDateString();
  }

  return "-";
}

function formatBookingTime(booking) {
  if (booking.time) return booking.time;

  if (booking.slotStart) {
    const d = new Date(booking.slotStart);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    }
  }

  return "-";
}

function getCustomerName(booking) {
  if (booking.user) {
    return `${booking.user.firstName || ""} ${booking.user.lastName || ""}`.trim();
  }

  return booking.customerName || booking.fullName || "N/A";
}

function getStylistName(booking) {
  if (booking.stylist) {
    return `${booking.stylist.firstName || ""} ${booking.stylist.lastName || ""}`.trim();
  }

  return booking.stylistName || "N/A";
}

function getServiceName(booking) {
  return booking.serviceName || booking.service?.name || "N/A";
}

function getStatusBadgeClass(status) {
  const normalized = String(status || "").toLowerCase();

  if (normalized === "pending") return "bg-amber-50 text-amber-700";
  if (normalized === "upcoming") return "bg-blue-50 text-blue-700";

  return "bg-zinc-100 text-zinc-700";
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");

  async function loadBookings() {
    try {
      setLoading(true);

      const data = await getAdminBookings(statusFilter);
      const cleanData = Array.isArray(data) ? data : [];

      const visibleBookings = cleanData.filter((booking) => {
        const status = String(booking.status || "pending").toLowerCase();
        const filter = String(statusFilter || "").toLowerCase();

        if (filter === "pending") return status === "pending";
        if (filter === "upcoming") return status === "upcoming";

        // Active Bookings means pending only
        return status === "pending";
      });

      setBookings(visibleBookings);
    } catch (error) {
      console.error("Failed to load admin bookings:", error);
      alert(error.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, [statusFilter]);

  async function handleStatusChange(bookingId, status) {
    try {
      setUpdatingId(bookingId);
      await updateAdminBookingStatus(bookingId, status);
      await loadBookings();
    } catch (error) {
      console.error("Failed to update booking status:", error);
      alert(error.response?.data?.message || "Failed to update booking");
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-zinc-900">Manage Bookings</h1>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900"
        >
          <option value="">Active Bookings</option>
          <option value="Pending">Pending</option>
          <option value="Upcoming">Upcoming</option>
        </select>
      </div>

      {loading ? (
        <p className="text-zinc-600">Loading bookings...</p>
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
              {bookings.map((booking) => {
                const status = booking.status || "Pending";
                const normalizedStatus = String(status).toLowerCase();
                const isUpdating = updatingId === booking._id;

                const canApprove = normalizedStatus === "pending";
                const canCancel =
                  normalizedStatus === "pending" ||
                  normalizedStatus === "upcoming";

                return (
                  <tr key={booking._id} className="border-t border-zinc-200">
                    <td className="px-4 py-3">{getCustomerName(booking)}</td>
                    <td className="px-4 py-3">{getServiceName(booking)}</td>
                    <td className="px-4 py-3">{getStylistName(booking)}</td>
                    <td className="px-4 py-3">{formatBookingDate(booking)}</td>
                    <td className="px-4 py-3">{formatBookingTime(booking)}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                          status,
                        )}`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {canApprove && (
                          <button
                            onClick={() =>
                              handleStatusChange(booking._id, "Confirmed")
                            }
                            disabled={isUpdating}
                            className="rounded bg-emerald-600 px-3 py-1 text-white disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {isUpdating ? "Saving..." : "Approve"}
                          </button>
                        )}

                        {canCancel && (
                          <button
                            onClick={() =>
                              handleStatusChange(booking._id, "Cancelled")
                            }
                            disabled={isUpdating}
                            className="rounded bg-red-600 px-3 py-1 text-white disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {isUpdating ? "Saving..." : "Cancel"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

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
