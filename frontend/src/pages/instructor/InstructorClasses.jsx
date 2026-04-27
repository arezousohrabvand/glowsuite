import { useEffect, useState } from "react";
import { getInstructorClasses } from "../../api/instructorApi";

export default function InstructorClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await getInstructorClasses();
        setClasses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Instructor classes error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadClasses();
  }, []);

  if (loading) {
    return <div className="p-8 text-zinc-500">Loading classes...</div>;
  }

  return (
    <div className="min-h-screen bg-stone-50 p-6 md:p-10">
      <div className="mb-8">
        <p className="text-sm font-medium text-rose-500">Classes</p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          My Classes
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          View your assigned classes and enrolled students.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {classes.length > 0 ? (
          classes.map((item) => (
            <div
              key={item._id}
              className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600">
                {item.category || "Class"}
              </span>

              <h2 className="mt-4 text-lg font-semibold text-zinc-900">
                {item.title}
              </h2>

              <p className="mt-2 text-sm text-zinc-500">{item.description}</p>

              <div className="mt-5 space-y-2 text-sm text-zinc-600">
                <p>
                  <b>Date:</b> {item.date}
                </p>
                <p>
                  <b>Time:</b> {item.time}
                </p>
                <p>
                  <b>Capacity:</b> {item.enrolledCount || 0}/
                  {item.capacity || 0}
                </p>
                <p>
                  <b>Price:</b> ${item.price || 0}
                </p>
              </div>

              <div className="mt-6 rounded-2xl bg-stone-50 p-4">
                <p className="text-sm font-medium text-zinc-900">
                  Enrolled Students
                </p>

                <div className="mt-3 space-y-2">
                  {item.students?.length > 0 ? (
                    item.students.map((student) => (
                      <div
                        key={student._id}
                        className="rounded-xl bg-white px-3 py-2 text-sm text-zinc-700"
                      >
                        {student.firstName} {student.lastName}
                        <span className="ml-2 text-xs text-zinc-400">
                          {student.email}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-zinc-500">
                      No students enrolled yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-zinc-500">No classes assigned yet.</p>
        )}
      </div>
    </div>
  );
}
