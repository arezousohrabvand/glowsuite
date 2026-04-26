import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { servicesData } from "../data/servicesData";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function normalizeService(service) {
  return {
    id: service._id || service.id,
    _id: service._id || service.id,
    slug: service.slug,
    name: service.name || "Service",
    category: service.category || "Other",
    price:
      typeof service.price === "string"
        ? service.price
        : `$${Number(service.price || 0).toFixed(2)}`,
    duration:
      typeof service.duration === "string"
        ? service.duration
        : `${service.duration || service.durationMinutes || 60} min`,
    description: service.description || "Premium salon service.",
    longDescription:
      service.longDescription ||
      service.description ||
      "A premium salon service tailored to your hair goals.",
    stylist: service.stylist || service.stylistName || "GlowSuite stylist",
    stylistRole: service.stylistRole || "Salon specialist",
    stylistExperience:
      service.stylistExperience || "Experienced GlowSuite salon professional",
    image:
      service.image ||
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
    features: service.features?.length
      ? service.features
      : ["Consultation included"],
    benefits: service.benefits?.length
      ? service.benefits
      : ["Personalized service", "Professional salon care", "Polished finish"],
    bestFor: service.bestFor?.length
      ? service.bestFor
      : ["Clients wanting a premium salon result"],
    gallery: service.gallery?.length
      ? service.gallery
      : [
          service.image ||
            "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
        ],
  };
}

function findService(list, id) {
  return list.find(
    (item) =>
      String(item._id) === String(id) ||
      String(item.id) === String(id) ||
      String(item.slug) === String(id),
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-zinc-50 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-zinc-900">{value}</p>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
      {children}
    </span>
  );
}

export default function ServiceDetails() {
  const { id } = useParams();

  const [service, setService] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadService() {
      try {
        const res = await axios.get(`${API_BASE_URL}/services`);
        const backendData = Array.isArray(res.data) ? res.data : [];

        const source =
          backendData.length > 0
            ? backendData.map(normalizeService)
            : servicesData.map(normalizeService);

        const selected = findService(source, id);

        setService(selected || null);

        if (selected) {
          setRelatedServices(
            source
              .filter(
                (item) =>
                  item.category === selected.category &&
                  String(item._id) !== String(selected._id),
              )
              .slice(0, 3),
          );
        }
      } catch (error) {
        console.error("Failed to load service details:", error);

        const fallbackData = servicesData.map(normalizeService);
        const selected = findService(fallbackData, id);

        setService(selected || null);

        if (selected) {
          setRelatedServices(
            fallbackData
              .filter(
                (item) =>
                  item.category === selected.category &&
                  String(item._id) !== String(selected._id),
              )
              .slice(0, 3),
          );
        }
      } finally {
        setLoading(false);
      }
    }

    loadService();
  }, [id]);

  if (loading) {
    return <div className="p-10 text-zinc-600">Loading service details...</div>;
  }

  if (!service) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-zinc-900">Service not found</h1>
        <p className="mt-3 text-zinc-600">
          The service you’re looking for does not exist.
        </p>
        <Link
          to="/services"
          className="mt-6 inline-flex rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white"
        >
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white text-zinc-900">
      <section className="relative overflow-hidden border-b border-rose-100">
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12">
          <div className="mb-6">
            <Link
              to="/services"
              className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-900"
            >
              ← Back to Services
            </Link>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-black/5">
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-[430px] w-full object-cover"
                />
              </div>

              <div className="mt-8">
                <div className="flex flex-wrap gap-2">
                  <Badge>{service.category}</Badge>
                  <Badge>{service.duration}</Badge>
                  {service.features.map((feature) => (
                    <Badge key={feature}>{feature}</Badge>
                  ))}
                </div>

                <h1 className="mt-5 text-4xl font-bold leading-tight">
                  {service.name}
                </h1>

                <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600 md:text-lg">
                  {service.longDescription}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <InfoCard label="Category" value={service.category} />
                  <InfoCard label="Duration" value={service.duration} />
                  <InfoCard label="Price" value={service.price} />
                  <InfoCard label="Stylist" value={service.stylist} />
                </div>
              </div>
            </div>

            <div className="h-fit rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
                Book this service
              </p>

              <div className="mt-4 rounded-3xl bg-zinc-900 p-6 text-white">
                <p className="text-sm text-white/70">Starting at</p>
                <p className="mt-2 text-4xl font-bold">{service.price}</p>
                <p className="mt-2 text-sm text-white/70">{service.duration}</p>

                <Link
                  to={`/booking?service=${service._id}`}
                  className="mt-6 block w-full rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-zinc-900 transition hover:bg-rose-100"
                >
                  Book Appointment
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                <InfoCard label="Service" value={service.name} />
                <InfoCard label="Best with" value={service.stylist} />
                <InfoCard
                  label="Experience"
                  value={service.stylistExperience}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 md:px-10 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
              Stylist Profile
            </p>

            <h2 className="mt-6 text-2xl font-bold text-zinc-900">
              {service.stylist}
            </h2>
            <p className="mt-1 text-sm font-medium text-zinc-600">
              {service.stylistRole}
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              {service.stylistExperience}
            </p>
          </div>

          <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
              Service Benefits
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {service.benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="rounded-2xl bg-zinc-50 px-4 py-4 text-sm font-medium text-zinc-700"
                >
                  ✓ {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {relatedServices.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-8 md:px-10 lg:px-12">
          <h2 className="mb-8 text-3xl font-bold">
            More in {service.category}
          </h2>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {relatedServices.map((item) => (
              <div
                key={item._id}
                className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-56 w-full object-cover"
                />

                <div className="p-6">
                  <p className="text-sm font-medium text-rose-600">
                    {item.category}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-zinc-900">
                    {item.name}
                  </h3>

                  <div className="mt-5 flex items-center justify-between">
                    <p className="text-lg font-bold text-zinc-900">
                      {item.price}
                    </p>
                    <Link
                      to={`/services/${item._id}`}
                      className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-12 md:px-10 lg:px-12">
        <div className="overflow-hidden rounded-[2.25rem] bg-zinc-900 px-8 py-12 text-white shadow-2xl">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-300">
                Ready for your appointment?
              </p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                Book {service.name} with our salon team
              </h2>
            </div>

            <div className="flex flex-wrap gap-4 lg:justify-end">
              <Link
                to={`/booking?service=${service._id}`}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-rose-100"
              >
                Book Now
              </Link>
              <Link
                to="/services"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
