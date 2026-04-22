import { Link, useSearchParams } from "react-router-dom";
import { servicesData } from "../data/servicesData";

const categories = [
  "All",
  "Cuts",
  "Color",
  "Styling",
  "Bridal",
  "Texture",
  "Treatment",
  "Wellness",
];

function ServiceBadge({ children }) {
  return (
    <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
      {children}
    </span>
  );
}

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "All";

  const filteredServices =
    selectedCategory === "All"
      ? servicesData
      : servicesData.filter(
          (service) =>
            String(service.category).toLowerCase() ===
            String(selectedCategory).toLowerCase(),
        );

  const featuredServices = filteredServices.slice(0, 3);
  const lookbookItems = filteredServices.slice(0, 8);

  const handleCategoryClick = (cat) => {
    if (cat === "All") {
      setSearchParams({});
      return;
    }
    setSearchParams({ category: cat });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white text-zinc-900">
      <section className="relative overflow-hidden border-b border-rose-100">
        <div className="absolute -left-16 top-12 h-56 w-56 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-fuchsia-200/30 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:px-10 lg:grid-cols-2 lg:px-12">
          <div>
            <p className="mb-3 inline-block rounded-full bg-rose-100 px-4 py-1 text-sm font-medium text-rose-700">
              Luxury Salon Services
            </p>

            <h1 className="max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
              Premium hair services designed around your style, texture, and
              goals
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600 md:text-lg">
              Explore custom cuts, dimensional color, smoothing treatments,
              bridal styling, wellness services, and polished finishes created
              by our expert stylists.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/booking"
                className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-rose-600 hover:shadow-lg"
              >
                Book Appointment
              </Link>

              <a
                href="#all-services"
                className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900"
              >
                View Services
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-white px-4 py-2 text-sm text-zinc-700 shadow-sm ring-1 ring-zinc-100">
                Expert stylists
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm text-zinc-700 shadow-sm ring-1 ring-zinc-100">
                Luxury products
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm text-zinc-700 shadow-sm ring-1 ring-zinc-100">
                Tailored consultations
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-4 -top-4 h-24 w-24 animate-spin rounded-full border border-rose-200 border-dashed opacity-70 [animation-duration:12s]" />
            <div className="absolute -left-5 bottom-8 h-16 w-16 animate-spin rounded-full border border-fuchsia-200 border-dashed opacity-60 [animation-duration:10s]" />

            <div className="overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-black/5">
              <img
                src="https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=1400&q=80"
                alt="Luxury salon hairstyle"
                className="h-[440px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 md:px-10 lg:px-12">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
            Signature Looks
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            {selectedCategory === "All"
              ? "Most-loved salon experiences"
              : `${selectedCategory} services`}
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {featuredServices.map((service) => (
            <div
              key={service.id}
              className="group relative overflow-hidden rounded-[2rem] bg-zinc-900 text-white shadow-xl transition duration-300 hover:-translate-y-2"
            >
              <div className="absolute inset-0">
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-full w-full object-cover opacity-55 transition duration-500 group-hover:scale-110"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              <div className="relative flex min-h-[360px] flex-col justify-end p-6">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
                    {service.category}
                  </span>
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
                    {service.duration}
                  </span>
                </div>

                <h3 className="text-2xl font-bold">{service.name}</h3>
                <p className="mt-2 text-sm text-white/80">
                  Stylist: {service.stylist}
                </p>
                <p className="mt-3 text-sm leading-6 text-white/80">
                  {service.description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <p className="text-xl font-semibold">{service.price}</p>

                  <Link
                    to={`/services/${service.id}`}
                    className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-rose-100"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {featuredServices.length === 0 && (
          <p className="mt-8 text-center text-zinc-500">
            No services found for this category.
          </p>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 md:px-10 lg:px-12">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
            Hair Inspiration
          </p>
          <h2 className="mt-2 text-3xl font-bold">Sample hairstyle lookbook</h2>
          <p className="mt-3 max-w-2xl text-zinc-600">
            Browse inspiration across soft waves, luxury blowouts, dimensional
            blondes, bridal texture, sleek smoothing finishes, and modern cuts.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {lookbookItems.map((item) => (
            <div
              key={`lookbook-${item.id}`}
              className="group overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-zinc-100"
            >
              <div className="overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-72 w-full object-cover transition duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-zinc-900">
                  {item.name}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="all-services"
        className="mx-auto max-w-7xl px-6 pb-20 pt-12 md:px-10 lg:px-12"
      >
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
              Full Service Menu
            </p>
            <h2 className="mt-2 text-3xl font-bold">More salon services</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  selectedCategory === cat
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group relative overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-rose-200 to-fuchsia-200 opacity-50 blur-2xl transition duration-500 group-hover:rotate-45" />

              <div className="overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-60 w-full object-cover transition duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-6">
                <div className="mb-3 flex flex-wrap gap-2">
                  <ServiceBadge>{service.category}</ServiceBadge>
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

                <div className="mt-4 flex flex-wrap gap-2">
                  {(service.features || []).map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 ring-1 ring-zinc-100"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-zinc-400">
                      Starting at
                    </p>
                    <p className="text-2xl font-bold text-zinc-900">
                      {service.price}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      to={`/services/${service.id}`}
                      className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900"
                    >
                      Details
                    </Link>
                    <Link
                      to={`/booking?service=${service.id}`}
                      className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
                    >
                      Book
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <p className="mt-10 text-center text-zinc-500">
            No services found in this category.
          </p>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-10 lg:px-12">
        <div className="overflow-hidden rounded-[2.25rem] bg-zinc-900 px-8 py-12 text-white shadow-2xl">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-300">
                Tailored salon experience
              </p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                Not sure which service fits you best?
              </h2>
              <p className="mt-4 max-w-xl text-white/75">
                Book a consultation and we’ll match you with the right stylist,
                service plan, and look based on your hair goals.
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
                to="/stylists"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Meet Our Stylists
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
