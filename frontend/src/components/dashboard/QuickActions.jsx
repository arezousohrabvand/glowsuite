import { Link } from "react-router-dom";

function QuickActions() {
  const actions = [
    { title: "Book Appointment", path: "/booking" },
    { title: "My Bookings", path: "/my-bookings" },
    { title: "My Classes", path: "/my-classes" },
    { title: "Profile", path: "/profile" },
    { title: "Settings", path: "/settings" },
    { title: "Browse Services", path: "/services" },
  ];

  return (
    <div className="bg-white rounded-xl border p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold">Quick Actions</h2>

      <div className="grid gap-3">
        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.path}
            className="rounded-lg border px-4 py-3 text-sm font-medium hover:bg-black hover:text-white transition"
          >
            {action.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
