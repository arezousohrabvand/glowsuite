import { Link, useParams } from "react-router-dom";
import { servicesData } from "../data/servicesData";

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

function getServicesForStylist(stylistName) {
  return servicesData.filter((service) => service.stylist === stylistName);
}

export default function StylistDetails() {
  const { id } = useParams();
  const stylist = stylists.find((item) => item.id === Number(id));

  if (!stylist) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-zinc-900">Stylist not found</h1>
        <p className="mt-4 text-zinc-600">
          The stylist profile you are looking for does not exist.
        </p>
        <Link
          to="/stylists"
          className="mt-6 inline-block rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white"
        >
          Back to Stylists
        </Link>
      </div>
    );
  }

  const stylistServices = getServicesForStylist(stylist.name);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white text-zinc-900">
      <section className="mx-auto max-w-7xl px-6 py-14 md:px-10 lg:px-12">
        <Link
          to="/stylists"
          className="mb-8 inline-block text-sm font-semibold text-rose-600 hover:underline"
        >
          ← Back to all stylists
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[2rem] shadow-xl">
            <img
              src={stylist.image}
              alt={stylist.name}
              className="h-[520px] w-full object-cover"
            />
          </div>

          <div>
            <p className="inline-block rounded-full bg-rose-100 px-4 py-1 text-sm font-medium text-rose-700">
              {stylist.role}
            </p>

            <h1 className="mt-4 text-4xl font-bold md:text-5xl">
              {stylist.name}
            </h1>

            <p className="mt-3 text-lg text-zinc-500">{stylist.vibe}</p>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700">
                {stylist.experience}
              </span>
              <span className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700">
                {stylistServices.length} Services
              </span>
            </div>

            <p className="mt-6 text-base leading-7 text-zinc-600">
              {stylist.bio}
            </p>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-zinc-900">Specialties</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {stylist.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="rounded-full bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 ring-1 ring-rose-100"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to={`/booking?stylist=${encodeURIComponent(stylist.name)}`}
                className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                Book with {stylist.name}
              </Link>

              <Link
                to="/services"
                className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-10 lg:px-12">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900">
          Services by {stylist.name}
        </h2>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {stylistServices.map((service) => (
            <div
              key={service.id}
              className="rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <Link
                to={`/services/${service.id}`}
                className="block transition hover:text-rose-600"
              >
                <p className="text-lg font-semibold text-zinc-900">
                  {service.name}
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  {service.category} • {service.price}
                </p>
                <p className="mt-3 text-sm text-zinc-600">
                  {service.description}
                </p>
              </Link>

              <Link
                to={`/booking?stylist=${encodeURIComponent(stylist.name)}&service=${encodeURIComponent(service.id)}`}
                className="mt-4 inline-flex rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                Book this service
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
