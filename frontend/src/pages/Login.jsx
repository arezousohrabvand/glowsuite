import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveAuth } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        },
      );

      const data = res.data;

      const token = data.token || data.accessToken || "";
      const role = data.role || data.user?.role || "customer";

      localStorage.setItem("token", token);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          ...data,
          role,
          token,
        }),
      );

      if (saveAuth) {
        saveAuth({
          ...data,
          role,
          token,
        });
      }

      const redirectTo =
        location.state?.from?.pathname ||
        (role === "admin" ? "/admin" : "/dashboard");

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-100 px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        <div className="relative hidden overflow-hidden p-10 text-white md:flex md:flex-col md:justify-between">
          <img
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
            alt="Salon"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-pink-700/70 to-rose-500/70" />

          <div className="relative z-10">
            <h1 className="text-3xl font-bold tracking-wide">GlowSuite</h1>
            <p className="mt-4 text-sm leading-relaxed text-white/90">
              Premium salon experience with modern booking and management.
            </p>
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl font-semibold leading-snug">
              Welcome back to your beauty experience
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              Access your bookings, classes, and account in one elegant place.
            </p>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-500">
            Login to your GlowSuite account
          </p>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-pink-600 px-4 py-3 font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-pink-600 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
