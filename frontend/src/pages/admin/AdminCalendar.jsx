import { useEffect, useMemo, useState } from "react";
import { getAdminCalendar } from "../../api/adminApi";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

function StatusBadge({ value }) {
  const status = String(value || "").toLowerCase();

  const styles =
    status === "confirmed" || status === "upcoming"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
      : status === "pending"
        ? "bg-amber-50 text-amber-700 ring-amber-100"
        : "bg-zinc-50 text-zinc-700 ring-zinc-100";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${styles}`}
    >
      {value || "Unknown"}
    </span>
  );
}

export default function AdminCalendar() {
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [calendarData, setCalendarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

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

  const bookings = useMemo(() => {
    return (calendarData?.bookings || []).filter((booking) => {
      const validStatus = ["Pending", "Upcoming", "Confirmed"].includes(
        booking.status,
      );

      const hasCustomer = Boolean(booking.user);

      return validStatus && hasCustomer;
    });
  }, [calendarData]);

  const events = bookings.map((booking) => {
    const start = booking.slotStart || `${booking.date} ${booking.time}`;

    return {
      id: booking._id,
      title: `${booking.service?.name || booking.serviceName || "Appointment"} — ${
        booking.user
          ? `${booking.user.firstName || ""} ${booking.user.lastName || ""}`.trim()
          : "Customer"
      }`,
      start,
      extendedProps: { booking },
    };
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "Pending").length,
    upcoming: bookings.filter(
      (b) => b.status === "Upcoming" || b.status === "Confirmed",
    ).length,
  };

  const calendarView =
    view === "day"
      ? "timeGridDay"
      : view === "week"
        ? "timeGridWeek"
        : "dayGridMonth";

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl bg-zinc-950 p-8 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-300">
            Salon Schedule
          </p>

          <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Admin Calendar
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                See pending and upcoming appointments in a real calendar view,
                plus a detailed appointment list.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <select
                value={view}
                onChange={(e) => setView(e.target.value)}
                className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white outline-none"
              >
                <option className="text-zinc-900" value="day">
                  Day
                </option>
                <option className="text-zinc-900" value="week">
                  Week
                </option>
                <option className="text-zinc-900" value="month">
                  Month
                </option>
              </select>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white outline-none"
              />
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                Active
              </p>
              <p className="mt-2 text-3xl font-bold">{stats.total}</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                Pending
              </p>
              <p className="mt-2 text-3xl font-bold">{stats.pending}</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                Upcoming
              </p>
              <p className="mt-2 text-3xl font-bold">{stats.upcoming}</p>
            </div>
          </div>
        </section>

        {loading ? (
          <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-zinc-200">
            Loading calendar...
          </section>
        ) : (
          <>
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
              <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900">
                    Calendar View
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    {formatDate(calendarData?.startDate)} —{" "}
                    {formatDate(calendarData?.endDate)}
                  </p>
                </div>

                <span className="w-fit rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 ring-1 ring-rose-100">
                  {view.toUpperCase()} VIEW
                </span>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-3">
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView={calendarView}
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                  }}
                  events={events}
                  height="auto"
                  eventClick={(info) => {
                    setSelectedBooking(info.event.extendedProps.booking);
                  }}
                />
              </div>
            </section>

            {selectedBooking && (
              <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
                      Selected Appointment
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-zinc-900">
                      {selectedBooking.service?.name ||
                        selectedBooking.serviceName ||
                        "Appointment"}
                    </h2>
                    <p className="mt-2 text-sm text-zinc-500">
                      {selectedBooking.date} • {selectedBooking.time}
                    </p>
                  </div>

                  <StatusBadge value={selectedBooking.status} />
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-zinc-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                      Customer
                    </p>
                    <p className="mt-2 font-semibold text-zinc-900">
                      {selectedBooking.user
                        ? `${selectedBooking.user.firstName || ""} ${
                            selectedBooking.user.lastName || ""
                          }`.trim()
                        : "N/A"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-zinc-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                      Stylist
                    </p>
                    <p className="mt-2 font-semibold text-zinc-900">
                      {selectedBooking.stylist
                        ? `${selectedBooking.stylist.firstName || ""} ${
                            selectedBooking.stylist.lastName || ""
                          }`.trim()
                        : selectedBooking.stylistName || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-zinc-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                      Booking ID
                    </p>
                    <p className="mt-2 font-semibold text-zinc-900">
                      {String(selectedBooking._id).slice(-8)}
                    </p>
                  </div>
                </div>
              </section>
            )}

            <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-200">
              <div className="border-b border-zinc-200 px-6 py-5">
                <h2 className="text-xl font-bold text-zinc-900">
                  Upcoming Appointment List
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  {bookings.length} active appointments found
                </p>
              </div>

              <div className="divide-y divide-zinc-100">
                {bookings.map((booking) => (
                  <button
                    key={booking._id}
                    onClick={() => setSelectedBooking(booking)}
                    className="grid w-full gap-4 px-6 py-5 text-left transition hover:bg-zinc-50 lg:grid-cols-[1fr_1fr_1.2fr_1.2fr_1.2fr_140px]"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                        Date
                      </p>
                      <p className="mt-2 font-semibold text-zinc-900">
                        {booking.date || formatDate(booking.slotStart)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                        Time
                      </p>
                      <p className="mt-2 font-semibold text-zinc-900">
                        {booking.time || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                        Customer
                      </p>
                      <p className="mt-2 font-semibold text-zinc-900">
                        {`${booking.user.firstName || ""} ${
                          booking.user.lastName || ""
                        }`.trim()}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                        Stylist
                      </p>
                      <p className="mt-2 font-semibold text-zinc-900">
                        {booking.stylist
                          ? `${booking.stylist.firstName || ""} ${
                              booking.stylist.lastName || ""
                            }`.trim()
                          : booking.stylistName || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                        Service
                      </p>
                      <p className="mt-2 font-semibold text-zinc-900">
                        {booking.service?.name || booking.serviceName || "N/A"}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <StatusBadge value={booking.status} />
                    </div>
                  </button>
                ))}

                {bookings.length === 0 && (
                  <div className="px-6 py-16 text-center">
                    <p className="text-lg font-semibold text-zinc-900">
                      No active appointments found
                    </p>
                    <p className="mt-2 text-sm text-zinc-500">
                      Pending and upcoming appointments will appear here.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
