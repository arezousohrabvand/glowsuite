import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

export const signupUser = async (userData) => {
  const { data } = await API.post("/register", userData);
  return data;
};

export const loginUser = async (userData) => {
  const { data } = await API.post("/login", userData);
  return data;
};

export const getMe = async (token) => {
  const { data } = await API.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
