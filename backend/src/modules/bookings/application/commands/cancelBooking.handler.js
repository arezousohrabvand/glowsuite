import { bookingRepository } from "../../infrastructure/repositories/booking.repository.js";
import { slotHoldRepository } from "../../infrastructure/repositories/slotHold.repository.js";
import { createOutboxEvent } from "../../../../shared/utils/createOutboxEvent.js";
import { getCustomerName } from "../helpers/bookingEmail.helper.js";
import { mapBookingToResponse } from "../../contracts/booking.mapper.js";

export const cancelBookingHandler = async ({ bookingId, user }) => {
  const booking = await bookingRepository.findByIdWithDetails(bookingId);

  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  if (String(booking.user._id || booking.user) !== String(user._id)) {
    const error = new Error("Not authorized to cancel this booking");
    error.statusCode = 403;
    throw error;
  }

  if (booking.status === "Completed") {
    const error = new Error("Completed booking cannot be cancelled");
    error.statusCode = 400;
    throw error;
  }

  if (booking.status === "Cancelled") {
    const error = new Error("Booking is already cancelled");
    error.statusCode = 400;
    throw error;
  }

  const updatedBooking = await bookingRepository.updateById(bookingId, {
    status: "Cancelled",
    paymentStatus: booking.paymentStatus || "unpaid",
  });

  await slotHoldRepository.releaseActiveHold({
    userId: booking.user._id || booking.user,
    stylistName: booking.stylistName,
    date: booking.date,
    time: booking.time,
  });

  await createOutboxEvent({
    type: "BOOKING_CANCELLED_EMAIL",
    payload: {
      email: user.email,
      customerName: getCustomerName(user),
      serviceName: booking.serviceName || booking.service?.name,
      stylistName: booking.stylistName,
      date: booking.date,
      time: booking.time,
    },
  });

  return {
    message:
      booking.paymentStatus === "paid"
        ? "Booking cancelled. Refund must be handled by admin. Cancellation email queued."
        : "Booking cancelled successfully. Cancellation email queued.",
    booking: mapBookingToResponse(updatedBooking),
    refunded: false,
  };
};
