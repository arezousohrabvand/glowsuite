import { useEffect, useMemo, useState } from "react";
import { getAdminCustomers, getAdminCustomerDetails } from "../../api/adminApi";

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));
}

function getInitials(customer) {
  return `${customer?.firstName?.[0] || ""}${customer?.lastName?.[0] || ""}`.toUpperCase();
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  async function loadCustomers() {
    try {
      setLoading(true);
      const data = await getAdminCustomers(search);
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load customers:", error);
      alert(error.response?.data?.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    await loadCustomers();
  }

  async function handleOpenCustomer(customerId) {
    try {
      setDetailLoading(true);
      const data = await getAdminCustomerDetails(customerId);
      setSelectedCustomer(data);
    } catch (error) {
      console.error("Failed to load customer details:", error);
      alert(error.response?.data?.message || "Failed to load customer details");
    } finally {
      setDetailLoading(false);
    }
  }

  const stats = useMemo(() => {
    const totalSpend = customers.reduce(
      (sum, c) => sum + Number(c.totalSpend || 0),
      0,
    );

    const totalBookings = customers.reduce(
      (sum, c) => sum + Number(c.totalBookings || 0),
      0,
    );

    return {
      customers: customers.length,
      totalBookings,
      totalSpend,
      avgSpend: customers.length ? totalSpend / customers.length : 0,
    };
  }, [customers]);

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl bg-zinc-950 p-8 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-300">
            Customer Insights
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Customer Management
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
            View customer activity, bookings, and lifetime value from a clean
            CRM-style dashboard.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                Customers
              </p>
              <p className="mt-2 text-3xl font-bold">{stats.customers}</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                Bookings
              </p>
              <p className="mt-2 text-3xl font-bold">{stats.totalBookings}</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                Total Spend
              </p>
              <p className="mt-2 text-3xl font-bold">
                {formatMoney(stats.totalSpend)}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                Avg Spend
              </p>
              <p className="mt-2 text-3xl font-bold">
                {formatMoney(stats.avgSpend)}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
          <form
            onSubmit={handleSearch}
            className="grid gap-3 md:grid-cols-[1fr_140px]"
          >
            <input
              type="text"
              placeholder="Search customer by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-zinc-900 focus:bg-white"
            />

            <button
              type="submit"
              className="rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
            >
              Search
            </button>
          </form>
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
          <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-200">
            <div className="border-b border-zinc-200 px-6 py-5">
              <h2 className="text-xl font-bold text-zinc-900">
                Customer Directory
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                {customers.length} customers found
              </p>
            </div>

            {loading ? (
              <div className="p-8 text-zinc-500">Loading customers...</div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {customers.map((customer) => (
                  <div
                    key={customer._id}
                    className="grid gap-4 px-6 py-5 transition hover:bg-zinc-50 lg:grid-cols-[1.2fr_1.4fr_0.8fr_0.9fr_120px]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-sm font-bold text-white">
                        {getInitials(customer) || "C"}
                      </div>

                      <div>
                        <p className="font-semibold text-zinc-900">
                          {customer.firstName || "—"} {customer.lastName || ""}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          ID: {String(customer._id).slice(-8)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-zinc-600">
                      {customer.email || "No email"}
                    </div>

                    <div className="flex items-center text-sm text-zinc-600">
                      {customer.totalBookings || 0} bookings
                    </div>

                    <div className="flex items-center font-semibold text-zinc-900">
                      {formatMoney(customer.totalSpend)}
                    </div>

                    <div className="flex items-center">
                      <button
                        onClick={() => handleOpenCustomer(customer._id)}
                        className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}

                {customers.length === 0 && (
                  <div className="px-6 py-16 text-center">
                    <p className="text-lg font-semibold text-zinc-900">
                      No customers found
                    </p>
                    <p className="mt-2 text-sm text-zinc-500">
                      Try searching another name or email.
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
            <h2 className="text-xl font-bold text-zinc-900">
              Customer Details
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Select a customer to review profile and booking history.
            </p>

            {detailLoading ? (
              <p className="mt-6 text-sm text-zinc-500">
                Loading customer details...
              </p>
            ) : !selectedCustomer ? (
              <div className="mt-6 rounded-2xl bg-zinc-50 p-5 text-sm text-zinc-500">
                No customer selected.
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-base font-bold text-white">
                    {getInitials(selectedCustomer.customer) || "C"}
                  </div>

                  <div>
                    <p className="font-bold text-zinc-900">
                      {selectedCustomer.customer.firstName}{" "}
                      {selectedCustomer.customer.lastName}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {selectedCustomer.customer.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-zinc-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                      Bookings
                    </p>
                    <p className="mt-2 text-2xl font-bold text-zinc-900">
                      {selectedCustomer.totalBookings || 0}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-zinc-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                      Spend
                    </p>
                    <p className="mt-2 text-2xl font-bold text-zinc-900">
                      {formatMoney(selectedCustomer.totalSpend)}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-bold text-zinc-900">
                    Booking History
                  </h3>

                  <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                    {selectedCustomer.bookings?.map((booking) => (
                      <div
                        key={booking._id}
                        className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4"
                      >
                        <p className="font-semibold text-zinc-900">
                          {booking.service?.name ||
                            booking.serviceName ||
                            "Service"}
                        </p>

                        <p className="mt-1 text-sm text-zinc-600">
                          {booking.date || "-"} {booking.time || ""}
                        </p>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-zinc-700 ring-1 ring-zinc-200">
                            {booking.status}
                          </span>

                          <span className="text-sm font-bold text-zinc-900">
                            {formatMoney(booking.price)}
                          </span>
                        </div>
                      </div>
                    ))}

                    {!selectedCustomer.bookings?.length && (
                      <p className="text-sm text-zinc-500">
                        No bookings for this customer.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
