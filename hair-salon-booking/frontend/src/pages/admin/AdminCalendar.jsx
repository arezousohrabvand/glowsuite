import { useEffect, useState } from "react";
import { getAdminCalendar } from "../../api/adminApi";

export default function AdminCalendar() {
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [calendarData, setCalendarData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadCalendar() {
    try {
      setLoading(true);
      const data = await getAdminCalendar(view, date);
      setCalendarData(data);
    } catch (error) {
      console.error("Failed to load admin calendar:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCalendar();
  }, [view, date]);

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Admin Calendar</h1>

        <div className="flex gap-3">
          <select
            value={view}
            onChange={(e) => setView(e.target.value)}
            className="rounded border px-4 py-2"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded border px-4 py-2"
          />
        </div>
      </div>

      {loading ? (
        <p>Loading calendar...</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <table className="min-w-full text-left">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Stylist</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {calendarData?.bookings?.map((booking) => (
                <tr key={booking._id} className="border-t">
                  <td className="px-4 py-3">{booking.date || "-"}</td>
                  <td className="px-4 py-3">{booking.time || "-"}</td>
                  <td className="px-4 py-3">
                    {booking.user
                      ? `${booking.user.firstName} ${booking.user.lastName}`
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    {booking.stylist
                      ? `${booking.stylist.firstName} ${booking.stylist.lastName}`
                      : booking.stylistName || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    {booking.service?.name || booking.serviceName || "N/A"}
                  </td>
                  <td className="px-4 py-3">{booking.status}</td>
                </tr>
              ))}

              {calendarData?.bookings?.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
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
