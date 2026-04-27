import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getStylistDashboard = async () => {
  const res = await axios.get(`${API_URL}/stylist/dashboard`, authHeaders());
  return res.data;
};

export const getStylistBookings = async () => {
  const res = await axios.get(`${API_URL}/stylist/bookings`, authHeaders());
  return res.data;
};

export const updateStylistBookingStatus = async (bookingId, status) => {
  const res = await axios.patch(
    `${API_URL}/stylist/bookings/${bookingId}/status`,
    { status },
    authHeaders(),
  );
  return res.data;
};
