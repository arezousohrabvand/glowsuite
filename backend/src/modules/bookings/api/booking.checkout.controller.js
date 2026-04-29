import asyncHandler from "express-async-handler";

import {
  createBookingCheckoutDto,
  paymentSuccessDto,
} from "../contracts/bookingCheckout.dto.js";

import {
  validateCreateBookingCheckoutInput,
  validatePaymentSuccessInput,
} from "../contracts/bookingCheckout.schema.js";

import { createBookingCheckoutHandler } from "../application/checkout/createBookingCheckout.handler.js";
import { markBookingPaidAfterSuccessHandler } from "../application/checkout/markBookingPaidAfterSuccess.handler.js";
import { createSlotHoldDto } from "../contracts/slotHold.dto.js";
import { validateCreateSlotHoldInput } from "../contracts/slotHold.schema.js";
import { mapSlotHoldToResponse } from "../contracts/slotHold.mapper.js";
import SlotHold from "../infrastructure/mongoose/slotHold.model.js";
import Booking from "../infrastructure/mongoose/booking.model.js";
export const createBookingCheckoutSession = asyncHandler(async (req, res) => {
  const dto = createBookingCheckoutDto(req.body);

  const validationError = validateCreateBookingCheckoutInput(dto);
  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  const result = await createBookingCheckoutHandler({
    user: req.user,
    data: dto,
  });

  res.status(200).json(result);
});

export const markBookingPaidAfterSuccess = asyncHandler(async (req, res) => {
  const dto = paymentSuccessDto(req.query);

  const validationError = validatePaymentSuccessInput(dto);
  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  const result = await markBookingPaidAfterSuccessHandler({
    sessionId: dto.sessionId,
  });

  res.status(200).json(result);
});
export const holdBookingSlot = asyncHandler(async (req, res) => {
  const dto = createSlotHoldDto(req.body);

  const validationError = validateCreateSlotHoldInput(dto);
  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  const now = new Date();

  await SlotHold.updateMany(
    { status: "active", expiresAt: { $lte: now } },
    { $set: { status: "expired" } },
  );

  const existingBooking = await Booking.findOne({
    stylistName: dto.stylistName,
    date: dto.date,
    time: dto.time,
    status: { $in: ["Pending", "Upcoming", "Confirmed"] },
  });

  if (existingBooking) {
    res.status(409);
    throw new Error("This slot is already booked");
  }

  const existingHold = await SlotHold.findOne({
    stylistName: dto.stylistName,
    date: dto.date,
    time: dto.time,
    status: "active",
    expiresAt: { $gt: now },
  });

  if (existingHold && String(existingHold.user) !== String(req.user._id)) {
    res.status(409);
    throw new Error("This slot is temporarily reserved");
  }

  await SlotHold.updateMany(
    { user: req.user._id, status: "active" },
    { $set: { status: "released" } },
  );

  const hold = await SlotHold.create({
    user: req.user._id,
    serviceName: dto.serviceName,
    stylistName: dto.stylistName,
    date: dto.date,
    time: dto.time,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    status: "active",
  });

  res.status(201).json({
    message: "Slot reserved successfully",
    ...mapSlotHoldToResponse(hold),
  });
});

export const getBookingHoldStatus = asyncHandler(async (req, res) => {
  const hold = await SlotHold.findById(req.params.holdId);

  if (!hold) {
    res.status(404);
    throw new Error("Hold not found");
  }

  if (String(hold.user) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Not authorized");
  }

  if (hold.status === "active" && new Date(hold.expiresAt) <= new Date()) {
    hold.status = "expired";
    await hold.save();
  }

  res.status(200).json(mapSlotHoldToResponse(hold));
});

export const releaseBookingHold = asyncHandler(async (req, res) => {
  const hold = await SlotHold.findById(req.params.holdId);

  if (!hold) {
    res.status(404);
    throw new Error("Hold not found");
  }

  if (String(hold.user) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Not authorized");
  }

  if (hold.status === "active") {
    hold.status = "released";
    await hold.save();
  }

  res.status(200).json({ message: "Slot released" });
});
