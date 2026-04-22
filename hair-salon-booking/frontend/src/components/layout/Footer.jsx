import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[#d8d3c9] bg-[#f7f6f4]">
      {/* TOP SECTION */}
      <div className="mx-auto grid max-w-[1400px] gap-10 px-10 py-14 lg:grid-cols-3 lg:px-14">
        {/* LOGO + DESCRIPTION */}
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d8d3c9] text-[#574d40] font-bold shadow-sm">
              G
            </div>

            <div>
              <p className="text-lg font-bold tracking-wide text-[#574d40]">
                Glow Salon
              </p>
              <p className="text-xs text-[#8e7d67]">Modern hair experience</p>
            </div>
          </div>

          <p className="mt-5 max-w-sm text-sm leading-6 text-[#6f6250]">
            A modern salon platform designed for premium booking, beauty
            classes, and personalized styling experiences.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#574d40]">
            Explore
          </h4>

          <div className="mt-5 space-y-3 text-sm text-[#6f6250]">
            <div>
              <Link to="/services" className="hover:text-[#574d40] transition">
                Services
              </Link>
            </div>
            <div>
              <Link to="/classes" className="hover:text-[#574d40] transition">
                Classes
              </Link>
            </div>
            <div>
              <Link to="/stylists" className="hover:text-[#574d40] transition">
                Stylists
              </Link>
            </div>
            <div>
              <Link to="/booking" className="hover:text-[#574d40] transition">
                Booking
              </Link>
            </div>
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#574d40]">
            Contact
          </h4>

          <div className="mt-5 space-y-3 text-sm text-[#6f6250]">
            <p>Austin, Texas</p>
            <p>hello@glowsalon.com</p>
            <p>(555) 123-4567</p>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-[#d8d3c9]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-10 py-5 text-sm text-[#8e7d67] lg:px-14">
          <p>© 2026 Glow Salon. All rights reserved.</p>

          <div className="flex gap-6">
            <Link to="/login" className="hover:text-[#574d40] transition">
              Login
            </Link>
            <Link to="/signup" className="hover:text-[#574d40] transition">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
