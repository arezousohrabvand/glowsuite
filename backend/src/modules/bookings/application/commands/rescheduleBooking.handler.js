import User from "../../../users/infrastructure/mongoose/UserModel.js";
import { bookingRepository } from "../../infrastructure/repositories/booking.repository.js";
import { slotHoldRepository } from "../../infrastructure/repositories/slotHold.repository.js";
import {
  buildSlotDates,
  parseDurationToMinutes,
} from "../helpers/bookingTime.helper.js";
import { mapBookingToResponse } from "../../contracts/booking.mapper.js";

async function findStylistUserByName(stylistName) {
  if (!stylistName) return null;

  const clean = stylistName.trim().replace(/\s+/g, " ");
  const parts = clean.split(" ");
  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ");

  let stylistUser = await User.findOne({
    role: "stylist",
    firstName: { $regex: `^${firstName}$`, $options: "i" },
    lastName: { $regex: `^${lastName}$`, $options: "i" },
  });

  if (stylistUser) return stylistUser;

  return User.findOne({
    role: "stylist",
    $expr: {
      $regexMatch: {
        input: { $concat: ["$firstName", " ", "$lastName"] },
        regex: clean,
        options: "i",
      },
    },
  });
}

export const rescheduleBookingHandler = async ({ bookingId, userId, data }) => {
  const booking = await bookingRepository.findByIdWithDetails(bookingId);

  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  if (String(booking.user._id || booking.user) !== String(userId)) {
    const error = new Error("Not authorized to reschedule this booking");
    error.statusCode = 403;
    throw error;
  }

  if (booking.status === "Cancelled") {
    const error = new Error("Cancelled booking cannot be rescheduled");
    error.statusCode = 400;
    throw error;
  }

  if (booking.status === "Completed") {
    const error = new Error("Completed booking cannot be rescheduled");
    error.statusCode = 400;
    throw error;
  }

  const existingHold = await slotHoldRepository.findActiveHold({
    stylistName: data.stylistName,
    date: data.date,
    time: data.time,
  });

  if (existingHold && String(existingHold.user) !== String(userId)) {
    const error = new Error("This slot is temporarily reserved");
    error.statusCode = 409;
    throw error;
  }

  const stylistUser = await findStylistUserByName(data.stylistName);

  if (!stylistUser) {
    const error = new Error(`Stylist not found: ${data.stylistName}`);
    error.statusCode = 404;
    throw error;
  }

  const durationMinutes = Math.max(
    30,
    parseDurationToMinutes(booking.service?.duration || 60),
  );

  const { slotStart, slotEnd } = buildSlotDates(
    data.date,
    data.time,
    durationMinutes,
  );

  const conflict = await bookingRepository.findConflict({
    stylistId: stylistUser._id,
    slotStart,
    slotEnd,
    excludeBookingId: bookingId,
  });

  if (conflict) {
    const error = new Error("This slot is already booked");
    error.statusCode = 409;
    throw error;
  }

  const updatedBooking = await bookingRepository.updateById(bookingId, {
    date: data.date,
    time: data.time,
    stylist: stylistUser._id,
    stylistName: data.stylistName,
    slotStart,
    slotEnd,
    notes: data.notes || "",
    status: booking.status === "Confirmed" ? "Upcoming" : booking.status,
  });

  return mapBookingToResponse(updatedBooking);
};
