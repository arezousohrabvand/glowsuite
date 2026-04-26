import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyBookings, cancelBooking } from "../api/bookingApi";

function getUserDisplayStatus(status) {
  const normalized = String(status || "pending").toLowerCase();

  if (normalized === "upcoming") return "Confirmed";
  if (normalized === "confirmed") return "Confirmed";
  if (normalized === "pending") return "Pending";
  if (normalized === "completed") return "Completed";
  if (normalized === "cancelled" || normalized === "canceled")
    return "Cancelled";

  return "Pending";
}

function StatusBadge({ status }) {
  const displayStatus = getUserDisplayStatus(status);

  const styles = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Completed: "bg-zinc-100 text-zinc-700 border-zinc-200",
    Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        styles[displayStatus] || "bg-zinc-100 text-zinc-700 border-zinc-200"
      }`}
    >
      {displayStatus}
    </span>
  );
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-xl bg-zinc-50 px-4 py-3 ring-1 ring-zinc-100">
      <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-zinc-900">{value}</p>
    </div>
  );
}

function SectionHeader({ title, count, subtitle }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-zinc-900">{title}</h2>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
          {count}
        </span>
      </div>
      {subtitle ? <p className="mt-2 text-zinc-600">{subtitle}</p> : null}
    </div>
  );
}

function BookingCard({ booking, onCancel, onReschedule, actionLoadingId }) {
  const displayStatus = getUserDisplayStatus(booking.status);
  const isCompleted = booking.status === "Completed";
  const isCancelled = booking.status === "Cancelled";
  const paymentStatus = String(booking.paymentStatus || "").toLowerCase();

  const canPay =
    !["paid", "processing"].includes(paymentStatus) && !isCancelled;
  const disableReschedule = isCompleted || isCancelled;
  const disableCancel = isCompleted || isCancelled;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-500">
            Appointment
          </p>

          <h3 className="mt-1 text-2xl font-semibold text-zinc-900">
            {booking.serviceName || "Service"}
          </h3>

          <p className="mt-1 text-sm text-zinc-500">
            Created{" "}
            {booking.createdAt
              ? new Date(booking.createdAt).toLocaleDateString()
              : "recently"}
          </p>
        </div>

        <StatusBadge status={booking.status} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <InfoTile
          label="Stylist"
          value={booking.stylistName || "Not assigned"}
        />
        <InfoTile label="Date" value={booking.date || "Not scheduled"} />
        <InfoTile label="Time" value={booking.time || "Not scheduled"} />
        <InfoTile
          label="Price"
          value={`$${Number(booking.price || 0).toFixed(2)}`}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <InfoTile
          label="Payment Status"
          value={booking.paymentStatus || "Unpaid"}
        />
        <InfoTile label="Booking Status" value={displayStatus} />
        <InfoTile label="Booking ID" value={booking._id?.slice(-8) || "—"} />
        <InfoTile
          label="Amount Due"
          value={
            paymentStatus === "paid"
              ? "$0.00"
              : `$${Number(booking.price || 0).toFixed(2)}`
          }
        />
      </div>

      {booking.notes?.trim() ? (
        <div className="mt-4 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">
            Notes
          </p>
          <p className="mt-1 text-sm text-zinc-700">{booking.notes}</p>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {canPay && (
          <Link
            to={`/bookings/${booking._id}/pay`}
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
          >
            Pay Now
          </Link>
        )}

        <button
          onClick={() => onReschedule(booking)}
          disabled={disableReschedule || actionLoadingId === booking._id}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            disableReschedule
              ? "cursor-not-allowed border border-zinc-200 bg-zinc-100 text-zinc-400"
              : "border border-zinc-300 text-zinc-800 hover:border-zinc-900 hover:bg-zinc-50"
          }`}
        >
          Reschedule
        </button>

        <button
          onClick={() => onCancel(booking._id)}
          disabled={disableCancel || actionLoadingId === booking._id}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            disableCancel
              ? "cursor-not-allowed border border-zinc-200 bg-zinc-100 text-zinc-400"
              : "border border-rose-300 text-rose-600 hover:bg-rose-50"
          }`}
        >
          {actionLoadingId === booking._id ? "Updating..." : "Cancel"}
        </button>

        {isCancelled && (
          <span className="text-sm font-medium text-zinc-500">
            Cancelled appointments cannot be changed.
          </span>
        )}

        {isCompleted && (
          <span className="text-sm font-medium text-zinc-500">
            Completed appointments can no longer be changed.
          </span>
        )}

        {paymentStatus === "paid" && (
          <span className="text-sm font-medium text-emerald-600">
            Payment completed.
          </span>
        )}
      </div>
    </div>
  );
}

export default function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [message, setMessage] = useState("");

  const loadBookings = async () => {
    try {
      setLoading(true);
      setPageError("");

      const data = await getMyBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load bookings:", err);
      setPageError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const grouped = useMemo(() => {
    const active = bookings.filter((booking) => {
      const status = String(booking.status || "pending").toLowerCase();

      return ["pending", "upcoming", "confirmed"].includes(status);
    });

    const past = bookings.filter((booking) => {
      const status = String(booking.status || "").toLowerCase();

      return ["completed", "cancelled", "canceled"].includes(status);
    });

    return { active, past };
  }, [bookings]);

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      active: grouped.active.length,
      past: grouped.past.length,
    };
  }, [bookings, grouped]);

  const handleCancel = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmed) return;

    try {
      setActionLoadingId(id);
      setMessage("");

      const res = await cancelBooking(id);

      setBookings((prev) =>
        prev.map((booking) => (booking._id === id ? res.booking : booking)),
      );

      setMessage("Booking cancelled successfully.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setActionLoadingId("");
    }
  };

  const handleReschedule = (booking) => {
    navigate("/booking", {
      state: {
        mode: "reschedule",
        bookingId: booking._id,
        bookingData: {
          service: booking.service || null,
          serviceName: booking.serviceName || "",
          stylist: booking.stylist || null,
          stylistName: booking.stylistName || "",
          date: booking.date || "",
          time: booking.time || "",
          notes: booking.notes || "",
          price: booking.price || 0,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 h-10 w-48 rounded bg-zinc-100" />
          <div className="space-y-5">
            <div className="h-56 rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100" />
            <div className="h-56 rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100" />
          </div>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            {pageError}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white text-zinc-900">
      <section className="relative overflow-hidden border-b border-rose-100">
        <div className="absolute -left-16 top-10 h-52 w-52 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-fuchsia-200/30 blur-3xl" />

        <div className="mx-auto max-w-6xl px-6 py-14 md:px-10 lg:px-12">
          <div className="mb-8 flex flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900 hover:bg-zinc-50"
            >
              ← Dashboard
            </Link>

            <Link
              to="/booking"
              className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
            >
              Book New Appointment
            </Link>
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-500">
            Client Booking History
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-900">
            My Bookings
          </h1>

          <p className="mt-4 max-w-2xl text-zinc-600">
            Manage upcoming visits, reschedule appointments, cancel bookings,
            review payment status, and pay outstanding salon appointments.
          </p>

          {message && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>
          )}

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                Total Bookings
              </p>
              <p className="mt-3 text-4xl font-bold text-zinc-900">
                {stats.total}
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                All appointment records
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                Active Appointments
              </p>
              <p className="mt-3 text-4xl font-bold text-zinc-900">
                {stats.active}
              </p>
              <p className="mt-2 text-sm text-zinc-500">Pending or confirmed</p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                Past Appointments
              </p>
              <p className="mt-3 text-4xl font-bold text-zinc-900">
                {stats.past}
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                Completed or cancelled visits
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-10 md:px-10 lg:px-12">
        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-2xl">
              ✨
            </div>

            <h2 className="mt-5 text-2xl font-bold text-zinc-900">
              No bookings yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-zinc-600">
              You have not scheduled any salon appointments yet.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                to="/booking"
                className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                Book Appointment
              </Link>

              <Link
                to="/services"
                className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900"
              >
                Explore Services
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            <div>
              <SectionHeader
                title="Upcoming Appointments"
                count={grouped.active.length}
                subtitle="Pending bookings wait for admin approval. Approved bookings show as confirmed."
              />

              {grouped.active.length === 0 ? (
                <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-zinc-600 shadow-sm">
                  No upcoming appointments.
                </div>
              ) : (
                <div className="space-y-5">
                  {grouped.active.map((booking) => (
                    <BookingCard
                      key={booking._id}
                      booking={booking}
                      onCancel={handleCancel}
                      onReschedule={handleReschedule}
                      actionLoadingId={actionLoadingId}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <SectionHeader
                title="Past Appointments"
                count={grouped.past.length}
                subtitle="Your completed and cancelled booking history."
              />

              {grouped.past.length === 0 ? (
                <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-zinc-600 shadow-sm">
                  No past appointments yet.
                </div>
              ) : (
                <div className="space-y-5">
                  {grouped.past.map((booking) => (
                    <BookingCard
                      key={booking._id}
                      booking={booking}
                      onCancel={handleCancel}
                      onReschedule={handleReschedule}
                      actionLoadingId={actionLoadingId}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
