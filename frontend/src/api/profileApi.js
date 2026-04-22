import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getMyProfile = async () => {
  const res = await axios.get(`${API}/users/me`, authHeaders());
  return res.data;
};

export const updateMyProfile = async (formData) => {
  const res = await axios.put(`${API}/users/me`, formData, authHeaders());
  return res.data;
};
