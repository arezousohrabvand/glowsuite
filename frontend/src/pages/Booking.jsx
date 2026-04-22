import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { servicesData } from "../data/servicesData";
import {
  createBooking,
  rescheduleBooking,
  holdBookingSlot,
  releaseBookingHold,
} from "../api/bookingApi";

const stylists = [
  {
    name: "Charlotte Kim",
    role: "Precision Cutting Specialist",
    specialties: ["Cuts", "Fringe", "Face Framing"],
  },
  {
    name: "Sophia Bennett",
    role: "Master Color Educator",
    specialties: ["Color", "Balayage", "Gloss"],
  },
  {
    name: "Mia Carter",
    role: "Luxury Styling Educator",
    specialties: ["Blowouts", "Waves", "Styling"],
  },
  {
    name: "Olivia Reed",
    role: "Bridal Hair Artist",
    specialties: ["Bridal", "Event Styling"],
  },
  {
    name: "Ava Martinez",
    role: "Texture Specialist",
    specialties: ["Texture", "Curls", "Hydration"],
  },
  {
    name: "Isabella Moore",
    role: "Master Smoothing Educator",
    specialties: ["Treatment", "Keratin", "Smoothing"],
  },
  {
    name: "Emma Hayes",
    role: "Hair Wellness Coach",
    specialties: ["Wellness", "Repair", "Scalp Care"],
  },
];

const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
];

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-bold text-zinc-900">{title}</h2>
      {text ? <p className="mt-3 max-w-2xl text-zinc-600">{text}</p> : null}
    </div>
  );
}

function InfoPill({ children }) {
  return (
    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
      {children}
    </span>
  );
}

export default function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const serviceId = searchParams.get("service");
  const stylistParam = searchParams.get("stylist");

  const isReschedule = location.state?.mode === "reschedule";
  const bookingId = location.state?.bookingId;
  const bookingData = location.state?.bookingData;

  const [holdInfo, setHoldInfo] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [holdingSlot, setHoldingSlot] = useState(false);

  const selectedService = useMemo(() => {
    if (isReschedule && bookingData?.serviceName) {
      return (
        servicesData.find((item) => item.name === bookingData.serviceName) ||
        null
      );
    }

    if (!serviceId) return null;

    return (
      servicesData.find((item) => String(item.id) === String(serviceId)) || null
    );
  }, [serviceId, isReschedule, bookingData]);

  const initialStylist = useMemo(() => {
    if (isReschedule && bookingData?.stylistName) {
      return bookingData.stylistName;
    }

    if (stylistParam) {
      return stylistParam;
    }

    if (selectedService?.stylist) {
      return selectedService.stylist;
    }

    return "";
  }, [isReschedule, bookingData, stylistParam, selectedService]);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    serviceId: selectedService?.id ? String(selectedService.id) : "",
    stylist: initialStylist,
    date: "",
    time: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isReschedule && bookingData) {
      const matchedService =
        servicesData.find((item) => item.name === bookingData.serviceName) ||
        null;

      setForm((prev) => ({
        ...prev,
        serviceId: matchedService?.id ? String(matchedService.id) : "",
        stylist: bookingData.stylistName || matchedService?.stylist || "",
        date: bookingData.date || "",
        time: bookingData.time || "",
        notes: bookingData.notes || "",
      }));
      return;
    }

    setForm((prev) => {
      const next = { ...prev };

      if (stylistParam) {
        next.stylist = stylistParam;
      } else if (selectedService?.stylist && !prev.stylist) {
        next.stylist = selectedService.stylist;
      }

      if (selectedService?.id) {
        next.serviceId = String(selectedService.id);
      }

      return next;
    });
  }, [isReschedule, bookingData, stylistParam, selectedService]);

  useEffect(() => {
    if (!holdInfo?.expiresAt) return;

    const updateTimer = () => {
      const diff = new Date(holdInfo.expiresAt).getTime() - Date.now();
      setTimeLeft(Math.max(0, diff));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [holdInfo]);

  useEffect(() => {
    return () => {
      if (holdInfo?.holdId && holdInfo?.status === "active") {
        releaseBookingHold(holdInfo.holdId).catch(() => {});
      }
    };
  }, [holdInfo]);

  const servicesForSelectedStylist = useMemo(() => {
    if (form.stylist) {
      return servicesData.filter((service) => service.stylist === form.stylist);
    }

    if (stylistParam) {
      return servicesData.filter((service) => service.stylist === stylistParam);
    }

    return servicesData;
  }, [form.stylist, stylistParam]);

  const currentService = useMemo(() => {
    if (!form.serviceId) return null;

    return (
      servicesData.find((item) => String(item.id) === String(form.serviceId)) ||
      null
    );
  }, [form.serviceId]);

  const availableStylists = useMemo(() => {
    if (stylistParam) {
      return stylists.filter((stylist) => stylist.name === stylistParam);
    }

    if (!currentService) return stylists;

    const exactStylist = stylists.filter(
      (stylist) => stylist.name === currentService.stylist,
    );

    if (exactStylist.length) return exactStylist;

    const matched = stylists.filter((stylist) =>
      stylist.specialties.some(
        (specialty) =>
          specialty.toLowerCase() === currentService.category?.toLowerCase(),
      ),
    );

    return matched.length ? matched : stylists;
  }, [currentService, stylistParam]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const isExpired = Boolean(holdInfo) && timeLeft <= 0;

  function clearActiveHold() {
    if (holdInfo?.holdId && holdInfo?.status === "active") {
      releaseBookingHold(holdInfo.holdId).catch(() => {});
    }
    setHoldInfo(null);
    setTimeLeft(0);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    clearActiveHold();

    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "stylist") {
        updated.serviceId = "";
      }

      if (name === "serviceId") {
        const service = servicesData.find(
          (item) => String(item.id) === String(value),
        );

        if (service?.stylist) {
          updated.stylist = service.stylist;
        }
      }

      return updated;
    });

    setError("");
    setSuccessMessage("");
  }

  async function handleReserveSlot() {
    try {
      setError("");
      setSuccessMessage("");

      if (!currentService) {
        setError("Please select a service.");
        return;
      }

      if (!form.stylist || !form.date || !form.time) {
        setError("Please select stylist, date, and time first.");
        return;
      }

      setHoldingSlot(true);

      const data = await holdBookingSlot({
        serviceName: currentService.name,
        stylistName: form.stylist,
        date: form.date,
        time: form.time,
      });

      setHoldInfo({
        holdId: data.holdId,
        expiresAt: data.expiresAt,
        status: data.status,
      });

      setSuccessMessage(
        "Your slot is reserved. Please complete payment within 5 minutes.",
      );
    } catch (err) {
      console.error("Slot hold failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to reserve this slot.");
    } finally {
      setHoldingSlot(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!currentService) {
      setError("Please select a service.");
      return;
    }

    if (!holdInfo?.holdId && !isReschedule) {
      setError("Please reserve your slot before checkout.");
      return;
    }

    if (!isReschedule && isExpired) {
      setError("Your slot hold expired. Please reserve again.");
      return;
    }

    const bookingPayload = {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      serviceName: currentService.name,
      stylistName: form.stylist,
      date: form.date,
      time: form.time,
      notes: form.notes || "",
      price: Number(String(currentService.price).replace(/[^0-9.]/g, "")) || 0,
      holdId: holdInfo?.holdId,
    };

    try {
      setSubmitting(true);

      if (isReschedule && bookingId) {
        const res = await rescheduleBooking(bookingId, {
          date: form.date,
          time: form.time,
          stylistName: form.stylist,
          notes: form.notes || "",
        });

        console.log("Booking updated:", res);
        setSuccessMessage("Booking updated successfully.");

        setTimeout(() => {
          navigate("/my-bookings");
        }, 1200);

        return;
      }

      const data = await createBooking(bookingPayload);
      console.log("Checkout session created:", data);

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      setSuccessMessage("Booking checkout created successfully.");
    } catch (err) {
      console.error("Booking failed:", err.response?.data || err.message);
      setError(
        err.response?.data?.message ||
          (isReschedule
            ? "Failed to update booking."
            : "Failed to create booking checkout."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white text-zinc-900">
      <section className="relative overflow-hidden border-b border-rose-100">
        <div className="absolute -left-16 top-10 h-52 w-52 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-fuchsia-200/30 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:px-10 lg:grid-cols-2 lg:px-12">
          <div>
            <p className="mb-3 inline-block rounded-full bg-rose-100 px-4 py-1 text-sm font-medium text-rose-700">
              Premium Salon Booking
            </p>

            <h1 className="max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
              {isReschedule
                ? "Update your appointment with confidence"
                : "Reserve your luxury salon appointment with confidence"}
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600 md:text-lg">
              {isReschedule
                ? "Adjust your appointment date, time, stylist, and notes in one place."
                : "Choose your service, stylist, date, and time in a premium booking experience designed to match your salon goals."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-white px-4 py-2 text-sm text-zinc-700 shadow-sm ring-1 ring-zinc-100">
                Tailored service matching
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm text-zinc-700 shadow-sm ring-1 ring-zinc-100">
                Stylist recommendations
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm text-zinc-700 shadow-sm ring-1 ring-zinc-100">
                Premium care experience
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-4 -top-4 h-24 w-24 animate-spin rounded-full border border-rose-200 border-dashed opacity-70 [animation-duration:12s]" />
            <div className="overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-black/5">
              <img
                src={
                  currentService?.image ||
                  selectedService?.image ||
                  "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=1400&q=80"
                }
                alt={
                  currentService?.name ||
                  selectedService?.name ||
                  "Salon booking"
                }
                className="h-[420px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {(currentService || selectedService) && (
        <section className="mx-auto max-w-7xl px-6 py-10 md:px-10 lg:px-12">
          <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
            <div className="grid items-center gap-0 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="overflow-hidden">
                <img
                  src={(currentService || selectedService).image}
                  alt={(currentService || selectedService).name}
                  className="h-full min-h-[300px] w-full object-cover"
                />
              </div>

              <div className="p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
                  Selected Service
                </p>
                <h2 className="mt-3 text-3xl font-bold text-zinc-900">
                  {(currentService || selectedService).name}
                </h2>
                <p className="mt-4 leading-7 text-zinc-600">
                  {(currentService || selectedService).longDescription ||
                    (currentService || selectedService).description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <InfoPill>
                    {(currentService || selectedService).category}
                  </InfoPill>
                  <InfoPill>
                    {(currentService || selectedService).duration}
                  </InfoPill>
                  <InfoPill>
                    {(currentService || selectedService).price}
                  </InfoPill>
                  <InfoPill>
                    Stylist:{" "}
                    {form.stylist ||
                      (currentService || selectedService).stylist}
                  </InfoPill>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to={`/services/${(currentService || selectedService).id}`}
                    className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900"
                  >
                    View Service Details
                  </Link>
                  <Link
                    to="/services"
                    className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
                  >
                    Browse More Services
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-4 md:px-10 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
            <SectionTitle
              eyebrow={
                isReschedule ? "Reschedule Appointment" : "Appointment Form"
              }
              title={isReschedule ? "Update your visit" : "Book your visit"}
              text={
                isReschedule
                  ? "Update the details below to reschedule your salon appointment."
                  : "Complete the details below to request your premium salon appointment."
              }
            />

            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-zinc-900">
                  Your Details
                </h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition focus:border-rose-400 focus:bg-white"
                      required={!isReschedule}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition focus:border-rose-400 focus:bg-white"
                      required={!isReschedule}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-zinc-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition focus:border-rose-400 focus:bg-white"
                      required={!isReschedule}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900">
                  Service Selection
                </h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">
                      Preferred Stylist
                    </label>
                    <select
                      name="stylist"
                      value={form.stylist}
                      onChange={handleChange}
                      disabled={holdingSlot || !!stylistParam}
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition focus:border-rose-400 focus:bg-white disabled:opacity-70"
                      required
                    >
                      <option value="">Select a stylist</option>
                      {availableStylists.map((stylist) => (
                        <option key={stylist.name} value={stylist.name}>
                          {stylist.name} • {stylist.role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">
                      Choose Service
                    </label>
                    <select
                      name="serviceId"
                      value={form.serviceId}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition focus:border-rose-400 focus:bg-white"
                      required
                    >
                      <option value="">Select a service</option>
                      {servicesForSelectedStylist.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name} • {service.price}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900">Date & Time</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      disabled={holdingSlot}
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition focus:border-rose-400 focus:bg-white disabled:opacity-70"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">
                      Preferred Time
                    </label>
                    <select
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      disabled={holdingSlot}
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition focus:border-rose-400 focus:bg-white disabled:opacity-70"
                      required
                    >
                      <option value="">Select a time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900">
                  Appointment Notes
                </h3>
                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Tell us about your hair goals
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Share inspiration, preferred look, hair history, or anything you want your stylist to know..."
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition focus:border-rose-400 focus:bg-white"
                  />
                </div>
              </div>

              {holdInfo && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  {isExpired ? (
                    "Your slot hold has expired. Please reserve again."
                  ) : (
                    <>
                      This slot is reserved for you for{" "}
                      <strong>
                        {minutes}:{String(seconds).padStart(2, "0")}
                      </strong>
                    </>
                  )}
                </div>
              )}

              {!isReschedule && (
                <button
                  type="button"
                  onClick={handleReserveSlot}
                  disabled={
                    holdingSlot ||
                    !!holdInfo?.holdId ||
                    !form.stylist ||
                    !form.date ||
                    !form.time ||
                    !form.serviceId
                  }
                  className="inline-flex rounded-full border border-zinc-300 px-7 py-3 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {holdingSlot
                    ? "Reserving..."
                    : holdInfo?.holdId
                      ? "Slot Reserved"
                      : "Reserve Slot for 5 Minutes"}
                </button>
              )}

              <button
                type="submit"
                disabled={
                  isReschedule
                    ? submitting
                    : submitting || !holdInfo?.holdId || isExpired
                }
                className="inline-flex rounded-full bg-zinc-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? isReschedule
                    ? "Updating..."
                    : "Submitting..."
                  : isReschedule
                    ? "Update Booking"
                    : holdInfo?.holdId
                      ? "Continue to Payment"
                      : "Reserve Slot First"}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
                Booking Summary
              </p>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-zinc-400">
                    Service
                  </p>
                  <p className="mt-2 font-semibold text-zinc-900">
                    {currentService?.name || "Not selected yet"}
                  </p>
                </div>

                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-zinc-400">
                    Stylist
                  </p>
                  <p className="mt-2 font-semibold text-zinc-900">
                    {form.stylist || "Not selected yet"}
                  </p>
                </div>

                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-zinc-400">
                    Date & Time
                  </p>
                  <p className="mt-2 font-semibold text-zinc-900">
                    {form.date || "Choose a date"}{" "}
                    {form.time ? `• ${form.time}` : ""}
                  </p>
                </div>

                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-zinc-400">
                    Price
                  </p>
                  <p className="mt-2 font-semibold text-zinc-900">
                    {currentService?.price || ""}
                  </p>
                </div>

                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-zinc-400">
                    Duration
                  </p>
                  <p className="mt-2 font-semibold text-zinc-900">
                    {currentService?.duration || ""}
                  </p>
                </div>

                {holdInfo && (
                  <div className="rounded-2xl bg-amber-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-amber-500">
                      Slot Hold
                    </p>
                    <p className="mt-2 font-semibold text-zinc-900">
                      {isExpired
                        ? "Expired"
                        : `${minutes}:${String(seconds).padStart(2, "0")} remaining`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {currentService && (
              <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
                <img
                  src={currentService.image}
                  alt={currentService.name}
                  className="h-64 w-full object-cover"
                />

                <div className="p-6">
                  <h3 className="text-xl font-bold text-zinc-900">
                    {currentService.name}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600">
                    Stylist: {form.stylist || currentService.stylist}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {currentService.features?.map((feature) => (
                      <InfoPill key={feature}>{feature}</InfoPill>
                    ))}
                  </div>

                  <p className="mt-4 text-sm leading-6 text-zinc-600">
                    {currentService.description}
                  </p>
                </div>
              </div>
            )}

            <div className="rounded-[2rem] bg-zinc-900 p-6 text-white shadow-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-300">
                Need help deciding?
              </p>
              <h3 className="mt-3 text-2xl font-bold">
                Book a consultation first
              </h3>
              <p className="mt-3 text-white/75">
                If you are unsure which service is best, our salon team can
                guide you based on your hair goals, texture, and maintenance
                preferences.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/services"
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-rose-100"
                >
                  Browse Services
                </Link>
                <Link
                  to="/stylists"
                  className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Meet Stylists
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
