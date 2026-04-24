import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function getToken() {
  const rawUserInfo = localStorage.getItem("userInfo");
  const userInfo = rawUserInfo ? JSON.parse(rawUserInfo) : null;

  return (
    localStorage.getItem("token") ||
    userInfo?.token ||
    userInfo?.accessToken ||
    ""
  );
}

const API = axios.create({
  baseURL: API_BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// dashboard
export async function getAdminStats() {
  const { data } = await API.get("/admin/stats");
  return data;
}

// bookings
export async function getAdminBookings(status = "") {
  const params = {};
  if (status) params.status = status;

  const { data } = await API.get("/admin/bookings", { params });
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

// customers
export async function getAdminCustomers(search = "") {
  const params = {};
  if (search) params.search = search;

  const { data } = await API.get("/admin/customers", { params });
  return data;
}

export async function getAdminCustomerDetails(customerId) {
  const { data } = await API.get(`/admin/customers/${customerId}`);
  return data;
}

// classes
export async function getAdminClasses() {
  const { data } = await API.get("/admin/classes");
  return data;
}

export async function createAdminClass(payload) {
  const { data } = await API.post("/admin/classes", payload);
  return data;
}

export async function updateAdminClass(classId, payload) {
  const { data } = await API.put(`/admin/classes/${classId}`, payload);
  return data;
}

export async function deleteAdminClass(classId) {
  const { data } = await API.delete(`/admin/classes/${classId}`);
  return data;
}

export async function getAdminClassEnrollments(classId) {
  const { data } = await API.get(`/admin/classes/${classId}/enrollments`);
  return data;
}

// calendar
export async function getAdminCalendar(view = "month", date = "") {
  const params = {};
  if (view) params.view = view;
  if (date) params.date = date;

  const { data } = await API.get("/admin/calendar", { params });
  return data;
}
