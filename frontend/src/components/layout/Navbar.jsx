import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive ? "text-rose-600" : "text-zinc-800 hover:text-rose-600"
    }`;

  const closeMobile = () => setMobileOpen(false);

  const handleLogout = () => {
    logout();
    closeMobile();
    navigate("/login");
  };

  const displayName =
    user?.firstName || user?.fullName || user?.name || user?.email || "User";

  return (
    <header className="fixed inset-x-0 top-0 z-[200] w-full border-b border-rose-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-zinc-900">
          GlowSuite
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/services" className={navLinkClass}>
            Services
          </NavLink>
          <NavLink to="/stylists" className={navLinkClass}>
            Stylists
          </NavLink>
          <NavLink to="/classes" className={navLinkClass}>
            Classes
          </NavLink>
          <NavLink to="/booking" className={navLinkClass}>
            Booking
          </NavLink>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* ✅ Single Dashboard */}
              <Link
                to="/dashboard"
                className="rounded-full border px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-100"
              >
                Dashboard
              </Link>

              <div className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
                {displayName}
              </div>

              <button
                onClick={handleLogout}
                className="rounded-full bg-zinc-900 px-5 py-2 text-sm text-white hover:bg-rose-600"
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
                className="rounded-full bg-zinc-900 px-5 py-2 text-sm text-white hover:bg-rose-600"
              >
                Sign Up
              </NavLink>
            </>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white px-6 py-4 space-y-3 border-t">
          <Link to="/" onClick={closeMobile}>
            Home
          </Link>
          <Link to="/services" onClick={closeMobile}>
            Services
          </Link>
          <Link to="/stylists" onClick={closeMobile}>
            Stylists
          </Link>
          <Link to="/classes" onClick={closeMobile}>
            Classes
          </Link>
          <Link to="/booking" onClick={closeMobile}>
            Booking
          </Link>

          {isAuthenticated ? (
            <>
              {/* ✅ Single Dashboard */}
              <Link to="/dashboard" onClick={closeMobile}>
                Dashboard
              </Link>

              <div className="text-rose-600 font-semibold">{displayName}</div>

              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMobile}>
                Login
              </Link>
              <Link to="/signup" onClick={closeMobile}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
