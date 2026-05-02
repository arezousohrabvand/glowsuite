import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function getToken() {
  const rawUserInfo = localStorage.getItem("userInfo");
  const userInfo = rawUserInfo ? JSON.parse(rawUserInfo) : null;

  return (
    localStorage.getItem("token") || userInfo?.token || userInfo?.accessToken || ""
  );
}

const billingClient = axios.create({
  baseURL: `${API_BASE_URL}/billing`,
});

billingClient.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function getBillingHistory({ page = 1, limit = 10 } = {}) {
  const { data } = await api.get("/billing/history", {
    params: { page, limit },
  });

  return data;
}

export async function getBillingById(id) {
  const res = await billingClient.get(`/${id}`);
  return res.data;
}

export async function previewBilling(payload) {
  const res = await billingClient.post("/preview", payload);
  return res.data;
}

export const getAdminBillingHistory = async ({ page = 1 } = {}) => {
  const res = await axios.get("/api/admin/billing", {
    params: { page },
  });

  return res.data;
};
export const refundBilling = async (billingId, payload) => {
  const res = await billingClient.post(`/admin/${billingId}/refund`, payload);
  return res.data;
};

export async function createCoupon(payload) {
  const res = await billingClient.post("/admin/coupons", payload);
  return res.data;
}
