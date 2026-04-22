import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function EnrollmentChart({ data }) {
  return (
    <div className="bg-white border rounded-xl p-4 h-80">
      <h3 className="font-bold mb-4">Class Enrollments</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="enrollments" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EnrollmentChart;
