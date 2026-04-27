import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import BookingTable from "../components/dashboard/BookingTable";
import ClassesTable from "../components/dashboard/ClassesTable";
import EnrollmentChart from "../components/dashboard/EnrollmentChart";
import StatCard from "../components/dashboard/StatCard";
import { getMe, getMyBookings, getMyEnrollments } from "../api/dashboardApi";
import AdminDashboard from "./admin/AdminDashboard";
import { useAuth } from "../context/AuthContext";

function calculateRewards(bookings = [], classes = []) {
  let points = 0;
  let completedBookings = 0;
  let paidClasses = 0;
  let rewardTier = "Bronze";
  const rewards = [];

  bookings.forEach((booking) => {
    const status = String(booking.status || "").toLowerCase();
    if (status === "completed") {
      completedBookings += 1;
      points += 20;
    }
    if (status === "confirmed" || status === "upcoming") points += 5;
  });

  classes.forEach((item) => {
    const status = String(item.status || "").toLowerCase();
    if (status === "paid" || status === "enrolled") {
      paidClasses += 1;
      points += 15;
    }
  });

  if (completedBookings >= 3) rewards.push("Free hair treatment add-on");
  if (paidClasses >= 2) rewards.push("10% off next class");

  if (points >= 300) {
    rewardTier = "Gold";
    rewards.push("15% off next booking");
  } else if (points >= 150) {
    rewardTier = "Silver";
    rewards.push("10% off next booking");
  }

  return { points, completedBookings, paidClasses, rewardTier, rewards };
}

export default function Dashboard() {
  const { user: authUser } = useAuth();

  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const [user, setUser] = useState(authUser || storedUser);
  const [bookings, setBookings] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const userData = await getMe();
        const resolvedUser = userData || authUser || storedUser;

        setUser(resolvedUser);

        if (resolvedUser?.role !== "customer") {
          return;
        }

        const [bookingsData, enrollmentsData] = await Promise.allSettled([
          getMyBookings(),
          getMyEnrollments(),
        ]);

        if (bookingsData.status === "fulfilled") {
          setBookings(
            (bookingsData.value || []).map((booking) => ({
              _id: booking._id,
              serviceName:
                booking.serviceName ||
                booking.service?.name ||
                booking.title ||
                "Service",
              date: booking.date || booking.slotStart || "",
              status: booking.status || "Pending",
            })),
          );
        }

        if (enrollmentsData.status === "fulfilled") {
          setClasses(
            (enrollmentsData.value || []).map((item) => ({
              id: item.classItem?._id || item.classItem || "",
              enrollmentId: item._id || item.id,
              title: item.classItem?.title || item.title || "Class",
              instructor:
                item.classItem?.instructorName ||
                item.classItem?.instructor ||
                item.instructor ||
                "Instructor",
              date: item.classItem?.date || item.date || "",
              status:
                item.paymentStatus === "paid"
                  ? "Paid"
                  : item.status || "Enrolled",
            })),
          );
        }
      } catch (error) {
        console.error("Failed to load dashboard", error);

        if (authUser || storedUser) {
          setUser(authUser || storedUser);
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [authUser, storedUser]);

  const currentUser = {
    ...(storedUser || {}),
    ...(user || {}),
    ...(authUser || {}),
  };

  const role = String(currentUser?.role || "").toLowerCase();

  const isAdmin = role === "admin";
  const isCustomer = role === "customer";
  const isInstructor = role === "instructor";
  const isStylist = role === "stylist";

  const upcomingBookings = useMemo(
    () =>
      bookings.filter((booking) =>
        ["Pending", "Upcoming", "Confirmed"].includes(booking.status),
      ),
    [bookings],
  );

  const enrollmentData = useMemo(() => {
    const monthMap = {};
    classes.forEach((item) => {
      const rawDate = item.date ? new Date(item.date) : null;
      if (!rawDate || Number.isNaN(rawDate.getTime())) return;
      const month = rawDate.toLocaleString("en-US", { month: "short" });
      monthMap[month] = (monthMap[month] || 0) + 1;
    });

    return Object.keys(monthMap).map((month) => ({
      name: month,
      enrollments: monthMap[month],
    }));
  }, [classes]);

  const rewardSummary = useMemo(
    () => calculateRewards(bookings, classes),
    [bookings, classes],
  );

  const displayName =
    currentUser?.fullName ||
    `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() ||
    "Glow Member";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
          <div className="h-[500px] rounded-3xl bg-white shadow-sm" />
          <div className="space-y-6">
            <div className="h-40 rounded-3xl bg-white shadow-sm" />
            <div className="h-72 rounded-3xl bg-white shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <div className="p-6">Could not load dashboard.</div>;
  }

  if (isAdmin) return <AdminDashboard />;

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
                  GlowSuite Dashboard
                </p>

                <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                  Welcome back, {displayName}
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                  {isInstructor
                    ? "Manage your classes, students, attendance, and teaching activity in one premium space."
                    : isStylist
                      ? "Manage your schedule, customers, stylist notes, and appointment status in one premium space."
                      : "Manage your upcoming appointments, review your class activity, and stay on top of your beauty journey in one premium space."}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {isCustomer && (
                    <>
                      <Link
                        to="/booking"
                        className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-600"
                      >
                        Book Appointment
                      </Link>

                      <Link
                        to="/my-bookings"
                        className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-900"
                      >
                        View Bookings
                      </Link>
                    </>
                  )}

                  <Link
                    to="/profile"
                    className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-900"
                  >
                    Edit Profile
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    My Profile
                  </p>

                  <div className="mt-3 space-y-2 text-sm text-slate-700">
                    <p>
                      <span className="font-semibold text-slate-900">
                        First Name:
                      </span>{" "}
                      {currentUser?.firstName || "Not provided"}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">
                        Last Name:
                      </span>{" "}
                      {currentUser?.lastName || "Not provided"}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">
                        Phone:
                      </span>{" "}
                      {currentUser?.phone || "Not provided"}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">
                        Email:
                      </span>{" "}
                      {currentUser?.email || "Not provided"}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">
                        Role:
                      </span>{" "}
                      {role || "customer"}
                    </p>
                  </div>
                </div>

                {isCustomer && (
                  <>
                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Membership
                      </p>
                      <p className="mt-2 text-lg font-bold text-slate-900">
                        Premium Client
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Reward Tier
                      </p>
                      <p className="mt-2 text-lg font-bold text-slate-900">
                        {rewardSummary.rewardTier}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          {isInstructor && (
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">
                  Instructor Area
                </p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  Students
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Student email, phone, attendance, and class details will show
                  here.
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Student</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-4 py-4 text-slate-600" colSpan="4">
                        No students loaded yet. Connect this section to your
                        instructor classes API next.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {isStylist && (
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">
                Stylist Area
              </p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">
                Today’s Schedule
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Schedule, customers, and stylist notes will show here.
              </p>
            </section>
          )}

          {isCustomer && (
            <>
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <StatCard title="Total Bookings" value={bookings.length} />
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <StatCard
                    title="Upcoming Appointments"
                    value={upcomingBookings.length}
                  />
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <StatCard title="Classes Joined" value={classes.length} />
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <StatCard
                    title="Loyalty Points"
                    value={rewardSummary.points}
                  />
                </div>
              </section>

              <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.65fr]">
                <div className="space-y-6">
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-xl font-bold text-slate-900">
                        Upcoming Appointments
                      </h2>
                      <Link
                        to="/my-bookings"
                        className="text-sm font-medium text-pink-600 hover:underline"
                      >
                        View all
                      </Link>
                    </div>

                    {upcomingBookings.length === 0 ? (
                      <p className="text-sm text-slate-500">
                        No upcoming appointments yet.
                      </p>
                    ) : (
                      <BookingTable bookings={upcomingBookings} />
                    )}
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-xl font-bold text-slate-900">
                        My Classes
                      </h2>
                      <Link
                        to="/my-classes"
                        className="text-sm font-medium text-pink-600 hover:underline"
                      >
                        View all
                      </Link>
                    </div>
                    <ClassesTable classes={classes} />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="mb-4 text-xl font-bold text-slate-900">
                      Class Activity
                    </h2>

                    <div className="h-[280px] w-full min-w-0">
                      <EnrollmentChart data={enrollmentData} />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900">
                      Quick Actions
                    </h2>

                    <div className="mt-4 grid gap-3">
                      <Link
                        to="/booking"
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Book New Appointment
                      </Link>

                      <Link
                        to="/my-bookings"
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Manage Bookings
                      </Link>

                      <Link
                        to="/my-classes"
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        View My Classes
                      </Link>

                      <Link
                        to="/profile"
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Edit Profile
                      </Link>

                      <Link
                        to="/billing"
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Billing History
                      </Link>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900">
                      My Rewards
                    </h2>

                    <div className="mt-4 space-y-3">
                      <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          Reward Tier
                        </p>
                        <p className="mt-2 text-lg font-bold text-slate-900">
                          {rewardSummary.rewardTier}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          Points
                        </p>
                        <p className="mt-2 text-lg font-bold text-slate-900">
                          {rewardSummary.points}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
