import { Link } from "react-router-dom";
import Button from "../ui/Button";

export default function ClassCard({ item }) {
  if (!item) return null;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold">{item.title}</h3>
      <p className="mt-2 text-slate-500">{item.description}</p>
      <p className="mt-2 text-sm">Instructor: {item.instructor}</p>

      <Link to={`/classes/${item._id}`} className="mt-4 inline-block">
        <Button>View Class</Button>
      </Link>
    </div>
  );
}
