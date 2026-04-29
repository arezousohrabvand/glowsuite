import { bookingRepository } from "../../infrastructure/repositories/booking.repository.js";
import { mapBookingToResponse } from "../../contracts/booking.mapper.js";
import { createOutboxEvent } from "../../../../shared/utils/createOutboxEvent.js";

const getCustomerName = (user) =>
  `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
  "GlowSuite customer";

const getStylistName = (booking) =>
  booking.stylistName ||
  `${booking.stylist?.firstName || ""} ${booking.stylist?.lastName || ""}`.trim();

export const adminUpdateBookingStatusHandler = async ({
  bookingId,
  status,
}) => {
  const booking = await bookingRepository.findByIdWithDetails(bookingId);

  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  if (booking.status === "Completed" && status !== "Completed") {
    const error = new Error("Completed booking cannot be changed");
    error.statusCode = 400;
    throw error;
  }

  if (booking.status === "Cancelled") {
    const error = new Error("Cancelled booking cannot be changed");
    error.statusCode = 400;
    throw error;
  }

  const updatedBooking = await bookingRepository.updateById(bookingId, {
    status,
  });

  if (status === "Confirmed" || status === "Upcoming") {
    await createOutboxEvent({
      type: "BOOKING_CONFIRMED_EMAIL",
      payload: {
        email: booking.user.email,
        customerName: getCustomerName(booking.user),
        serviceName: booking.serviceName || booking.service?.name,
        stylistName: getStylistName(booking),
        date: booking.date,
        time: booking.time,
      },
    });
  }

  if (status === "Cancelled") {
    await createOutboxEvent({
      type: "BOOKING_CANCELLED_EMAIL",
      payload: {
        email: booking.user.email,
        customerName: getCustomerName(booking.user),
        serviceName: booking.serviceName || booking.service?.name,
        stylistName: getStylistName(booking),
        date: booking.date,
        time: booking.time,
      },
    });
  }

  return {
    message:
      status === "Confirmed" || status === "Upcoming"
        ? "Booking confirmed and email queued."
        : status === "Cancelled"
          ? "Booking cancelled and email queued. Refund must be handled separately."
          : "Booking status updated successfully.",
    booking: mapBookingToResponse(updatedBooking),
  };
};
