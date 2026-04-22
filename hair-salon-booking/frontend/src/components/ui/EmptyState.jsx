export default function EmptyState({ title = "No data found" }) {
  return (
    <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
      <p className="text-gray-500">{title}</p>
    </div>
  );
}
