import { useNavigate } from "react-router-dom";

const ClassesTable = ({ classes = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl bg-white border p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold">My Classes</h2>

      <div className="space-y-4">
        {classes.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border p-4 rounded-lg"
          >
            <div>
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-gray-500">
                {item.instructor} • {item.date}
              </p>
            </div>

            <button
              onClick={() => navigate(`/classes/${item.id}`)}
              className="border px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassesTable;
