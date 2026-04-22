export default function StylistCard({ stylist }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h3 className="font-semibold">{stylist.name}</h3>
      <p className="text-gray-500">{stylist.specialty}</p>
    </div>
  );
}
