import asyncHandler from "express-async-handler";

import {
  createBookingDto,
  rescheduleBookingDto,
  updateBookingStatusDto,
} from "../contracts/booking.dto.js";

import {
  validateCreateBookingInput,
  validateRescheduleBookingInput,
  validateBookingStatusInput,
} from "../contracts/booking.schema.js";

import { createBookingHandler } from "../application/commands/createBooking.handler.js";
import { cancelBookingHandler } from "../application/commands/cancelBooking.handler.js";
import { confirmBookingHandler } from "../application/commands/confirmBooking.handler.js";
import { rescheduleBookingHandler } from "../application/commands/rescheduleBooking.handler.js";
import { getMyBookingsHandler } from "../application/queries/getMyBookings.handler.js";
import { getAdminBookingsHandler } from "../application/queries/getAdminBookings.handler.js";

export const createBooking = asyncHandler(async (req, res) => {
  const dto = createBookingDto(req.body);

  const validationError = validateCreateBookingInput(dto);
  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  const booking = await createBookingHandler({
    userId: req.user._id,
    data: dto,
  });

  res.status(201).json({
    message: "Booking created successfully",
    booking,
  });
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await getMyBookingsHandler(req.user._id);
  res.status(200).json(bookings);
});

export const getAdminBookings = asyncHandler(async (req, res) => {
  const bookings = await getAdminBookingsHandler(req.query);
  res.status(200).json(bookings);
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const result = await cancelBookingHandler({
    bookingId: req.params.bookingId,
    user: req.user,
  });

  res.status(200).json(result);
});

export const updateBookingStatusByAdmin = asyncHandler(async (req, res) => {
  const dto = updateBookingStatusDto(req.body);

  const validationError = validateBookingStatusInput(dto);
  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  const result = await confirmBookingHandler({
    bookingId: req.params.bookingId,
    status: dto.status,
  });

  res.status(200).json(result);
});

export const rescheduleBooking = asyncHandler(async (req, res) => {
  const dto = rescheduleBookingDto(req.body);

  const validationError = validateRescheduleBookingInput(dto);
  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  const booking = await rescheduleBookingHandler({
    bookingId: req.params.bookingId,
    userId: req.user._id,
    data: dto,
  });

  res.status(200).json({
    message: "Booking rescheduled successfully",
    booking,
  });
});
