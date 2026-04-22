import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [sessionInfo, setSessionInfo] = useState(null);
  const [paymentType, setPaymentType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sessionId = searchParams.get("session_id");
  const typeParam = searchParams.get("type");

  useEffect(() => {
    const load = async () => {
      try {
        if (!sessionId) {
          setError("Missing Stripe session id");
          return;
        }

        const token = getToken();

        if (!token) {
          setError("You must be logged in to verify this payment.");
          return;
        }

        if (typeParam === "booking") {
          const res = await axios.get(
            `${API_BASE_URL}/bookings/payment-success`,
            {
              params: { session_id: sessionId },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          setSessionInfo(res.data);
          setPaymentType("booking");

          setTimeout(() => {
            navigate("/my-bookings");
          }, 1800);

          return;
        }

        if (typeParam === "enrollment") {
          const res = await axios.get(
            `${API_BASE_URL}/enrollments/payment-success`,
            {
              params: { session_id: sessionId },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          setSessionInfo(res.data);
          setPaymentType("enrollment");

          setTimeout(() => {
            navigate("/my-classes");
          }, 1800);

          return;
        }

        try {
          const enrollmentRes = await axios.get(
            `${API_BASE_URL}/enrollments/payment-success`,
            {
              params: { session_id: sessionId },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          setSessionInfo(enrollmentRes.data);
          setPaymentType("enrollment");

          setTimeout(() => {
            navigate("/my-classes");
          }, 1800);

          return;
        } catch (enrollmentErr) {
          const enrollmentMessage =
            enrollmentErr?.response?.data?.message || "";

          if (
            enrollmentErr?.response?.status === 404 ||
            enrollmentErr?.response?.status === 400 ||
            enrollmentMessage.toLowerCase().includes("enrollment")
          ) {
            const bookingRes = await axios.get(
              `${API_BASE_URL}/bookings/payment-success`,
              {
                params: { session_id: sessionId },
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            setSessionInfo(bookingRes.data);
            setPaymentType("booking");

            setTimeout(() => {
              navigate("/my-bookings");
            }, 1800);

            return;
          }

          throw enrollmentErr;
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to confirm payment");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [sessionId, typeParam, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-white">
        <div className="text-zinc-700">Verifying your payment...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen grid place-items-center bg-white px-6">
        <div className="w-full max-w-xl rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (paymentType === "booking") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white px-6 py-14">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-emerald-100 bg-white p-8 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
            ✓
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">
            Payment Success
          </p>

          <h1 className="mt-2 text-4xl font-bold text-zinc-900">
            Your booking payment was completed
          </h1>

          <p className="mt-4 text-zinc-600">
            Stripe confirmed your salon booking payment successfully.
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Redirecting to your bookings...
          </p>

          <div className="mt-8 rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                  Payment Status
                </p>
                <p className="mt-2 text-lg font-semibold text-zinc-900">paid</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                  Session
                </p>
                <p className="mt-2 break-all text-sm font-medium text-zinc-900">
                  {sessionId}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/billing"
              className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              View Billing History
            </Link>

            <Link
              to="/my-bookings"
              className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900"
            >
              Back to My Bookings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const enrollment = sessionInfo?.enrollment;
  const classItem = enrollment?.classItem;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white px-6 py-14">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-emerald-100 bg-white p-8 shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
          ✓
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">
          Payment Success
        </p>

        <h1 className="mt-2 text-4xl font-bold text-zinc-900">
          Your payment was completed
        </h1>

        <p className="mt-4 text-zinc-600">
          Stripe confirmed your class payment successfully.
        </p>

        <p className="mt-2 text-sm text-zinc-500">
          Redirecting to your classes...
        </p>

        <div className="mt-8 rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                Enrollment Status
              </p>
              <p className="mt-2 text-lg font-semibold text-zinc-900">
                {enrollment?.paymentStatus || "paid"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                Class
              </p>
              <p className="mt-2 text-lg font-semibold text-zinc-900">
                {classItem?.title || "GlowSuite Class"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                Amount
              </p>
              <p className="mt-2 text-lg font-semibold text-zinc-900">
                ${Number(enrollment?.amount || 0).toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                Session
              </p>
              <p className="mt-2 break-all text-sm font-medium text-zinc-900">
                {enrollment?.stripeSessionId || sessionId}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/billing"
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            View Billing History
          </Link>

          <Link
            to="/my-classes"
            className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900"
          >
            Back to My Classes
          </Link>
        </div>
      </div>
    </div>
  );
}
