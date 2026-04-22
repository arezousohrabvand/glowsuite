import axios from "axios";
import { getAuthToken } from "../utils/auth";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const holdBookingSlot = async (payload) => {
  const res = await API.post("/bookings/hold-slot", payload);
  return res.data;
};

export const getBookingHoldStatus = async (holdId) => {
  const res = await API.get(`/bookings/hold-slot/${holdId}`);
  return res.data;
};

export const releaseBookingHold = async (holdId) => {
  const res = await API.delete(`/bookings/hold-slot/${holdId}`);
  return res.data;
};

export const createBooking = async (bookingData) => {
  const res = await API.post("/bookings/checkout", bookingData);
  return res.data;
};

export const getMyBookings = async () => {
  const res = await API.get("/bookings/my");
  return res.data;
};

export const cancelBooking = async (bookingId) => {
  const res = await API.put(`/bookings/${bookingId}/cancel`);
  return res.data;
};

export const rescheduleBooking = async (bookingId, payload) => {
  const res = await API.put(`/bookings/${bookingId}/reschedule`, payload);
  return res.data;
};

export const markBookingPaidAfterSuccess = async (sessionId) => {
  const res = await API.get(
    `/bookings/payment-success?session_id=${sessionId}`,
  );
  return res.data;
};

export default API;
