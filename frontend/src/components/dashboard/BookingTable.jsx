function BookingTable({ bookings = [] }) {
  return (
    <div className="overflow-x-auto bg-white border rounded-xl">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="text-left p-3">Service</th>
            <th className="text-left p-3">Date</th>
            <th className="text-left p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id} className="border-t">
              <td className="p-3">{booking.serviceName}</td>
              <td className="p-3">{booking.date}</td>
              <td className="p-3">{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookingTable;
