export default function BookingSummary({ booking }) {
  if (!booking) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <h3 className="font-semibold mb-3">Booking Summary</h3>
      <p>Service: {booking.service}</p>
      <p>Date: {booking.date}</p>
      <p>Time: {booking.time}</p>
      <p>Stylist: {booking.stylist}</p>
    </div>
  );
}
