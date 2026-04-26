import { useEffect, useMemo, useState } from "react";
import {
  getAdminClasses,
  createAdminClass,
  updateAdminClass,
  deleteAdminClass,
  getAdminClassEnrollments,
} from "../../api/adminApi";

const emptyForm = {
  title: "",
  description: "",
  date: "",
  time: "",
  capacity: 10,
  price: "",
};

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

function classStatus(item) {
  const capacity = Number(item.capacity || 0);
  const enrolled = Number(item.enrolledCount || 0);

  if (capacity > 0 && enrolled >= capacity) return "Full";
  if (enrolled > 0) return "Active";
  return "Open";
}

function StatusBadge({ value }) {
  const status = String(value || "Open").toLowerCase();

  const styles =
    status === "full"
      ? "bg-rose-50 text-rose-700 ring-rose-100"
      : status === "active"
        ? "bg-amber-50 text-amber-700 ring-amber-100"
        : "bg-emerald-50 text-emerald-700 ring-emerald-100";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${styles}`}
    >
      {value}
    </span>
  );
}

export default function AdminClasses() {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [enrollments, setEnrollments] = useState([]);
  const [selectedClassTitle, setSelectedClassTitle] = useState("");
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);

  async function loadClasses() {
    try {
      setLoading(true);
      const data = await getAdminClasses();
      setClasses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load classes:", error);
      alert(error.response?.data?.message || "Failed to load classes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClasses();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      date: form.date,
      time: form.time.trim(),
      capacity: Number(form.capacity),
      price: Number(form.price),
    };

    try {
      if (editingId) {
        await updateAdminClass(editingId, payload);
      } else {
        await createAdminClass(payload);
      }

      setEditingId(null);
      setForm(emptyForm);
      await loadClasses();
    } catch (error) {
      console.error("Failed to save class:", error);
      alert(error.response?.data?.message || "Failed to save class");
    }
  }

  function handleEdit(item) {
    setEditingId(item._id);
    setForm({
      title: item.title || "",
      description: item.description || "",
      date: item.date ? String(item.date).slice(0, 10) : "",
      time: item.time || "",
      capacity: item.capacity || 10,
      price: item.price || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(classId) {
    const confirmed = window.confirm(
      "Delete this class? This also removes related enrollments.",
    );
    if (!confirmed) return;

    try {
      await deleteAdminClass(classId);
      await loadClasses();
    } catch (error) {
      console.error("Failed to delete class:", error);
      alert(error.response?.data?.message || "Failed to delete class");
    }
  }

  async function handleViewEnrollments(item) {
    try {
      setEnrollmentLoading(true);
      setSelectedClassTitle(item.title || "Class");
      const data = await getAdminClassEnrollments(item._id);
      setEnrollments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load enrollments:", error);
      alert(error.response?.data?.message || "Failed to load enrollments");
    } finally {
      setEnrollmentLoading(false);
    }
  }

  const filteredClasses = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return classes;

    return classes.filter((item) => {
      return (
        String(item.title || "")
          .toLowerCase()
          .includes(q) ||
        String(item.description || "")
          .toLowerCase()
          .includes(q) ||
        String(item.time || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [classes, search]);

  const stats = useMemo(() => {
    const total = classes.length;
    const seats = classes.reduce(
      (sum, item) => sum + Number(item.capacity || 0),
      0,
    );
    const enrolled = classes.reduce(
      (sum, item) => sum + Number(item.enrolledCount || 0),
      0,
    );
    const revenuePotential = classes.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.capacity || 0),
      0,
    );

    return { total, seats, enrolled, revenuePotential };
  }, [classes]);

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl bg-zinc-950 p-8 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-300">
            Admin Classes
          </p>

          <div className="mt-3 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Manage Salon Classes
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                Create workshops, update class schedules, track seats, view
                enrollments, and manage class availability from one dashboard.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                  Classes
                </p>
                <p className="mt-2 text-3xl font-bold">{stats.total}</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                  Seats
                </p>
                <p className="mt-2 text-3xl font-bold">{stats.seats}</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                  Enrolled
                </p>
                <p className="mt-2 text-3xl font-bold">{stats.enrolled}</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                  Potential
                </p>
                <p className="mt-2 text-3xl font-bold">
                  ${stats.revenuePotential}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">
                {editingId ? "Edit Class" : "Create New Class"}
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Add practical details customers need before enrolling.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 hover:border-zinc-900"
              >
                Cancel edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Class title"
              className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-zinc-900 focus:bg-white"
              required
            />

            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-zinc-900 focus:bg-white"
              required
            />

            <input
              name="time"
              value={form.time}
              onChange={handleChange}
              placeholder="Time example: 10:00 AM"
              className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-zinc-900 focus:bg-white"
              required
            />

            <input
              name="capacity"
              type="number"
              min="1"
              value={form.capacity}
              onChange={handleChange}
              placeholder="Capacity"
              className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-zinc-900 focus:bg-white"
              required
            />

            <input
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-zinc-900 focus:bg-white"
              required
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Class description"
              className="min-h-[120px] rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-zinc-900 focus:bg-white md:col-span-2"
            />

            <div className="md:col-span-2">
              <button
                type="submit"
                className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600"
              >
                {editingId ? "Update Class" : "Create Class"}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search classes..."
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-zinc-900 focus:bg-white"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            {loading ? (
              <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-zinc-200">
                Loading classes...
              </div>
            ) : (
              filteredClasses.map((item) => {
                const enrolled = Number(item.enrolledCount || 0);
                const capacity = Number(item.capacity || 0);
                const seatsLeft = Math.max(capacity - enrolled, 0);
                const progress =
                  capacity > 0 ? Math.min((enrolled / capacity) * 100, 100) : 0;
                const status = classStatus(item);

                return (
                  <article
                    key={item._id}
                    className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <StatusBadge value={status} />
                          <span className="rounded-full bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-600 ring-1 ring-zinc-100">
                            {formatDate(item.date)}
                          </span>
                          <span className="rounded-full bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-600 ring-1 ring-zinc-100">
                            {item.time || "Time TBA"}
                          </span>
                        </div>

                        <h3 className="mt-4 text-2xl font-bold text-zinc-900">
                          {item.title}
                        </h3>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                          {item.description || "No description yet."}
                        </p>
                      </div>

                      <div className="text-left lg:text-right">
                        <p className="text-3xl font-bold text-zinc-900">
                          ${Number(item.price || 0)}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                          {seatsLeft} seats left
                        </p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex justify-between text-xs font-semibold text-zinc-500">
                        <span>
                          {enrolled}/{capacity} enrolled
                        </span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                        <div
                          className="h-full rounded-full bg-zinc-900"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleEdit(item)}
                        className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 ring-1 ring-amber-100 hover:bg-amber-100"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleViewEnrollments(item)}
                        className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600"
                      >
                        View Enrollments
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 ring-1 ring-rose-100 hover:bg-rose-100"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })
            )}

            {!loading && filteredClasses.length === 0 && (
              <div className="rounded-3xl bg-white p-12 text-center shadow-sm ring-1 ring-zinc-200">
                <p className="text-lg font-semibold text-zinc-900">
                  No classes found
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  Create your first class or change your search.
                </p>
              </div>
            )}
          </div>

          <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
            <h2 className="text-xl font-bold text-zinc-900">
              {selectedClassTitle || "Class Enrollments"}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Select a class to review enrolled customers.
            </p>

            <div className="mt-5 space-y-3">
              {enrollmentLoading ? (
                <p className="text-sm text-zinc-500">Loading enrollments...</p>
              ) : (
                enrollments.map((enrollment) => (
                  <div
                    key={enrollment._id}
                    className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4"
                  >
                    <p className="font-semibold text-zinc-900">
                      {enrollment.customer
                        ? `${enrollment.customer.firstName || ""} ${
                            enrollment.customer.lastName || ""
                          }`.trim()
                        : enrollment.user
                          ? `${enrollment.user.firstName || ""} ${
                              enrollment.user.lastName || ""
                            }`.trim()
                          : "Unknown customer"}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {enrollment.customer?.email ||
                        enrollment.user?.email ||
                        "No email"}
                    </p>

                    <div className="mt-3 flex gap-2">
                      <StatusBadge value={enrollment.status} />
                      <StatusBadge value={enrollment.paymentStatus} />
                    </div>
                  </div>
                ))
              )}

              {!enrollmentLoading && enrollments.length === 0 && (
                <div className="rounded-2xl bg-zinc-50 p-5 text-sm text-zinc-500">
                  No enrollments selected or no students enrolled yet.
                </div>
              )}
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
