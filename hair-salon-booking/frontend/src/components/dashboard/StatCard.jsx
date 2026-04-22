function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl border p-4 shadow-sm">
      <p className="text-slate-500">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  );
}

export default StatCard;
