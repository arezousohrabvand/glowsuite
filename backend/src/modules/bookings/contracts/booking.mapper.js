export const mapBookingToResponse = (booking) => ({
  id: booking._id,
  user: booking.user,
  service: booking.service,
  serviceName: booking.serviceName,
  stylist: booking.stylist,
  stylistName: booking.stylistName,
  date: booking.date,
  time: booking.time,
  slotStart: booking.slotStart,
  slotEnd: booking.slotEnd,
  notes: booking.notes,
  stylistNotes: booking.stylistNotes,
  price: booking.price,
  status: booking.status,
  paymentStatus: booking.paymentStatus,
  paidAt: booking.paidAt,
  stripeSessionId: booking.stripeSessionId,
  reminderEmailSent: booking.reminderEmailSent,
  holdId: booking.holdId,
  createdAt: booking.createdAt,
  updatedAt: booking.updatedAt,
});

export const mapBookingsToResponse = (bookings) =>
  bookings.map((booking) => mapBookingToResponse(booking));
