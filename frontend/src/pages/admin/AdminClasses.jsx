import { useEffect, useState } from "react";
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
  instructor: "",
  date: "",
  time: "",
  capacity: 10,
  price: "",
};

export default function AdminClasses() {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
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
      title: form.title,
      description: form.description,
      instructor: form.instructor,
      date: form.date,
      time: form.time,
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
      instructor: item.instructor?._id || item.instructor || "",
      date: item.date ? item.date.slice(0, 10) : "",
      time: item.time || "",
      capacity: item.capacity || 10,
      price: item.price || "",
    });
  }

  async function handleDelete(classId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this class?",
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

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Admin Classes</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 grid gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:grid-cols-2"
      >
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Class title"
          className="rounded-lg border px-4 py-3"
          required
        />

        <input
          name="instructor"
          value={form.instructor}
          onChange={handleChange}
          placeholder="Instructor user id"
          className="rounded-lg border px-4 py-3"
        />

        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="rounded-lg border px-4 py-3"
          required
        />

        <input
          name="time"
          value={form.time}
          onChange={handleChange}
          placeholder="Time (example: 10:00 AM)"
          className="rounded-lg border px-4 py-3"
          required
        />

        <input
          name="capacity"
          type="number"
          value={form.capacity}
          onChange={handleChange}
          placeholder="Capacity"
          className="rounded-lg border px-4 py-3"
          required
        />

        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="rounded-lg border px-4 py-3"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="min-h-[120px] rounded-lg border px-4 py-3 md:col-span-2"
        />

        <div className="flex gap-3 md:col-span-2">
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-5 py-3 text-white"
          >
            {editingId ? "Update Class" : "Create Class"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
              className="rounded-lg border px-5 py-3"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {loading ? (
            <p>Loading classes...</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <table className="min-w-full text-left">
                <thead className="bg-zinc-50">
                  <tr>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">Capacity</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {classes.map((item) => (
                    <tr key={item._id} className="border-t">
                      <td className="px-4 py-3">{item.title}</td>
                      <td className="px-4 py-3">
                        {item.date
                          ? new Date(item.date).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-4 py-3">{item.time || "-"}</td>
                      <td className="px-4 py-3">
                        {item.enrolledCount || 0}/{item.capacity || 0}
                      </td>
                      <td className="px-4 py-3">${item.price}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="rounded bg-amber-500 px-3 py-1 text-white"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="rounded bg-red-600 px-3 py-1 text-white"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleViewEnrollments(item)}
                            className="rounded bg-zinc-900 px-3 py-1 text-white"
                          >
                            Enrollments
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {classes.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-6 text-center text-zinc-500"
                      >
                        No classes found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            {selectedClassTitle
              ? `${selectedClassTitle} Enrollments`
              : "Enrollments"}
          </h2>

          {enrollmentLoading ? (
            <p>Loading enrollments...</p>
          ) : (
            <div className="space-y-3">
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment._id}
                  className="rounded-xl border border-zinc-200 p-3"
                >
                  <p className="font-medium">
                    {enrollment.user
                      ? `${enrollment.user.firstName} ${enrollment.user.lastName}`
                      : "Unknown user"}
                  </p>
                  <p className="text-sm text-zinc-600">
                    {enrollment.user?.email || "-"}
                  </p>
                  <p className="text-sm text-zinc-600">
                    Status: {enrollment.status || "-"}
                  </p>
                </div>
              ))}

              {!enrollments.length && (
                <p className="text-sm text-zinc-500">
                  No enrollments loaded yet.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
