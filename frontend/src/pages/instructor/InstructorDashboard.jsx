import { useEffect, useState } from "react";
import { getInstructorDashboard } from "../../api/instructorApi";

export default function InstructorDashboard() {
  const [data, setData] = useState({
    totalClasses: 0,
    upcomingClasses: 0,
    totalStudents: 0,
    revenue: 0,
    recentClasses: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const result = await getInstructorDashboard();
        setData(result);
      } catch (err) {
        console.error("Instructor dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-zinc-500">Loading instructor dashboard...</div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 p-6 md:p-10">
      <div className="mb-8">
        <p className="text-sm font-medium text-rose-500">
          Instructor Workspace
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Instructor Dashboard
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Manage your classes, students, enrollments, and class revenue.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard
          title="Classes"
          value={data.totalClasses}
          subtitle="Total assigned classes"
        />
        <StatCard
          title="Upcoming"
          value={data.upcomingClasses}
          subtitle="Future classes"
        />
        <StatCard
          title="Students"
          value={data.totalStudents}
          subtitle="Total enrolled students"
        />
        <StatCard
          title="Revenue"
          value={`$${data.revenue || 0}`}
          subtitle="Paid enrollments"
        />
      </div>

      <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Recent Classes</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Latest classes assigned to you.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {data.recentClasses?.length > 0 ? (
            data.recentClasses.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl border border-zinc-200 bg-stone-50 p-5"
              >
                <h3 className="font-semibold text-zinc-900">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-500">{item.description}</p>

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-white px-3 py-1 text-zinc-600">
                    {item.date}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-zinc-600">
                    {item.time}
                  </span>
                  <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-600">
                    {item.enrolledCount || 0} students
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-500">No classes assigned yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-zinc-500">{title}</p>
      <h3 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
        {value}
      </h3>
      <p className="mt-2 text-sm text-zinc-500">{subtitle}</p>
    </div>
  );
}
