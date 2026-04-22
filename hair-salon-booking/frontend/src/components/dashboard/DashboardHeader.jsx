import { Link, useNavigate } from "react-router-dom";

function DashboardHeader({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="bg-white rounded-xl border p-5 shadow-sm flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm text-slate-500">Welcome back</p>
        <h1 className="text-2xl font-bold">
          {user.firstName} {user.lastName}
        </h1>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/booking"
          className="rounded-lg bg-black px-4 py-2 text-white font-medium hover:opacity-90"
        >
          Book Now
        </Link>

        <button
          onClick={handleLogout}
          className="rounded-lg border px-4 py-2 font-medium hover:bg-slate-100"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default DashboardHeader;
