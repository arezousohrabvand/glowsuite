import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// stats
export async function getAdminStats() {
  const { data } = await API.get("/admin/stats");
  return data;
}

// bookings
export async function getAdminBookings(status = "") {
  const url = status ? `/admin/bookings?status=${status}` : "/admin/bookings";
  const { data } = await API.get(url);
  return data;
}

export async function updateAdminBookingStatus(bookingId, status) {
  const { data } = await API.patch(`/admin/bookings/${bookingId}/status`, {
    status,
  });
  return data;
}

// services
export async function getAdminServices() {
  const { data } = await API.get("/admin/services");
  return data;
}

export async function createAdminService(payload) {
  const { data } = await API.post("/admin/services", payload);
  return data;
}

export async function updateAdminService(serviceId, payload) {
  const { data } = await API.put(`/admin/services/${serviceId}`, payload);
  return data;
}

export async function deleteAdminService(serviceId) {
  const { data } = await API.delete(`/admin/services/${serviceId}`);
  return data;
}

// users
export async function getAdminUsers() {
  const { data } = await API.get("/admin/users");
  return data;
}

export async function updateAdminUserRole(userId, role) {
  const { data } = await API.patch(`/admin/users/${userId}/role`, { role });
  return data;
}

// calendar
export async function getAdminCalendar(view = "month", date = "") {
  const query = new URLSearchParams({ view, date }).toString();
  const { data } = await API.get(`/admin/calendar?${query}`);
  return data;
}
