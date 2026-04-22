import { Link } from "react-router-dom";
import { servicesData } from "../data/servicesData";

const featuredServices = servicesData.slice(0, 4);

const stylists = [
  {
    id: 1,
    name: "Charlotte Kim",
    role: "Precision Cutting Specialist",
    experience: "11+ years",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
    bio: "Modern cuts, face framing, and polished shape refinement.",
  },
  {
    id: 2,
    name: "Sophia Bennett",
    role: "Master Color Educator",
    experience: "12+ years",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=1200&q=80",
    bio: "Luxury blonding, balayage, and dimensional color results.",
  },
  {
    id: 3,
    name: "Olivia Reed",
    role: "Bridal Hair Artist",
    experience: "10+ years",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80",
    bio: "Elegant bridal styling and event-ready beauty finishes.",
  },
];

const testimonials = [
  {
    id: 1,
    name: "Amelia R.",
    role: "Balayage Client",
    text: "The salon feels luxurious from the moment you walk in. My balayage looked soft, expensive, and exactly what I wanted.",
  },
  {
    id: 2,
    name: "Sophia W.",
    role: "Styling Client",
    text: "Best blowout and styling experience I’ve had. The finish lasted beautifully and the whole service felt premium.",
  },
  {
    id: 3,
    name: "Nina C.",
    role: "Bridal Client",
    text: "My bridal hair was elegant, secure, and photographed perfectly. The team made everything feel calm and polished.",
  },
];

const classesPreview = [
  {
    id: 1,
    title: "Bridal Styling Masterclass",
    level: "Advanced",
    duration: "3 Hours",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
    text: "Refined bridal looks, long-wear styling, and luxury finishing techniques.",
  },
  {
    id: 2,
    title: "Blowout & Volume Workshop",
    level: "Beginner Friendly",
    duration: "2 Hours",
    image:
      "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=1200&q=80",
    text: "Learn elevated volume, smooth finish control, and polished salon movement.",
  },
  {
    id: 3,
    title: "Modern Color Placement",
    level: "Intermediate",
    duration: "4 Hours",
    image:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80",
    text: "Luxury blonding, face-framing brightness, and dimensional color placement.",
  },
];

const gallery = [
  {
    id: 1,
    title: "Soft Blonde Dimension",
    image:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "Luxury Blowout",
    image:
      "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "Bridal Finish",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    title: "Editorial Waves",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    title: "Sleek Smoothing",
    image:
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 6,
    title: "Precision Cut",
    image:
      "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?auto=format&fit=crop&w=1200&q=80",
  },
];

function SectionIntro({ eyebrow, title, text, align = "left" }) {
  return (
    <div
      className={`mb-8 ${
        align === "center" ? "mx-auto max-w-3xl text-center" : ""
      }`}
    >
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-500">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-bold text-zinc-900 md:text-4xl">
        {title}
      </h2>
      {text ? <p className="mt-3 max-w-2xl text-zinc-600">{text}</p> : null}
    </div>
  );
}

function Pill({ children }) {
  return (
    <span className="rounded-full bg-white/85 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm ring-1 ring-black/5 backdrop-blur">
      {children}
    </span>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white text-zinc-900">
      <Link
        to="/booking"
        className="fixed bottom-5 right-5 z-50 rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-2xl transition hover:-translate-y-0.5 hover:bg-rose-600"
      >
        Book Appointment
      </Link>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-rose-100">
        <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-fuchsia-200/30 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-24">
          <div className="relative">
            <div className="mb-4 inline-flex rounded-full bg-rose-100 px-4 py-1 text-sm font-medium text-rose-700">
              Luxury Hair • Color • Styling • Bridal
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-tight md:text-6xl">
              Modern salon luxury with polished results and premium care
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-600 md:text-lg">
              Discover tailored cuts, dimensional color, smoothing services,
              bridal beauty, and premium styling experiences designed around
              your goals, texture, and lifestyle.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/booking"
                className="rounded-full bg-zinc-900 px-7 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-rose-600 hover:shadow-lg"
              >
                Book Now
              </Link>
              <Link
                to="/services"
                className="rounded-full border border-zinc-300 bg-white px-7 py-3 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900"
              >
                View Services
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Pill>4.9 stars from 500+ clients</Pill>
              <Pill>Luxury products</Pill>
              <Pill>Tailored consultations</Pill>
            </div>

            <div className="mt-10 max-w-2xl rounded-[2rem] border border-white/60 bg-white/70 p-5 shadow-xl backdrop-blur">
              <div className="grid gap-4 md:grid-cols-4">
                <select className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none">
                  <option>Choose Service</option>
                  {servicesData.slice(0, 6).map((service) => (
                    <option key={service.id}>{service.name}</option>
                  ))}
                </select>

                <select className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none">
                  <option>Select Stylist</option>
                  <option>Charlotte Kim</option>
                  <option>Sophia Bennett</option>
                  <option>Mia Carter</option>
                  <option>Olivia Reed</option>
                </select>

                <input
                  type="date"
                  className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none"
                />

                <Link
                  to="/booking"
                  className="flex items-center justify-center rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
                >
                  Book
                </Link>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-4 -top-4 h-24 w-24 animate-spin rounded-full border border-rose-200 border-dashed opacity-70 [animation-duration:12s]" />
            <div className="absolute -left-5 bottom-8 h-16 w-16 animate-spin rounded-full border border-fuchsia-200 border-dashed opacity-60 [animation-duration:10s]" />

            <div className="relative overflow-hidden rounded-[2.25rem] shadow-2xl ring-1 ring-black/5">
              <img
                src="https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=1600&q=80"
                alt="Luxury salon hero"
                className="h-[620px] w-full object-cover transition duration-[1200ms] hover:scale-105"
              />
            </div>

            <div className="absolute bottom-6 left-6 rounded-[1.5rem] border border-white/50 bg-white/75 px-5 py-4 shadow-xl backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-rose-500">
                Client favorite
              </p>
              <p className="mt-2 text-lg font-bold text-zinc-900">
                Signature Balayage
              </p>
              <p className="text-sm text-zinc-600">
                Soft blend • Luxury gloss • Premium finish
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <div className="grid gap-4 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm md:grid-cols-4">
          <div className="rounded-2xl bg-zinc-50 p-5 text-center">
            <p className="text-3xl font-bold text-zinc-900">10+</p>
            <p className="mt-2 text-sm text-zinc-500">Years experience</p>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-5 text-center">
            <p className="text-3xl font-bold text-zinc-900">5k+</p>
            <p className="mt-2 text-sm text-zinc-500">Appointments completed</p>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-5 text-center">
            <p className="text-3xl font-bold text-zinc-900">4.9</p>
            <p className="mt-2 text-sm text-zinc-500">Average rating</p>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-5 text-center">
            <p className="text-3xl font-bold text-zinc-900">20+</p>
            <p className="mt-2 text-sm text-zinc-500">
              Specialized service options
            </p>
          </div>
        </div>
      </section>

      {/* PARALLAX */}
      <section
        className="relative min-h-[70vh] bg-cover bg-center bg-no-repeat md:bg-fixed"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative mx-auto flex min-h-[70vh] max-w-7xl items-center px-6 md:px-10 lg:px-12">
          <div className="max-w-2xl text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-200">
              Signature salon experience
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
              Elevated beauty with modern technique and luxury care
            </h2>
            <p className="mt-5 text-base leading-7 text-white/80 md:text-lg">
              From dimensional color to event styling and expert classes, every
              experience is designed to feel polished, personal, and premium.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/booking"
                className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-rose-100"
              >
                Book Now
              </Link>
              <Link
                to="/classes"
                className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore Classes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <SectionIntro
          eyebrow="Featured Services"
          title="Premium services with polished detail"
          text="A cleaner, more luxurious service experience with elevated finishes, expert stylists, and tailored recommendations."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredServices.map((service) => (
            <div
              key={service.id}
              className="group relative overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-rose-200 to-fuchsia-200 opacity-50 blur-2xl transition duration-500 group-hover:rotate-45" />

              <div className="overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-6">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                    {service.category}
                  </span>
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                    {service.duration}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-zinc-900">
                  {service.name}
                </h3>
                <p className="mt-2 text-sm font-medium text-zinc-600">
                  Stylist: {service.stylist}
                </p>

                <p className="mt-4 text-sm leading-6 text-zinc-600">
                  {service.description}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <p className="text-xl font-bold text-zinc-900">
                    {service.price}
                  </p>
                  <Link
                    to={`/booking?service=${service.id}`}
                    className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
                  >
                    Book
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRANSFORMATIONS */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <SectionIntro
          eyebrow="Transformations"
          title="Before & after inspired beauty results"
          text="Use this section now as a premium visual block. Later, you can replace it with a draggable comparison slider."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
            <div className="grid grid-cols-2">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1519415943484-9fa1873496d4?auto=format&fit=crop&w=1200&q=80"
                  alt="Before hairstyle"
                  className="h-[420px] w-full object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-zinc-800 backdrop-blur">
                  Before
                </span>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80"
                  alt="After hairstyle"
                  className="h-[420px] w-full object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-zinc-800 backdrop-blur">
                  After
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                  Color
                </span>
                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                  Balayage
                </span>
                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                  Gloss Finish
                </span>
              </div>
              <h3 className="text-2xl font-bold text-zinc-900">
                Soft dimensional blonde refresh
              </h3>
              <p className="mt-3 text-zinc-600">
                A premium blend designed for softness, dimension, and a refined
                finish.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
            <div className="grid grid-cols-2">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=1200&q=80"
                  alt="Before styling"
                  className="h-[420px] w-full object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-zinc-800 backdrop-blur">
                  Before
                </span>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80"
                  alt="After styling"
                  className="h-[420px] w-full object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-zinc-800 backdrop-blur">
                  After
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                  Styling
                </span>
                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                  Waves
                </span>
                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                  Soft Glam
                </span>
              </div>
              <h3 className="text-2xl font-bold text-zinc-900">
                Editorial wave transformation
              </h3>
              <p className="mt-3 text-zinc-600">
                Soft glam movement with a polished finish for events and luxury
                styling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SMALLER STYLIST FEATURE */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <div className="grid items-center gap-8 rounded-[2.25rem] border border-zinc-200 bg-gradient-to-r from-white via-rose-50 to-white p-8 shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
              Find Your Match
            </p>
            <h2 className="mt-3 text-3xl font-bold text-zinc-900 md:text-4xl">
              Choose the stylist that fits your goals
            </h2>
            <p className="mt-4 max-w-xl text-zinc-600">
              Whether you want precision cuts, dimensional color, or bridal
              styling, our artists are selected to match your beauty goals with
              the right expertise.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                to="/stylists"
                className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                Meet the Stylists
              </Link>
              <Link
                to="/booking"
                className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900"
              >
                Book a Consultation
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {stylists.map((stylist) => (
              <div
                key={stylist.id}
                className="overflow-hidden rounded-[1.75rem] border border-white/60 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <img
                  src={stylist.image}
                  alt={stylist.name}
                  className="h-56 w-full object-cover"
                />
                <div className="p-4">
                  <p className="text-sm font-semibold text-zinc-900">
                    {stylist.name}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">{stylist.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLASSES */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <SectionIntro
          eyebrow="Salon Education"
          title="Classes designed for beauty growth"
          text="Showcase your classes as a premium offer on the landing page, not just inside the classes page."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {classesPreview.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-72 w-full object-cover transition duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-6">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                    {item.level}
                  </span>
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                    {item.duration}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-zinc-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {item.text}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <Link
                    to="/classes"
                    className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900"
                  >
                    View Class
                  </Link>
                  <Link
                    to="/classes"
                    className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
                  >
                    Join
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <SectionIntro
          eyebrow="Client Love"
          title="What clients remember most"
          text="A premium salon brand should feel trusted, polished, and emotionally memorable."
        />

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] bg-zinc-900 p-8 text-white shadow-2xl">
            <p className="text-sm uppercase tracking-[0.25em] text-rose-300">
              Featured Review
            </p>
            <div className="mt-6 text-2xl leading-10 md:text-3xl">
              “{testimonials[0].text}”
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
              <div>
                <p className="font-semibold">{testimonials[0].name}</p>
                <p className="text-sm text-white/65">{testimonials[0].role}</p>
              </div>
              <div className="text-sm">★★★★★</div>
            </div>
          </div>

          <div className="grid gap-6">
            {testimonials.slice(1).map((item) => (
              <div
                key={item.id}
                className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-3 text-sm">★★★★★</div>
                <p className="text-sm leading-7 text-zinc-600">{item.text}</p>
                <p className="mt-4 text-sm font-semibold text-zinc-900">
                  {item.name}
                </p>
                <p className="text-xs text-zinc-500">{item.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <SectionIntro
          eyebrow="Lookbook"
          title="Trending hairstyle inspiration"
          text="An editorial-style gallery gives the homepage a more modern beauty-brand feel."
        />

        <div className="overflow-x-auto">
          <div className="flex min-w-max gap-4 pb-2">
            {gallery.map((item) => (
              <div
                key={item.id}
                className="group w-[280px] overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white shadow-sm"
              >
                <div className="overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-[360px] w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-zinc-900">
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREMIUM PACKAGES */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <SectionIntro
          eyebrow="Packages"
          title="Premium pricing options"
          text="Luxury pricing cards make the homepage feel more complete and premium."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
              Essential
            </p>
            <h3 className="mt-3 text-3xl font-bold text-zinc-900">$75+</h3>
            <p className="mt-3 text-zinc-600">
              Perfect for refined maintenance and polished salon refreshes.
            </p>
            <div className="mt-6 space-y-3 text-sm text-zinc-600">
              <p>✓ Signature haircut</p>
              <p>✓ Blowout finish</p>
              <p>✓ Tailored consultation</p>
            </div>
            <Link
              to="/booking"
              className="mt-8 inline-flex rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900"
            >
              Book Package
            </Link>
          </div>

          <div className="rounded-[2rem] border border-zinc-900 bg-zinc-900 p-8 text-white shadow-2xl">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
              Most Popular
            </span>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-rose-300">
              Signature
            </p>
            <h3 className="mt-3 text-3xl font-bold">$220+</h3>
            <p className="mt-3 text-white/75">
              Ideal for luxury color, dimensional finish, and premium glow.
            </p>
            <div className="mt-6 space-y-3 text-sm text-white/80">
              <p>✓ Signature balayage</p>
              <p>✓ Gloss & tone refinement</p>
              <p>✓ Premium finish styling</p>
            </div>
            <Link
              to="/booking"
              className="mt-8 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-rose-100"
            >
              Book Signature
            </Link>
          </div>

          <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
              Bridal
            </p>
            <h3 className="mt-3 text-3xl font-bold text-zinc-900">$140+</h3>
            <p className="mt-3 text-zinc-600">
              Elegant event styling with elevated details and long-wear finish.
            </p>
            <div className="mt-6 space-y-3 text-sm text-zinc-600">
              <p>✓ Bridal preview</p>
              <p>✓ Elegant event styling</p>
              <p>✓ Luxury hold and finish</p>
            </div>
            <Link
              to="/booking"
              className="mt-8 inline-flex rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900"
            >
              Book Bridal
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-8 md:px-10 lg:px-12">
        <div className="overflow-hidden rounded-[2.25rem] bg-zinc-900 px-8 py-12 text-white shadow-2xl">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-300">
                Luxury salon booking
              </p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                Ready for your next salon experience?
              </h2>
              <p className="mt-4 max-w-xl text-white/75">
                Book your appointment, explore our services, meet the stylists,
                or join one of our premium salon education classes.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 lg:justify-end">
              <Link
                to="/booking"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-rose-100"
              >
                Book Appointment
              </Link>
              <Link
                to="/classes"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore Classes
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
