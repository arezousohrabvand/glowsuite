import { bookingRepository } from "../../infrastructure/repositories/booking.repository.js";
import { mapBookingsToResponse } from "../../contracts/booking.mapper.js";

export const getMyBookingsHandler = async (userId) => {
  const bookings = await bookingRepository.findMyBookings(userId);
  return mapBookingsToResponse(bookings);
};
