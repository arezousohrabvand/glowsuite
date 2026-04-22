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

export const getMe = async () => {
  const res = await API.get("/users/me");
  return res.data;
};

export const getMyBookings = async () => {
  const res = await API.get("/bookings/my");
  return res.data;
};

export const getMyEnrollments = async () => {
  const res = await API.get("/enrollments/my-enrollments");
  return res.data;
};

export default API;
