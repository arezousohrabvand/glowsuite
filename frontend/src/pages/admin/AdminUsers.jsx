import { useEffect, useMemo, useState } from "react";
import { getAdminUsers, updateAdminUserRole } from "../../api/adminApi";

const roles = ["customer", "stylist", "instructor", "admin"];

function roleStyle(role) {
  const styles = {
    admin: "bg-zinc-900 text-white ring-zinc-900",
    stylist: "bg-rose-50 text-rose-700 ring-rose-100",
    instructor: "bg-amber-50 text-amber-700 ring-amber-100",
    customer: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  };

  return styles[role] || "bg-zinc-50 text-zinc-700 ring-zinc-100";
}

function getInitials(user) {
  return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState("");

  async function loadUsers() {
    try {
      setLoading(true);
      const data = await getAdminUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleRoleChange(userId, role) {
    try {
      setUpdatingId(userId);
      await updateAdminUserRole(userId, role);
      await loadUsers();
    } catch (error) {
      console.error("Failed to update role:", error);
      alert(error.response?.data?.message || "Failed to update role");
    } finally {
      setUpdatingId("");
    }
  }

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();

    return users.filter((user) => {
      const fullName =
        `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
      const email = String(user.email || "").toLowerCase();

      const matchesSearch = !q || fullName.includes(q) || email.includes(q);

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      customers: users.filter((u) => u.role === "customer").length,
      stylists: users.filter((u) => u.role === "stylist").length,
      admins: users.filter((u) => u.role === "admin").length,
    };
  }, [users]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 p-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          Loading users...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl bg-zinc-950 p-8 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-300">
            Admin Access
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Manage Users
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
            Review customers, stylists, instructors, and admins. Update access
            roles safely from one premium dashboard.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                Total Users
              </p>
              <p className="mt-2 text-3xl font-bold">{stats.total}</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                Customers
              </p>
              <p className="mt-2 text-3xl font-bold">{stats.customers}</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                Stylists
              </p>
              <p className="mt-2 text-3xl font-bold">{stats.stylists}</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                Admins
              </p>
              <p className="mt-2 text-3xl font-bold">{stats.admins}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-zinc-900 focus:bg-white"
            />

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-zinc-900 focus:bg-white"
            >
              <option value="all">All roles</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-200">
          <div className="border-b border-zinc-200 px-6 py-5">
            <h2 className="text-xl font-bold text-zinc-900">User Directory</h2>
            <p className="mt-1 text-sm text-zinc-500">
              {filteredUsers.length} users found
            </p>
          </div>

          <div className="divide-y divide-zinc-100">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="grid gap-4 px-6 py-5 transition hover:bg-zinc-50 md:grid-cols-[1.5fr_1.5fr_1fr_220px]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-sm font-bold text-white shadow-sm">
                    {getInitials(user) || "U"}
                  </div>

                  <div>
                    <p className="font-semibold text-zinc-900">
                      {user.firstName || "—"} {user.lastName || ""}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      ID: {String(user._id).slice(-8)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-sm text-zinc-600">
                  {user.email || "No email"}
                </div>

                <div className="flex items-center">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${roleStyle(
                      user.role,
                    )}`}
                  >
                    {user.role}
                  </span>
                </div>

                <div className="flex items-center">
                  <select
                    value={user.role}
                    disabled={updatingId === user._id}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="px-6 py-16 text-center">
                <p className="text-lg font-semibold text-zinc-900">
                  No users found
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  Try changing your search or role filter.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
