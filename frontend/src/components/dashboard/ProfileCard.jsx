import { Link } from "react-router-dom";

function ProfileCard({ user }) {
  return (
    <div className="bg-white rounded-xl border p-6 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="h-20 w-20 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold">
          {user.firstName?.[0]}
          {user.lastName?.[0]}
        </div>

        <h2 className="mt-4 text-xl font-bold">
          {user.firstName} {user.lastName}
        </h2>

        <p className="text-slate-500 text-sm mt-1">{user.email}</p>
        <p className="text-slate-500 text-sm">{user.role}</p>

        <Link
          to="/profile"
          className="mt-5 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-100"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}

export default ProfileCard;
