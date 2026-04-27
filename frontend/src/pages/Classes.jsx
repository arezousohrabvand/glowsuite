import { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { socket } from "../socket";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const categories = [
  "All",
  "Color",
  "Styling",
  "Bridal",
  "Wellness",
  "Cutting",
  "Texture",
  "Business",
  "Treatment",
];

const levels = ["All", "Beginner", "Intermediate", "Advanced"];

function TagBadge({ children }) {
  return (
    <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
      {children}
    </span>
  );
}

export default function Classes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeParam = searchParams.get("type");
  const { isAuthenticated, user } = useAuth();

  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const category = useMemo(() => {
    if (!typeParam) return "All";

    const matched = categories.find(
      (item) => item.toLowerCase() === String(typeParam).toLowerCase(),
    );

    return matched || "All";
  }, [typeParam]);

  const fetchClasses = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/classes`);
      setClasses(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    const handleSeatUpdate = (payload) => {
      setClasses((prev) =>
        prev.map((item) => {
          if (String(item._id) !== String(payload.classId)) return item;

          return {
            ...item,
            enrolledCount: payload.enrolledCount,
            liveActiveHolds: payload.activeHolds,
            seatsLeft: payload.seatsLeft,
          };
        }),
      );
    };

    socket.on("class-seat-update", handleSeatUpdate);

    return () => {
      socket.off("class-seat-update", handleSeatUpdate);
    };
  }, []);

  useEffect(() => {
    classes.forEach((item) => {
      socket.emit("join-class-room", item._id);
    });

    return () => {
      classes.forEach((item) => {
        socket.emit("leave-class-room", item._id);
      });
    };
  }, [classes]);

  const filteredClasses = classes.filter((item) => {
    if (!item) return false;

    const q = String(search || "").toLowerCase();

    const title = String(item.title || "").toLowerCase();
    const instructor = String(
      item.instructorName ||
        item.instructor?.fullName ||
        `${item.instructor?.firstName || ""} ${item.instructor?.lastName || ""}` ||
        "",
    ).toLowerCase();
    const categoryText = String(item.category || "").toLowerCase();
    const levelText = String(item.level || "");
    const tagsArray = Array.isArray(item.tags) ? item.tags : [];

    const matchesSearch =
      title.includes(q) ||
      instructor.includes(q) ||
      categoryText.includes(q) ||
      tagsArray.some((tag) => String(tag).toLowerCase().includes(q));

    const matchesCategory =
      category === "All" || categoryText === category.toLowerCase();

    const matchesLevel = level === "All" || levelText === level;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleCategoryChange = (value) => {
    const next = new URLSearchParams(searchParams);

    if (value === "All") {
      next.delete("type");
    } else {
      next.set("type", value);
    }

    setSearchParams(next);
  };

  const dashboardPath = user?.role === "admin" ? "/admin" : "/dashboard";

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white text-zinc-900">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-6 flex flex-wrap gap-3">
          {isAuthenticated && (
            <>
              <Link
                to={dashboardPath}
                className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900 hover:bg-zinc-50"
              >
                ← Dashboard
              </Link>

              <Link
                to="/my-classes"
                className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                My Classes
              </Link>
            </>
          )}

          <Link
            to="/booking"
            className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900 hover:bg-zinc-50"
          >
            Book Appointment
          </Link>
        </div>

        <h1 className="text-4xl font-bold">Salon Classes</h1>
        <p className="mt-3 max-w-2xl text-zinc-600">
          Learn premium salon skills from expert instructors, explore featured
          sessions, and reserve your spot in our latest classes.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid gap-4 md:grid-cols-3">
          <input
            type="text"
            placeholder="Search classes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border px-4 py-3"
          />

          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="rounded-xl border px-4 py-3"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="rounded-xl border px-4 py-3"
          >
            {levels.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </section>

      {loading ? (
        <section className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-center text-zinc-500">Loading classes...</p>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-6 py-10">
          <h2 className="mb-6 text-2xl font-bold">
            {filteredClasses.length} Classes
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredClasses.map((item) => {
              const capacity = Number(item.capacity || 0);
              const enrolledCount = Number(item.enrolledCount || 0);
              const seatsLeft =
                typeof item.seatsLeft === "number"
                  ? item.seatsLeft
                  : Math.max(capacity - enrolledCount, 0);

              return (
                <div
                  key={item._id}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-40 w-full rounded-xl object-cover"
                    />
                  )}

                  <h3 className="mt-4 text-xl font-bold">{item.title}</h3>

                  <p className="text-sm text-zinc-600">
                    {item.instructorName ||
                      item.instructor?.fullName ||
                      `${item.instructor?.firstName || ""} ${item.instructor?.lastName || ""}`.trim() ||
                      "GlowSuite Instructor"}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {(item.tags || []).map((tag) => (
                      <TagBadge key={tag}>{tag}</TagBadge>
                    ))}
                  </div>

                  <p className="mt-3 line-clamp-3 text-sm text-zinc-600">
                    {item.description}
                  </p>

                  <div className="mt-3 text-sm">
                    {seatsLeft <= 0 ? (
                      <span className="font-semibold text-red-600">
                        Sold out
                      </span>
                    ) : seatsLeft <= 3 ? (
                      <span className="font-semibold text-amber-600">
                        Only {seatsLeft} seats left
                      </span>
                    ) : (
                      <span className="font-medium text-emerald-600">
                        {seatsLeft} seats available
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold">
                      ${item.price || 0}
                    </span>

                    <Link
                      to={`/classes/${item._id}`}
                      className="text-sm font-semibold text-rose-600"
                    >
                      Details →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredClasses.length === 0 && (
            <p className="mt-10 text-center text-zinc-500">No classes found</p>
          )}
        </section>
      )}
    </div>
  );
}
