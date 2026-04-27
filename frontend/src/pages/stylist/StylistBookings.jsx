import { useEffect, useState } from "react";
import {
  getStylistBookings,
  updateStylistBookingStatus,
} from "../../api/stylistApi";

export default function StylistBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      const data = await getStylistBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Stylist bookings error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await updateStylistBookingStatus(bookingId, status);
      await loadBookings();
    } catch (err) {
      console.error("Update booking status error:", err);
    }
  };

  if (loading) {
    return <div className="p-8 text-zinc-500">Loading bookings...</div>;
  }

  return (
    <div className="min-h-screen bg-stone-50 p-6 md:p-10">
      <div className="mb-8">
        <p className="text-sm font-medium text-rose-500">Appointments</p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          My Bookings
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Confirm, complete, or cancel your assigned appointments.
        </p>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500">
                <th className="py-3">Customer</th>
                <th className="py-3">Service</th>
                <th className="py-3">Date</th>
                <th className="py-3">Time</th>
                <th className="py-3">Payment</th>
                <th className="py-3">Status</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
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
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                        {booking.paymentStatus || "unpaid"}
                      </span>
                    </td>

                    <td className="py-4">
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                        {booking.status}
                      </span>
                    </td>

                    <td className="py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleStatusUpdate(booking._id, "Confirmed")
                          }
                          className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700"
                        >
                          Confirm
                        </button>

                        <button
                          onClick={() =>
                            handleStatusUpdate(booking._id, "Completed")
                          }
                          className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                        >
                          Complete
                        </button>

                        <button
                          onClick={() =>
                            handleStatusUpdate(booking._id, "Cancelled")
                          }
                          className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-6 text-zinc-500" colSpan="7">
                    No bookings assigned to you yet.
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
