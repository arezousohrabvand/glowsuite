import { useEffect, useState } from "react";
import {
  getAdminServices,
  createAdminService,
  updateAdminService,
  deleteAdminService,
} from "../../api/adminApi";

const emptyForm = {
  name: "",
  category: "",
  price: "",
  duration: 60,
  description: "",
};

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  async function loadServices() {
    try {
      const data = await getAdminServices();
      setServices(data);
    } catch (error) {
      console.error("Failed to load services:", error);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const payload = {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        duration: Number(form.duration),
        description: form.description,
      };

      if (editingId) {
        await updateAdminService(editingId, payload);
      } else {
        await createAdminService(payload);
      }

      setEditingId(null);
      setForm(emptyForm);
      await loadServices();
    } catch (error) {
      console.error("Failed to save service:", error);
      alert(error.response?.data?.message || "Failed to save service");
    }
  }

  function handleEdit(service) {
    setEditingId(service._id);
    setForm({
      name: service.name || "",
      category: service.category || "",
      price: service.price || "",
      duration: service.duration || 60,
      description: service.description || "",
    });
  }

  async function handleDelete(serviceId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?",
    );
    if (!confirmed) return;

    try {
      await deleteAdminService(serviceId);
      await loadServices();
    } catch (error) {
      console.error("Failed to delete service:", error);
      alert(error.response?.data?.message || "Failed to delete service");
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Manage Services</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 grid gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:grid-cols-2"
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Service name"
          className="rounded-lg border px-4 py-3"
          required
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="rounded-lg border px-4 py-3"
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

        <input
          name="duration"
          type="number"
          value={form.duration}
          onChange={handleChange}
          placeholder="Duration in minutes"
          className="rounded-lg border px-4 py-3"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="min-h-[120px] rounded-lg border px-4 py-3 md:col-span-2"
        />

        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            className="rounded-lg bg-black px-5 py-3 text-white"
          >
            {editingId ? "Update Service" : "Create Service"}
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

      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full text-left">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {services.map((service) => (
              <tr key={service._id} className="border-t">
                <td className="px-4 py-3">{service.name}</td>
                <td className="px-4 py-3">{service.category || "-"}</td>
                <td className="px-4 py-3">${service.price}</td>
                <td className="px-4 py-3">{service.duration} min</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="rounded bg-amber-500 px-3 py-1 text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className="rounded bg-red-600 px-3 py-1 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {services.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-zinc-500">
                  No services found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
