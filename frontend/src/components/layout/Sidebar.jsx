import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const customerLinks = [
  { to: "/dashboard", label: "Overview", icon: "🏠" },
  { to: "/my-bookings", label: "My Bookings", icon: "📅" },
  { to: "/my-classes", label: "My Classes", icon: "🎓" },
  { to: "/profile", label: "Profile", icon: "👤" },
  { to: "/billing", label: "Billing", icon: "💳" },
];

const adminLinks = [
  { to: "/admin", label: "Admin Dashboard", icon: "📊" },
  { to: "/admin/bookings", label: "Manage Bookings", icon: "🗓️" },
  { to: "/admin/services", label: "Manage Services", icon: "✂️" },
  { to: "/admin/users", label: "Manage Users", icon: "👥" },
  { to: "/admin/calendar", label: "Admin Calendar", icon: "🗂️" },
  { to: "/admin/billing", label: "Admin Billing", icon: "💳" },
  { to: "/admin/revenue", label: "Admin Revenue", icon: "📈" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = user?.role === "admin" ? adminLinks : customerLinks;

  const displayName =
    user?.fullName ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    "Glow Member";

  const initial =
    user?.firstName?.[0]?.toUpperCase() ||
    user?.fullName?.[0]?.toUpperCase() ||
    "G";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sticky top-24 h-fit overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-gradient-to-br from-pink-600 to-rose-500 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-xl font-bold backdrop-blur">
            {initial}
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-pink-100">
              {user?.role === "admin" ? "Admin Panel" : "Client Area"}
            </p>
            <h2 className="mt-1 text-lg font-bold">{displayName}</h2>
            <p className="text-xs text-pink-100">{user?.email || ""}</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Navigation
        </p>

        <nav className="space-y-2">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-pink-50 text-pink-700 ring-1 ring-pink-100"
                    : "text-slate-700 hover:bg-slate-50"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 flex w-full items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
