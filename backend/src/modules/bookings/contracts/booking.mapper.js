import { toBookingDto } from "./booking.dto.js";

export const bookingMapper = {
  toDto(booking) {
    if (!booking) return null;
    return toBookingDto(booking);
  },

  toDtoList(bookings = []) {
    return bookings.map((b) => toBookingDto(b));
  },

  toPersistence(data) {
    return {
      user: data.userId,
      service: data.serviceId || null,
      serviceName: data.serviceName,
      stylist: data.stylistId,
      stylistName: data.stylistName,
      date: data.date,
      time: data.time,
      slotStart: data.slotStart,
      slotEnd: data.slotEnd,
      notes: data.notes || "",
      price: data.price || 0,
    };
  },
};
