import { useEffect, useState } from "react";
import { getAdminCustomers, getAdminCustomerDetails } from "../../api/adminApi";

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));
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

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Admin Customers</h1>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 rounded-lg border border-zinc-300 px-4 py-2"
          />
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-white"
          >
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {loading ? (
            <p>Loading customers...</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <table className="min-w-full text-left">
                <thead className="bg-zinc-50">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Bookings</th>
                    <th className="px-4 py-3">Total Spend</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer._id} className="border-t">
                      <td className="px-4 py-3">
                        {customer.firstName} {customer.lastName}
                      </td>
                      <td className="px-4 py-3">{customer.email}</td>
                      <td className="px-4 py-3">{customer.phone || "-"}</td>
                      <td className="px-4 py-3">
                        {customer.totalBookings || 0}
                      </td>
                      <td className="px-4 py-3">
                        {formatMoney(customer.totalSpend)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleOpenCustomer(customer._id)}
                          className="rounded bg-zinc-900 px-3 py-1 text-white"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}

                  {customers.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-6 text-center text-zinc-500"
                      >
                        No customers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Customer Details</h2>

          {detailLoading ? (
            <p>Loading customer details...</p>
          ) : !selectedCustomer ? (
            <p className="text-zinc-500">Select a customer to view details.</p>
          ) : (
            <div className="space-y-5">
              <div>
                <p className="text-sm text-zinc-500">Name</p>
                <p className="font-semibold">
                  {selectedCustomer.customer.firstName}{" "}
                  {selectedCustomer.customer.lastName}
                </p>
              </div>

              <div>
                <p className="text-sm text-zinc-500">Email</p>
                <p>{selectedCustomer.customer.email}</p>
              </div>

              <div>
                <p className="text-sm text-zinc-500">Phone</p>
                <p>{selectedCustomer.customer.phone || "-"}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border p-3">
                  <p className="text-xs text-zinc-500">Bookings</p>
                  <p className="text-xl font-bold">
                    {selectedCustomer.totalBookings || 0}
                  </p>
                </div>

                <div className="rounded-xl border p-3">
                  <p className="text-xs text-zinc-500">Total Spend</p>
                  <p className="text-xl font-bold">
                    {formatMoney(selectedCustomer.totalSpend)}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">Booking History</h3>

                <div className="max-h-[360px] space-y-3 overflow-y-auto">
                  {selectedCustomer.bookings?.map((booking) => (
                    <div
                      key={booking._id}
                      className="rounded-xl border border-zinc-200 p-3"
                    >
                      <p className="font-medium">
                        {booking.service?.name ||
                          booking.serviceName ||
                          "Service"}
                      </p>
                      <p className="text-sm text-zinc-600">
                        {booking.date || "-"} {booking.time || ""}
                      </p>
                      <p className="text-sm text-zinc-600">
                        Status: {booking.status}
                      </p>
                      <p className="text-sm text-zinc-600">
                        Price: {formatMoney(booking.price)}
                      </p>
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
        </div>
      </div>
    </div>
  );
}
