import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getMyEnrollments = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API}/classes/my-enrollments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
