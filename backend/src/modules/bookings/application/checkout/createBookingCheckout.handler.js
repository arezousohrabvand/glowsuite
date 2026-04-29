import { bookingRepository } from "../../infrastructure/repositories/booking.repository.js";
import { slotHoldRepository } from "../../infrastructure/repositories/slotHold.repository.js";
import { serviceRepository } from "../../infrastructure/repositories/service.repository.js";
import { stylistRepository } from "../../infrastructure/repositories/stylist.repository.js";
import { billingRepository } from "../../infrastructure/repositories/billing.repository.js";

import {
  calculateBillingBreakdown,
  getValidCoupon,
} from "../../../../shared/utils/billingMath.js";

import {
  buildSlotDates,
  parseDurationToMinutes,
} from "../helpers/bookingTime.helper.js";

import { stripeCheckoutService } from "../services/stripeCheckout.service.js";

export const createBookingCheckoutHandler = async ({ user, data }) => {
  const hold = await slotHoldRepository.findById(data.holdId);

  if (!hold) {
    const error = new Error("Slot hold not found");
    error.statusCode = 404;
    throw error;
  }

  if (String(hold.user) !== String(user._id)) {
    const error = new Error("This hold does not belong to you");
    error.statusCode = 403;
    throw error;
  }

  if (hold.status !== "active") {
    const error = new Error("This slot hold is no longer active");
    error.statusCode = 409;
    throw error;
  }

  if (new Date(hold.expiresAt) <= new Date()) {
    hold.status = "expired";
    await hold.save();

    const error = new Error("This slot hold has expired");
    error.statusCode = 409;
    throw error;
  }

  const finalServiceName = (hold.serviceName || data.serviceName || "").trim();
  const finalStylistName = (hold.stylistName || data.stylistName || "").trim();
  const finalDate = hold.date || data.date;
  const finalTime = hold.time || data.time;

  if (!finalServiceName || !finalStylistName || !finalDate || !finalTime) {
    const error = new Error(
      "serviceName, stylistName, date, and time are required",
    );
    error.statusCode = 400;
    throw error;
  }

  const stylistUser = await stylistRepository.findByName(finalStylistName);

  if (!stylistUser) {
    const error = new Error(`Stylist not found: ${finalStylistName}`);
    error.statusCode = 404;
    throw error;
  }

  const service = await serviceRepository.findBestMatch(finalServiceName);

  if (!service) {
    const error = new Error("Service not found");
    error.statusCode = 404;
    throw error;
  }

  const durationMinutes = parseDurationToMinutes(
    service.durationMinutes || service.duration || 60,
  );

  const { slotStart, slotEnd } = buildSlotDates(
    finalDate,
    finalTime,
    durationMinutes,
  );

  const existingBooking = await bookingRepository.findConflict({
    stylistId: stylistUser._id,
    slotStart,
    slotEnd,
  });

  if (existingBooking) {
    const error = new Error("This slot has already been booked");
    error.statusCode = 409;
    throw error;
  }

  const subtotal = Number(service.price || data.price || 0);

  const coupon = await getValidCoupon({
    couponCode: data.couponCode,
    type: "booking",
    subtotal,
    state: data.state || "TX",
  });

  const breakdown = calculateBillingBreakdown({
    subtotal,
    state: data.state || "TX",
    coupon,
  });

  const booking = await bookingRepository.create({
    user: user._id,
    service: service._id,
    serviceName: service.name || finalServiceName,
    stylist: stylistUser._id,
    stylistName: finalStylistName,
    date: finalDate,
    time: finalTime,
    slotStart,
    slotEnd,
    notes: data.notes || "",
    price: breakdown.total,
    holdId: hold._id.toString(),
    status: "Pending",
    paymentStatus: "unpaid",
  });

  const session = await stripeCheckoutService.createBookingCheckoutSession({
    user,
    booking,
    service,
    stylistUser,
    breakdown,
    coupon,
    state: data.state || "TX",
    holdId: hold._id,
  });

  await billingRepository.create({
    user: user._id,
    booking: booking._id,
    service: service._id,
    title: service.name || finalServiceName,
    type: "booking",
    status: "pending",
    paymentStatus: "pending",
    stripeSessionId: session.id,
    stripePaymentIntentId: session.payment_intent || null,
    subtotal: breakdown.subtotal,
    taxAmount: breakdown.taxAmount,
    discountAmount: breakdown.discountAmount,
    total: breakdown.total,
    amount: breakdown.total,
    couponCode: coupon?.code || null,
    couponDiscountType: coupon?.discountType || null,
    couponDiscountValue: coupon?.discountValue || 0,
    state: data.state || "TX",
    refundAmount: 0,
    stripeRefundId: "",
  });

  booking.stripeSessionId = session.id;
  await booking.save();

  return {
    url: session.url,
    breakdown,
    bookingId: booking._id,
  };
};
