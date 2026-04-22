import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const servicesDropdown = [
  { name: "All Services", path: "/services" },
  { name: "Cuts", path: "/services?category=Cuts" },
  { name: "Color", path: "/services?category=Color" },
  { name: "Styling", path: "/services?category=Styling" },
  { name: "Bridal", path: "/services?category=Bridal" },
  { name: "Treatment", path: "/services?category=Treatment" },
  { name: "Texture", path: "/services?category=Texture" },
  { name: "Wellness", path: "/services?category=Wellness" },
];

const stylistsDropdown = [
  { name: "All Stylists", path: "/stylists" },
  { name: "Charlotte Kim", path: "/stylists/1" },
  { name: "Sophia Bennett", path: "/stylists/2" },
  { name: "Mia Carter", path: "/stylists/3" },
  { name: "Olivia Reed", path: "/stylists/4" },
  { name: "Ava Martinez", path: "/stylists/5" },
  { name: "Isabella Moore", path: "/stylists/6" },
  { name: "Emma Hayes", path: "/stylists/7" },
];

const classesDropdown = [
  { name: "All Classes", path: "/classes" },
  { name: "Color Classes", path: "/classes?type=Color" },
  { name: "Styling Classes", path: "/classes?type=Styling" },
  { name: "Bridal Classes", path: "/classes?type=Bridal" },
  { name: "Business Classes", path: "/classes?type=Business" },
];

function DesktopDropdown({ label, items }) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="flex items-center gap-1 py-2 text-sm font-medium text-zinc-800 transition hover:text-rose-600"
      >
        {label}
        <span className="text-xs transition duration-200 group-hover:rotate-180">
          ▼
        </span>
      </button>

      <div className="invisible absolute left-0 top-full z-50 w-64 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
        <div className="rounded-2xl border border-zinc-200 bg-white p-2 shadow-2xl">
          {items.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="block rounded-xl px-4 py-3 text-sm text-zinc-700 transition hover:bg-rose-50 hover:text-rose-600"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileDropdown({ label, items, openKey, setOpenKey, closeMobile }) {
  const isOpen = openKey === label;

  return (
    <div className="border-b border-zinc-100 py-2">
      <button
        type="button"
        onClick={() => setOpenKey(isOpen ? null : label)}
        className="flex w-full items-center justify-between py-2 text-left text-sm font-medium text-zinc-800"
      >
        {label}
        <span className={`text-xs transition ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="mt-2 space-y-1 pl-3">
          {items.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="block rounded-lg px-3 py-2 text-sm text-zinc-600 transition hover:bg-rose-50 hover:text-rose-600"
              onClick={() => {
                setOpenKey(null);
                closeMobile();
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openKey, setOpenKey] = useState(null);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive ? "text-rose-600" : "text-zinc-800 hover:text-rose-600"
    }`;

  const closeMobile = () => {
    setMobileOpen(false);
    setOpenKey(null);
  };

  const handleLogout = () => {
    logout();
    closeMobile();
    navigate("/login");
  };

  const displayName =
    user?.firstName ||
    user?.fullName ||
    user?.name ||
    user?.email ||
    "Logged in";

  const isAdmin = user?.role === "admin";

  return (
    <header className="fixed inset-x-0 top-0 z-[200] w-full border-b border-rose-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10 lg:px-12">
        <Link to="/" className="text-xl font-bold tracking-tight text-zinc-900">
          GlowSuite
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <DesktopDropdown label="Services" items={servicesDropdown} />
          <DesktopDropdown label="Stylists" items={stylistsDropdown} />
          <DesktopDropdown label="Classes" items={classesDropdown} />

          <NavLink to="/booking" className={navLinkClass}>
            Booking
          </NavLink>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to={isAdmin ? "/admin" : "/dashboard"}
                className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900 hover:bg-zinc-50"
              >
                {isAdmin ? "Admin Dashboard" : "Dashboard"}
              </Link>

              <div className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
                {displayName}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>

              <NavLink
                to="/signup"
                className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                Sign Up
              </NavLink>
            </>
          )}
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-full p-2 text-zinc-900 lg:hidden"
        >
          <span className="text-xl">{mobileOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-zinc-100 bg-white px-6 py-4 lg:hidden">
          <div className="space-y-2">
            <Link
              to="/"
              className="block py-2 text-sm font-medium text-zinc-800"
              onClick={closeMobile}
            >
              Home
            </Link>

            <MobileDropdown
              label="Services"
              items={servicesDropdown}
              openKey={openKey}
              setOpenKey={setOpenKey}
              closeMobile={closeMobile}
            />

            <MobileDropdown
              label="Stylists"
              items={stylistsDropdown}
              openKey={openKey}
              setOpenKey={setOpenKey}
              closeMobile={closeMobile}
            />

            <MobileDropdown
              label="Classes"
              items={classesDropdown}
              openKey={openKey}
              setOpenKey={setOpenKey}
              closeMobile={closeMobile}
            />

            <Link
              to="/booking"
              className="block py-2 text-sm font-medium text-zinc-800"
              onClick={closeMobile}
            >
              Booking
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={isAdmin ? "/admin" : "/dashboard"}
                  className="block py-2 text-sm font-medium text-zinc-800"
                  onClick={closeMobile}
                >
                  {isAdmin ? "Admin Dashboard" : "Dashboard"}
                </Link>

                <Link
                  to="/my-classes"
                  className="block py-2 text-sm font-medium text-zinc-800"
                  onClick={closeMobile}
                >
                  My Classes
                </Link>

                <Link
                  to="/billing"
                  className="block py-2 text-sm font-medium text-zinc-800"
                  onClick={closeMobile}
                >
                  Billing
                </Link>

                <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                  {displayName}
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-3 inline-block rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 text-sm font-medium text-zinc-800"
                  onClick={closeMobile}
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="mt-3 inline-block rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white"
                  onClick={closeMobile}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
