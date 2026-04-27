import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const authHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getInstructorDashboard = async () => {
  const res = await axios.get(`${API_URL}/instructor/dashboard`, authHeaders());
  return res.data;
};

export const getInstructorClasses = async () => {
  const res = await axios.get(`${API_URL}/instructor/classes`, authHeaders());
  return res.data;
};
