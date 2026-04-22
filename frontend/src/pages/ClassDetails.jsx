import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { socket } from "../socket";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-zinc-50 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-zinc-900">{value}</p>
    </div>
  );
}

function Tag({ children }) {
  return (
    <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
      {children}
    </span>
  );
}

export default function ClassDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [classItem, setClassItem] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingEnroll, setLoadingEnroll] = useState(false);
  const [error, setError] = useState("");

  const fetchClass = async () => {
    try {
      setLoadingPage(true);
      setError("");
      const res = await axios.get(`${API_BASE_URL}/classes/${id}`);
      setClassItem(res.data);
    } catch (err) {
      console.error("Failed to fetch class:", err);
      setError(err.response?.data?.message || "Failed to load class");
      setClassItem(null);
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    if (id) fetchClass();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    socket.emit("join-class-room", id);

    const handleSeatUpdate = (payload) => {
      if (String(payload.classId) !== String(id)) return;

      setClassItem((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          enrolledCount: payload.enrolledCount,
          seatsLeft: payload.seatsLeft,
          liveActiveHolds: payload.activeHolds,
        };
      });
    };

    socket.on("class-seat-update", handleSeatUpdate);

    return () => {
      socket.emit("leave-class-room", id);
      socket.off("class-seat-update", handleSeatUpdate);
    };
  }, [id]);

  const handleEnroll = async () => {
    try {
      const rawUserInfo = localStorage.getItem("userInfo");
      const userInfo = rawUserInfo ? JSON.parse(rawUserInfo) : null;

      const token =
        localStorage.getItem("token") ||
        userInfo?.token ||
        userInfo?.accessToken;

      if (!token) {
        alert("Please log in first");
        navigate("/login");
        return;
      }

      if (!classItem?._id) {
        alert("Invalid class");
        return;
      }

      setLoadingEnroll(true);

      const res = await axios.post(
        `${API_BASE_URL}/enrollments`,
        { classId: classItem._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data?.enrollment?._id) {
        navigate(`/enrollment-payment/${res.data.enrollment._id}`);
        return;
      }

      if (res.data.updatedClass) {
        setClassItem(res.data.updatedClass);
      } else {
        await fetchClass();
      }

      alert(res.data.message || "Enrollment successful");
    } catch (err) {
      console.error("Enrollment error response:", err.response?.data);
      alert(err.response?.data?.message || "Enrollment failed");
    } finally {
      setLoadingEnroll(false);
    }
  };

  const seatsLeft = useMemo(() => {
    if (!classItem) return 0;
    if (typeof classItem.seatsLeft === "number") return classItem.seatsLeft;

    const capacity = Number(classItem.capacity || 0);
    const enrolledCount = Number(classItem.enrolledCount || 0);
    return Math.max(capacity - enrolledCount, 0);
  }, [classItem]);

  const soldOut = seatsLeft <= 0;
  const almostFull = seatsLeft > 0 && seatsLeft <= 3;

  if (loadingPage) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center text-lg font-semibold">
        Loading class...
      </div>
    );
  }

  if (error || !classItem) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-zinc-900">Class not found</h1>
        <p className="mt-3 text-zinc-600">
          {error || "The class you’re looking for does not exist."}
        </p>
        <Link
          to="/classes"
          className="mt-6 inline-flex rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white"
        >
          Back to Classes
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white text-zinc-900">
      <section className="relative overflow-hidden border-b border-rose-100">
        <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-fuchsia-200/30 blur-3xl" />

        <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12">
          <div className="mb-6">
            <Link
              to="/classes"
              className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-900"
            >
              ← Back to Classes
            </Link>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-black/5">
                <img
                  src={
                    classItem.image ||
                    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1200&auto=format&fit=crop"
                  }
                  alt={classItem.title || "Class image"}
                  className="h-[430px] w-full object-cover"
                />
              </div>

              <div className="mt-8">
                <div className="flex flex-wrap gap-2">
                  {classItem.category && <Tag>{classItem.category}</Tag>}
                  {classItem.level && <Tag>{classItem.level}</Tag>}
                  {Array.isArray(classItem.tags) &&
                    classItem.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
                </div>

                <h1 className="mt-5 text-4xl font-bold leading-tight">
                  {classItem.title || "Untitled Class"}
                </h1>

                <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600 md:text-lg">
                  {classItem.description || "No class description available."}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <InfoCard label="Date" value={classItem.date || "TBA"} />
                  <InfoCard label="Time" value={classItem.time || "TBA"} />
                  <InfoCard
                    label="Duration"
                    value={classItem.duration || "TBA"}
                  />
                  <InfoCard
                    label="Price"
                    value={`$${Number(classItem.price || 0)}`}
                  />
                </div>
              </div>
            </div>

            <div className="h-fit rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
                Reserve your seat
              </p>

              <div className="mt-4 rounded-3xl bg-zinc-900 p-6 text-white">
                <p className="text-sm text-white/70">Enrollment</p>
                <p className="mt-2 text-4xl font-bold">
                  ${Number(classItem.price || 0)}
                </p>
                <p className="mt-2 text-sm text-white/70">
                  {classItem.date || "TBA"} • {classItem.time || "TBA"}
                </p>

                <div className="mt-5">
                  {soldOut ? (
                    <span className="rounded-full bg-red-500/15 px-3 py-1 text-sm font-semibold text-red-200">
                      Sold out
                    </span>
                  ) : almostFull ? (
                    <span className="rounded-full bg-amber-500/15 px-3 py-1 text-sm font-semibold text-amber-200">
                      Only {seatsLeft} seats left
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-emerald-200">
                      {seatsLeft} seats available
                    </span>
                  )}
                </div>

                <button
                  onClick={handleEnroll}
                  disabled={soldOut || loadingEnroll}
                  className={`mt-6 w-full rounded-full px-5 py-3 text-sm font-semibold transition ${
                    soldOut || loadingEnroll
                      ? "cursor-not-allowed bg-white/20 text-white/60"
                      : "bg-white text-zinc-900 hover:bg-rose-100"
                  }`}
                >
                  {soldOut
                    ? "Enrollment Closed"
                    : loadingEnroll
                      ? "Processing..."
                      : "Enroll Now"}
                </button>

                <Link
                  to="/booking"
                  className="mt-3 block w-full rounded-full border border-white/20 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Book Salon Appointment
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                <InfoCard
                  label="Instructor"
                  value={
                    classItem.instructorName || classItem.instructor || "TBA"
                  }
                />
                <InfoCard
                  label="Seat Availability"
                  value={`${seatsLeft} remaining of ${Number(classItem.capacity || 0)}`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
