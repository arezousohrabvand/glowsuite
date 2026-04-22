import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { CheckCircle2, UserRound, Mail, Phone } from "lucide-react";
import { getMyProfile, updateMyProfile } from "../api/profileApi";

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">
        {label}
      </p>
      <p className="mt-1 break-all text-base font-medium text-zinc-900">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function FloatingInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  icon,
  placeholder = " ",
}) {
  return (
    <div>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
          {icon}
        </span>

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`peer w-full rounded-xl border bg-white px-10 pb-2 pt-6 text-sm text-zinc-900 outline-none transition ${
            error
              ? "border-rose-300 ring-1 ring-rose-100 focus:border-rose-400"
              : "border-zinc-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
          }`}
        />

        <label
          htmlFor={name}
          className={`absolute left-10 top-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
            error ? "text-rose-500" : "text-zinc-400"
          }`}
        >
          {label}
        </label>
      </div>

      {error ? <p className="mt-1 text-xs text-rose-500">{error}</p> : null}
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setPageError("");

        const data = await getMyProfile();

        setProfile({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
          email: data.email || "",
        });
      } catch (error) {
        console.error("Failed to load profile:", error);
        setPageError(error.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const fullName = useMemo(() => {
    return (
      `${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
      "Glow Member"
    );
  }, [profile.firstName, profile.lastName]);

  const initial = profile.firstName?.[0]?.toUpperCase() || "G";

  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
        if (!value.trim()) return "First name is required";
        if (value.trim().length < 2) return "First name is too short";
        return "";

      case "lastName":
        if (!value.trim()) return "Last name is required";
        if (value.trim().length < 2) return "Last name is too short";
        return "";

      case "phone":
        if (!value.trim()) return "Phone number is required";
        if (!/^[0-9+\-\s()]{7,20}$/.test(value.trim())) {
          return "Enter a valid phone number";
        }
        return "";

      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^\S+@\S+\.\S+$/i.test(value.trim())) {
          return "Enter a valid email";
        }
        return "";

      default:
        return "";
    }
  };

  const validateForm = () => {
    const nextErrors = {
      firstName: validateField("firstName", profile.firstName),
      lastName: validateField("lastName", profile.lastName),
      phone: validateField("phone", profile.phone),
      email: validateField("email", profile.email),
    };

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));

    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);
      setSaved(false);

      const updated = await updateMyProfile(profile);

      setProfile({
        firstName: updated.firstName || "",
        lastName: updated.lastName || "",
        phone: updated.phone || "",
        email: updated.email || "",
      });

      setSaved(true);
      toast.success(updated.message || "Profile updated successfully");

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 h-10 w-48 rounded bg-zinc-100" />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-96 rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100" />
            <div className="h-96 rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100" />
          </div>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            {pageError}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white text-zinc-900">
      <section className="relative overflow-hidden border-b border-rose-100">
        <div className="absolute -left-16 top-10 h-52 w-52 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-fuchsia-200/30 blur-3xl" />

        <div className="mx-auto max-w-6xl px-6 py-14 md:px-10 lg:px-12">
          <div className="mb-8 flex flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900 hover:bg-zinc-50"
            >
              ← Dashboard
            </Link>

            <Link
              to="/booking"
              className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
            >
              Book New Appointment
            </Link>
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-500">
            Client Profile Center
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
            My Profile
          </h1>
          <p className="mt-4 max-w-2xl text-zinc-600">
            View your personal details, update your account information, and
            keep your GlowSuite profile current.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            <StatCard label="First Name" value={profile.firstName} />
            <StatCard label="Last Name" value={profile.lastName} />
            <StatCard label="Phone" value={profile.phone} />
            <StatCard label="Email" value={profile.email} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-10 md:px-10 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-2xl font-bold text-rose-600">
                {initial}
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-500">
                  Client Account
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-zinc-900">
                  {fullName}
                </h2>
                <p className="mt-1 break-all text-sm text-zinc-500">
                  {profile.email || "No email provided"}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-xl bg-zinc-50 px-4 py-3 ring-1 ring-zinc-100">
                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                  First Name
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-900">
                  {profile.firstName || "Not provided"}
                </p>
              </div>

              <div className="rounded-xl bg-zinc-50 px-4 py-3 ring-1 ring-zinc-100">
                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                  Last Name
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-900">
                  {profile.lastName || "Not provided"}
                </p>
              </div>

              <div className="rounded-xl bg-zinc-50 px-4 py-3 ring-1 ring-zinc-100">
                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                  Phone Number
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-900">
                  {profile.phone || "Not provided"}
                </p>
              </div>

              <div className="rounded-xl bg-zinc-50 px-4 py-3 ring-1 ring-zinc-100">
                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                  Email Address
                </p>
                <p className="mt-1 break-all text-sm font-semibold text-zinc-900">
                  {profile.email || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-500">
                  Edit Profile
                </p>
                <h2 className="mt-2 text-2xl font-bold text-zinc-900">
                  Update Personal Information
                </h2>
                <p className="mt-2 text-zinc-600">
                  Keep your account details accurate for bookings, updates, and
                  communication.
                </p>
              </div>

              <AnimatePresence>
                {saved && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Saved
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <FloatingInput
                  label="First Name"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  icon={<UserRound className="h-4 w-4" />}
                />

                <FloatingInput
                  label="Last Name"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  icon={<UserRound className="h-4 w-4" />}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FloatingInput
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  icon={<Phone className="h-4 w-4" />}
                />

                <FloatingInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  error={errors.email}
                  icon={<Mail className="h-4 w-4" />}
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <Link
                  to="/dashboard"
                  className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900 hover:bg-zinc-50"
                >
                  Back to Dashboard
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
