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

const paymentClient = axios.create({
  baseURL: API_BASE_URL,
});

paymentClient.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function previewCheckout(payload) {
  const { type, enrollmentId, couponCode = "", state = "TX" } = payload;

  if (type === "class") {
    const res = await paymentClient.post(
      `/enrollments/${enrollmentId}/preview`,
      {
        couponCode,
        state,
      },
    );
    return res.data;
  }

  throw new Error("Unsupported checkout preview type");
}

export async function createCheckout(payload) {
  const { type, enrollmentId, couponCode = "", state = "TX" } = payload;

  if (type === "class") {
    const res = await paymentClient.post(
      `/enrollments/${enrollmentId}/checkout`,
      {
        couponCode,
        state,
      },
    );
    return res.data;
  }

  throw new Error("Unsupported checkout type");
}

export async function verifyCheckoutSession(sessionId) {
  const res = await paymentClient.get(
    `/enrollments/payment-success?session_id=${sessionId}`,
  );
  return res.data;
}

export default paymentClient;
