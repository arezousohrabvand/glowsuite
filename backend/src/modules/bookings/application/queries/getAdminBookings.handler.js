import { bookingRepository } from "../../infrastructure/repositories/booking.repository.js";
import { mapBookingsToResponse } from "../../contracts/booking.mapper.js";

export const getAdminBookingsHandler = async (query = {}) => {
  const filters = {};

  if (query.status) filters.status = query.status;
  if (query.paymentStatus) filters.paymentStatus = query.paymentStatus;
  if (query.stylist) filters.stylist = query.stylist;
  if (query.user) filters.user = query.user;

  const bookings = await bookingRepository.findAdminBookings(filters);

  return mapBookingsToResponse(bookings);
};
