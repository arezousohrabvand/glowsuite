import { DomainEvent } from "../../../../building-blocks/domain/DomainEvent.js";

export class BookingConfirmedEvent extends DomainEvent {
  constructor(booking) {
    super("BOOKING_CONFIRMED", {
      bookingId: booking._id?.toString(),
      userId: booking.user?.toString(),
      email: booking.customerEmail || booking.email,
      customerName: booking.customerName,
      serviceName: booking.serviceName,
      stylistName: booking.stylistName,
      date: booking.date,
      time: booking.time,
    });
  }
}
