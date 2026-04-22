import api from "./axios";

export const getServices = async () => {
  const res = await api.get("/services");
  return res.data;
};

export const getServiceById = async (id) => {
  const res = await api.get(`/services/${id}`);
  return res.data;
};
