import { bookingRepository } from "../../infrastructure/repositories/booking.repository.js";
import { mapBookingToResponse } from "../../contracts/booking.mapper.js";

export const createBookingHandler = async ({ userId, data }) => {
  const existingBooking = await bookingRepository.findConflict({
    stylistId: data.stylist,
    slotStart: data.slotStart,
    slotEnd: data.slotEnd,
  });

  if (existingBooking) {
    const error = new Error("This slot has already been booked");
    error.statusCode = 409;
    throw error;
  }

  const booking = await bookingRepository.create({
    user: userId,
    service: data.service || null,
    serviceName: data.serviceName,
    stylist: data.stylist,
    stylistName: data.stylistName,
    date: data.date,
    time: data.time,
    slotStart: data.slotStart,
    slotEnd: data.slotEnd,
    notes: data.notes || "",
    price: data.price || 0,
    holdId: data.holdId || "",
    status: "Pending",
    paymentStatus: "unpaid",
  });

  return mapBookingToResponse(booking);
};
