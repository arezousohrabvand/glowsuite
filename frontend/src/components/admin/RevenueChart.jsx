import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function formatMonthLabel(month, year) {
  const monthNames = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${monthNames[month]} ${year}`;
}

export default function RevenueChart({ data = [] }) {
  const formattedData = data.map((item) => ({
    month: formatMonthLabel(item._id.month, item._id.year),
    revenue: item.revenue || 0,
    count: item.count || 0,
  }));

  return (
    <div
      style={{
        width: "100%",
        background: "#fff",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Monthly Revenue</h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
