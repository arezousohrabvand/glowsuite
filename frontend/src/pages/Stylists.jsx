import { Link } from "react-router-dom";
import { servicesData } from "../data/servicesData";
import { useAuth } from "../context/AuthContext";

const stylists = [
  {
    id: 1,
    name: "Charlotte Kim",
    role: "Precision Cutting Specialist",
    experience: "11+ years",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
    bio: "Charlotte is known for polished precision cutting, modern shape refinement, face-framing balance, and elegant finishes tailored to each client’s features.",
    specialties: [
      "Precision Cuts",
      "Fringe Design",
      "Face Framing",
      "Shape Refresh",
    ],
    vibe: "Refined • Modern • Detail-focused",
  },
  {
    id: 2,
    name: "Sophia Bennett",
    role: "Master Color Educator",
    experience: "12+ years",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=1200&q=80",
    bio: "Sophia specializes in dimensional blonding, balayage placement, gloss refinement, and luxury color services designed for seamless grow-out and elevated shine.",
    specialties: [
      "Balayage",
      "Luxury Blonding",
      "Gloss & Tone",
      "Dimensional Color",
    ],
    vibe: "Luxury • Dimensional • Signature Color",
  },
  {
    id: 3,
    name: "Mia Carter",
    role: "Luxury Styling Educator",
    experience: "8+ years",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1200&q=80",
    bio: "Mia creates polished blowouts, soft glam styling, and editorial-inspired waves with movement, shine, and long-lasting structure.",
    specialties: ["Blowouts", "Editorial Waves", "Soft Glam", "Event Styling"],
    vibe: "Polished • Glam • Camera-ready",
  },
  {
    id: 4,
    name: "Olivia Reed",
    role: "Bridal Hair Artist",
    experience: "10+ years",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80",
    bio: "Olivia focuses on elegant bridal styling, event beauty, secure structure, and romantic finishes that look polished in person and on camera.",
    specialties: [
      "Bridal Hair",
      "Preview Sessions",
      "Event Styling",
      "Elegant Updos",
    ],
    vibe: "Elegant • Romantic • Bridal Luxury",
  },
  {
    id: 5,
    name: "Ava Martinez",
    role: "Texture Specialist",
    experience: "9+ years",
    image:
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=1200&q=80",
    bio: "Ava works with curls, waves, and natural texture to build healthier definition, hydration, softness, and movement without heaviness.",
    specialties: ["Curl Care", "Texture Styling", "Hydration", "Frizz Control"],
    vibe: "Natural • Healthy • Definition-first",
  },
  {
    id: 6,
    name: "Isabella Moore",
    role: "Master Smoothing Educator",
    experience: "13+ years",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
    bio: "Isabella delivers sleek smoothing services, repair-focused treatment planning, and high-shine finishes for clients who want polished control and softness.",
    specialties: [
      "Keratin",
      "Smoothing",
      "Shine Services",
      "Repair Treatments",
    ],
    vibe: "Sleek • Smooth • High-shine",
  },
  {
    id: 7,
    name: "Emma Hayes",
    role: "Hair Wellness Coach",
    experience: "7+ years",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
    bio: "Emma blends wellness-based salon care with restorative treatments, scalp balance support, and healthy-hair routines that feel luxurious and practical.",
    specialties: [
      "Scalp Care",
      "Repair Rituals",
      "Hair Wellness",
      "Hydration Care",
    ],
    vibe: "Restorative • Wellness • Healthy Hair",
  },
];

function Badge({ children }) {
  return (
    <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
      {children}
    </span>
  );
}

function getServicesForStylist(stylistName) {
  return servicesData.filter((service) => service.stylist === stylistName);
}

export default function Stylists() {
  const featuredStylists = stylists.slice(0, 3);
  const { isAuthenticated, user } = useAuth();
  const dashboardPath = user?.role === "admin" ? "/admin" : "/dashboard";

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white text-zinc-900">
      <section className="relative overflow-hidden border-b border-rose-100">
        <div className="absolute -left-16 top-12 h-56 w-56 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-fuchsia-200/30 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:px-10 lg:grid-cols-2 lg:px-12">
          <div>
            <div className="mb-6 flex flex-wrap gap-3">
              {isAuthenticated && (
                <Link
                  to={dashboardPath}
                  className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900 hover:bg-zinc-50"
                >
                  ← Dashboard
                </Link>
              )}

              <Link
                to="/booking"
                className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                Book Appointment
              </Link>

              <Link
                to="/services"
                className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900"
              >
                View Services
              </Link>
            </div>

            <p className="mb-3 inline-block rounded-full bg-rose-100 px-4 py-1 text-sm font-medium text-rose-700">
              Meet Our Salon Artists
            </p>

            <h1 className="max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
              Expert stylists with premium specialties and signature techniques
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600 md:text-lg">
              Discover the stylists behind our cuts, color, bridal beauty,
              smoothing services, texture care, and wellness treatments. Each
              artist brings a distinct specialty and luxury salon experience.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-white px-4 py-2 text-sm text-zinc-700 shadow-sm ring-1 ring-zinc-100">
                Tailored consultations
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm text-zinc-700 shadow-sm ring-1 ring-zinc-100">
                Luxury service standards
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm text-zinc-700 shadow-sm ring-1 ring-zinc-100">
                Specialist-driven care
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-4 -top-4 h-24 w-24 animate-spin rounded-full border border-rose-200 border-dashed opacity-70 [animation-duration:12s]" />
            <div className="overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-black/5">
              <img
                src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1400&q=80"
                alt="Luxury salon team"
                className="h-[440px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 md:px-10 lg:px-12">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
            Featured Stylists
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            Meet the artists clients love most
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {featuredStylists.map((stylist) => {
            const stylistServices = getServicesForStylist(stylist.name);

            return (
              <div
                key={stylist.id}
                className="group overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="overflow-hidden">
                  <img
                    src={stylist.image}
                    alt={stylist.name}
                    className="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-6">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Badge>{stylist.role}</Badge>
                    <Badge>{stylist.experience}</Badge>
                  </div>

                  <h3 className="text-2xl font-bold text-zinc-900">
                    {stylist.name}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-zinc-500">
                    {stylist.vibe}
                  </p>

                  <p className="mt-4 text-sm leading-6 text-zinc-600">
                    {stylist.bio}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {stylist.specialties.slice(0, 3).map((specialty) => (
                      <span
                        key={specialty}
                        className="rounded-full bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 ring-1 ring-zinc-100"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-zinc-500">
                      {stylistServices.length} services available
                    </p>
                    <Link
                      to={`/booking?stylist=${encodeURIComponent(stylist.name)}`}
                      className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-4 md:px-10 lg:px-12">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
              Full Salon Team
            </p>
            <h2 className="mt-2 text-3xl font-bold text-zinc-900">
              Choose the stylist that fits your goals
            </h2>
            <p className="mt-3 max-w-2xl text-zinc-600">
              Explore our salon artists by specialty, style, and signature
              services.
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {stylists.map((stylist) => {
            const stylistServices = getServicesForStylist(stylist.name);

            return (
              <div
                key={stylist.id}
                className="group overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={stylist.image}
                    alt={stylist.name}
                    className="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent p-5">
                    <p className="text-xl font-bold text-white">
                      {stylist.name}
                    </p>
                    <p className="mt-1 text-sm text-white/85">{stylist.role}</p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Badge>{stylist.experience}</Badge>
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                      {stylistServices.length} Services
                    </span>
                  </div>

                  <p className="text-sm font-medium text-zinc-500">
                    {stylist.vibe}
                  </p>

                  <p className="mt-4 text-sm leading-6 text-zinc-600">
                    {stylist.bio}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {stylist.specialties.slice(0, 3).map((specialty) => (
                      <span
                        key={specialty}
                        className="rounded-full bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 ring-1 ring-zinc-100"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 grid gap-3">
                    {stylistServices.slice(0, 2).map((service) => (
                      <Link
                        key={service.id}
                        to={`/services/${service.id}`}
                        className="rounded-2xl bg-zinc-50 p-4 transition hover:bg-rose-50"
                      >
                        <p className="text-sm font-semibold text-zinc-900">
                          {service.name}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {service.category} • {service.price}
                        </p>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      to={`/booking?stylist=${encodeURIComponent(stylist.name)}`}
                      className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
                    >
                      Book Now
                    </Link>

                    <Link
                      to={`/stylists/${stylist.id}`}
                      className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-10 lg:px-12">
        <div className="overflow-hidden rounded-[2.25rem] bg-zinc-900 px-8 py-12 text-white shadow-2xl">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-300">
                Personalized salon match
              </p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                Need help choosing your stylist?
              </h2>
              <p className="mt-4 max-w-xl text-white/75">
                Book a consultation and we’ll guide you to the stylist and
                service combination that best fits your hair goals, texture, and
                routine.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 lg:justify-end">
              <Link
                to="/booking"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-rose-100"
              >
                Book Consultation
              </Link>
              <Link
                to="/services"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
