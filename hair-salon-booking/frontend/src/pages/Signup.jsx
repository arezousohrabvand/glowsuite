import { useForm } from "react-hook-form";
import { signupUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Signup() {
  const { saveAuth } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setServerError("");

      const response = await signupUser({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        password: data.password,
      });

      saveAuth(response);
      toast.success("Account created successfully");
      navigate("/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message || "Signup failed. Please try again.";
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-100 px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        {/* LEFT SIDE (IMAGE + DARK OVERLAY) */}
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
              Join the premium salon platform
            </p>
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl font-semibold leading-snug">
              Start your beauty experience today
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              Book services, join classes, and manage everything in one place.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="p-8 sm:p-10">
          <h2 className="text-3xl font-bold text-gray-900">Create account</h2>
          <p className="mt-2 text-sm text-gray-500">
            Join GlowSuite to book salon services and classes.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  First name
                </label>
                <input
                  type="text"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500"
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <input
                  type="text"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500"
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Phone number
              </label>
              <input
                type="tel"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9+\-\s()]{7,20}$/,
                    message: "Enter a valid phone number",
                  },
                })}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500"
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/i,
                    message: "Enter a valid email",
                  },
                })}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500"
                placeholder="Create a password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {serverError && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-pink-600 px-4 py-3 font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-pink-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
