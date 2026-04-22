import { useNavigate } from "react-router-dom";

const ClassesTable = ({ classes = [] }) => {
  const navigate = useNavigate();

  if (!classes.length) {
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">My Classes</h2>
        </div>

        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
          No classes enrolled yet.
        </div>
      </div>
    );
  }

  const getStatusStyles = (status) => {
    const normalized = String(status || "").toLowerCase();

    if (normalized === "upcoming" || normalized === "pending") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (normalized === "paid" || normalized === "enrolled") {
      return "bg-green-100 text-green-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold">My Classes</h2>
      </div>

      <div className="space-y-4">
        {classes.map((item) => (
          <div
            key={item.enrollmentId || item.id || item._id}
            className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h3 className="font-medium text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500">
                Instructor: {item.instructor}
              </p>
              <p className="text-sm text-gray-400">{item.date || "TBA"}</p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyles(
                  item.status,
                )}`}
              >
                {item.status || "Enrolled"}
              </span>

              <button
                onClick={() => {
                  if (!item.id) return;
                  navigate(`/classes/${item.id}`);
                }}
                disabled={!item.id}
                className={`rounded-lg border px-4 py-2 text-sm transition ${
                  item.id
                    ? "hover:bg-gray-100"
                    : "cursor-not-allowed opacity-50"
                }`}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassesTable;
