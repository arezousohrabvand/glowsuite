import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function StatusBadge({ status }) {
  const styles = {
    paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    unpaid: "bg-rose-50 text-rose-700 border-rose-200",
    enrolled: "bg-blue-50 text-blue-700 border-blue-200",
    cancelled: "bg-zinc-100 text-zinc-700 border-zinc-200",
  };

  const normalized = String(status || "").toLowerCase();

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        styles[normalized] || "bg-zinc-100 text-zinc-700 border-zinc-200"
      }`}
    >
      {status || "Enrolled"}
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

function ClassCard({ enrollment }) {
  const classData = enrollment.classItem || {};
  const paymentStatus = String(enrollment.paymentStatus || "").toLowerCase();
  const displayStatus =
    paymentStatus === "paid"
      ? "Paid"
      : enrollment.status || enrollment.paymentStatus || "Enrolled";

  const isPaid = paymentStatus === "paid";
  const canPay = !["paid", "processing"].includes(paymentStatus);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          <img
            src={
              classData.image ||
              "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1200&auto=format&fit=crop"
            }
            alt={classData.title || "Class"}
            className="h-24 w-24 rounded-2xl object-cover"
          />

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-500">
              Class Enrollment
            </p>
            <h3 className="mt-1 text-2xl font-semibold text-zinc-900">
              {classData.title || "Class"}
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Enrollment ID: {enrollment._id?.slice(-8) || "—"}
            </p>
          </div>
        </div>

        <StatusBadge status={displayStatus} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <InfoTile
          label="Instructor"
          value={classData.instructorName || classData.instructor || "TBA"}
        />
        <InfoTile label="Date" value={classData.date || "Not scheduled"} />
        <InfoTile label="Time" value={classData.time || "Not scheduled"} />
        <InfoTile
          label="Amount"
          value={`$${Number(enrollment.amount ?? classData.price ?? 0).toFixed(2)}`}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <InfoTile label="Category" value={classData.category || "General"} />
        <InfoTile label="Level" value={classData.level || "Beginner"} />
        <InfoTile label="Duration" value={classData.duration || "TBA"} />
        <InfoTile
          label="Payment"
          value={isPaid ? "Completed" : enrollment.paymentStatus || "Pending"}
        />
      </div>

      {classData.description?.trim() ? (
        <div className="mt-4 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">
            Description
          </p>
          <p className="mt-1 text-sm text-zinc-700">{classData.description}</p>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {canPay && (
          <Link
            to={`/enrollments/${enrollment._id}/pay`}
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
          >
            Pay Now
          </Link>
        )}

        <Link
          to={`/classes/${classData._id || enrollment.classItem}`}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900 hover:bg-zinc-50"
        >
          View Class Details
        </Link>

        <Link
          to="/classes"
          className="rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
        >
          Explore More Classes
        </Link>

        <p className="text-xs text-zinc-400">
          {isPaid
            ? "Your payment is complete."
            : "This enrollment is awaiting payment confirmation."}
        </p>
      </div>
    </div>
  );
}

export default function MyClasses() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      setPageError("");

      const rawUserInfo = localStorage.getItem("userInfo");
      const userInfo = rawUserInfo ? JSON.parse(rawUserInfo) : null;

      const token =
        localStorage.getItem("token") ||
        userInfo?.token ||
        userInfo?.accessToken;

      if (!token) {
        setPageError("Please log in first.");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        "http://localhost:5000/api/enrollments/my-enrollments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setEnrollments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load enrollments:", err);
      setPageError(err.response?.data?.message || "Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnrollments();
  }, []);

  const grouped = useMemo(() => {
    const active = enrollments.filter((item) => {
      const status = String(
        item.paymentStatus || item.status || "",
      ).toLowerCase();
      return ["paid", "pending", "unpaid"].includes(status);
    });

    const other = enrollments.filter((item) => {
      const status = String(
        item.paymentStatus || item.status || "",
      ).toLowerCase();
      return !["paid", "pending", "unpaid"].includes(status);
    });

    return { active, other };
  }, [enrollments]);

  const stats = useMemo(() => {
    const paidCount = enrollments.filter(
      (item) => String(item.paymentStatus || "").toLowerCase() === "paid",
    ).length;

    return {
      total: enrollments.length,
      active: grouped.active.length,
      paid: paidCount,
    };
  }, [enrollments, grouped]);

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
              to="/classes"
              className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
            >
              Browse Classes
            </Link>
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-500">
            Client Learning History
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-900">
            My Classes
          </h1>
          <p className="mt-4 max-w-2xl text-zinc-600">
            Review your enrolled classes, payment status, instructors, and
            upcoming learning sessions in one premium space.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                Total Enrollments
              </p>
              <p className="mt-3 text-4xl font-bold text-zinc-900">
                {stats.total}
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                All class enrollment records
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                Active Classes
              </p>
              <p className="mt-3 text-4xl font-bold text-zinc-900">
                {stats.active}
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                Paid, pending, or unpaid enrollments
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                Paid Enrollments
              </p>
              <p className="mt-3 text-4xl font-bold text-zinc-900">
                {stats.paid}
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                Successfully completed class payments
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-10 md:px-10 lg:px-12">
        {enrollments.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-2xl">
              🎓
            </div>
            <h2 className="mt-5 text-2xl font-bold text-zinc-900">
              No classes yet
            </h2>
            <p className="mx-auto mt-3 max-w-md text-zinc-600">
              You have not enrolled in any classes yet.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                to="/classes"
                className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                Browse Classes
              </Link>
              <Link
                to="/dashboard"
                className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            <div>
              <SectionHeader
                title="Active Enrollments"
                count={grouped.active.length}
                subtitle="Your current class enrollments and payment progress."
              />

              {grouped.active.length === 0 ? (
                <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-zinc-600 shadow-sm">
                  No active class enrollments.
                </div>
              ) : (
                <div className="space-y-5">
                  {grouped.active.map((item) => (
                    <ClassCard key={item._id} enrollment={item} />
                  ))}
                </div>
              )}
            </div>

            <div>
              <SectionHeader
                title="Other Enrollment History"
                count={grouped.other.length}
                subtitle="Additional class records outside the active payment flow."
              />

              {grouped.other.length === 0 ? (
                <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-zinc-600 shadow-sm">
                  No additional class history yet.
                </div>
              ) : (
                <div className="space-y-5">
                  {grouped.other.map((item) => (
                    <ClassCard key={item._id} enrollment={item} />
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
