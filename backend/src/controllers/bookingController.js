import Stripe from "stripe";
import Booking from "../models/Booking.js";
import Billing from "../models/Billing.js";
import Service from "../models/Service.js";
import SlotHold from "../models/SlotHold.js";
import User from "../models/User.js";
import {
  calculateBillingBreakdown,
  getValidCoupon,
} from "../utils/billingMath.js";
import { createOutboxEvent } from "../utils/createOutboxEvent.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* =========================
   Helpers
========================= */

function parseTimeTo24Hour(timeStr) {
  const [time, modifier] = String(timeStr || "").split(" ");
  let [hours, minutes] = String(time || "0:00")
    .split(":")
    .map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return { hours, minutes };
}

function parseDurationToMinutes(durationValue) {
  if (!durationValue) return 60;
  if (typeof durationValue === "number") return durationValue;

  const str = String(durationValue).toLowerCase();

  const hrMatch = str.match(/(\d+)\s*h/);
  const minMatch = str.match(/(\d+)\s*m/);
  const pureMinutesMatch = str.match(/(\d+)\s*min/);

  const hours = hrMatch ? Number(hrMatch[1]) : 0;
  const minutes = minMatch
    ? Number(minMatch[1])
    : pureMinutesMatch
      ? Number(pureMinutesMatch[1])
      : 0;

  const total = hours * 60 + minutes;
  return total || 60;
}

function buildSlotDates(dateStr, timeStr, durationMinutes = 60) {
  const { hours, minutes } = parseTimeTo24Hour(timeStr);

  const slotStart = new Date(dateStr);
  slotStart.setHours(hours, minutes, 0, 0);

  const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60 * 1000);

  return { slotStart, slotEnd };
}

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

function getCustomerName(user) {
  return (
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    "GlowSuite customer"
  );
}

function getStylistName(booking) {
  return (
    booking.stylistName ||
    `${booking.stylist?.firstName || ""} ${booking.stylist?.lastName || ""}`.trim()
  );
}

/* =========================
   Checkout
========================= */

export const createBookingCheckoutSession = async (req, res) => {
  try {
    const {
      serviceName,
      stylistName,
      date,
      time,
      notes,
      price,
      couponCode,
      state,
      holdId,
    } = req.body;

    if (!holdId) {
      return res.status(400).json({ message: "holdId is required" });
    }

    const hold = await SlotHold.findById(holdId);

    if (!hold) {
      return res.status(404).json({ message: "Slot hold not found" });
    }

    if (String(hold.user) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "This hold does not belong to you" });
    }

    if (hold.status !== "active") {
      return res
        .status(409)
        .json({ message: "This slot hold is no longer active" });
    }

    if (new Date(hold.expiresAt) <= new Date()) {
      hold.status = "expired";
      await hold.save();
      return res.status(409).json({ message: "This slot hold has expired" });
    }

    const finalServiceName = (hold.serviceName || serviceName || "").trim();
    const finalStylistName = (hold.stylistName || stylistName || "").trim();
    const finalDate = hold.date || date;
    const finalTime = hold.time || time;

    if (!finalServiceName || !finalStylistName || !finalDate || !finalTime) {
      return res.status(400).json({
        message: "serviceName, stylistName, date, and time are required",
      });
    }

    const stylistUser = await findStylistUserByName(finalStylistName);

    if (!stylistUser) {
      return res.status(404).json({
        message: `Stylist not found: ${finalStylistName}`,
      });
    }

    let service = await Service.findOne({
      name: { $regex: new RegExp(`^${finalServiceName}$`, "i") },
    });

    if (!service) {
      const simplified = finalServiceName
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .trim();

      const services = await Service.find().select(
        "_id name price category duration durationMinutes",
      );

      service =
        services.find((item) => {
          const candidate = String(item.name || "")
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, "")
            .trim();

          return (
            candidate.includes(simplified) || simplified.includes(candidate)
          );
        }) || null;
    }

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const durationMinutes = parseDurationToMinutes(
      service.durationMinutes || service.duration || 60,
    );

    const { slotStart, slotEnd } = buildSlotDates(
      finalDate,
      finalTime,
      durationMinutes,
    );

    const existingBooking = await Booking.findOne({
      stylist: stylistUser._id,
      status: { $in: ["Pending", "Upcoming", "Confirmed"] },
      slotStart: { $lt: slotEnd },
      slotEnd: { $gt: slotStart },
    });

    if (existingBooking) {
      return res
        .status(409)
        .json({ message: "This slot has already been booked" });
    }

    const serviceNameForBilling = service.name || finalServiceName;
    const subtotal = Number(service.price || price || 0);

    const coupon = await getValidCoupon({
      couponCode,
      type: "booking",
      subtotal,
      state: state || "TX",
    });

    const breakdown = calculateBillingBreakdown({
      subtotal,
      state: state || "TX",
      coupon,
    });

    const pendingBooking = await Booking.create({
      user: req.user._id,
      service: service._id,
      serviceName: serviceNameForBilling,
      stylist: stylistUser._id,
      stylistName: finalStylistName,
      date: finalDate,
      time: finalTime,
      slotStart,
      slotEnd,
      notes: notes || "",
      price: breakdown.total,
      holdId: hold._id.toString(),
      status: "Pending",
      paymentStatus: "unpaid",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: req.user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: serviceNameForBilling,
              description: `Booking for ${serviceNameForBilling}`,
            },
            unit_amount: Math.round(breakdown.total * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: pendingBooking._id.toString(),
        userId: req.user._id.toString(),
        serviceId: service._id.toString(),
        holdId: hold._id.toString(),
        stylistId: stylistUser._id.toString(),
        serviceName: serviceNameForBilling,
        stylistName: finalStylistName,
        bookingDate: finalDate,
        bookingTime: finalTime,
        couponCode: coupon?.code || "",
        state: state || "TX",
        bookingType: "service",
      },
      success_url: `${process.env.CLIENT_URL}/payment-success?type=booking&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    await Billing.create({
      user: req.user._id,
      booking: pendingBooking._id,
      service: service._id,
      title: serviceNameForBilling,
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
      state: state || "TX",
      refundAmount: 0,
      stripeRefundId: "",
    });

    pendingBooking.stripeSessionId = session.id;
    await pendingBooking.save();

    res.status(200).json({
      url: session.url,
      breakdown,
      bookingId: pendingBooking._id,
    });
  } catch (error) {
    console.error("createBookingCheckoutSession error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Legacy stub
========================= */

export const createBooking = async (req, res) => {
  try {
    res.status(201).json({
      _id: "temp123",
      ...req.body,
      status: "Pending",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Slot hold
========================= */

export const holdBookingSlot = async (req, res) => {
  try {
    const { serviceName, stylistName, date, time } = req.body;

    if (!serviceName || !stylistName || !date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const now = new Date();

    await SlotHold.updateMany(
      { status: "active", expiresAt: { $lte: now } },
      { $set: { status: "expired" } },
    );

    const existingBooking = await Booking.findOne({
      stylistName,
      date,
      time,
      status: { $in: ["Pending", "Upcoming", "Confirmed"] },
    });

    if (existingBooking) {
      return res.status(409).json({ message: "This slot is already booked" });
    }

    const existingHold = await SlotHold.findOne({
      stylistName,
      date,
      time,
      status: "active",
      expiresAt: { $gt: now },
    });

    if (existingHold && String(existingHold.user) !== String(req.user._id)) {
      return res
        .status(409)
        .json({ message: "This slot is temporarily reserved" });
    }

    await SlotHold.updateMany(
      { user: req.user._id, status: "active" },
      { $set: { status: "released" } },
    );

    const hold = await SlotHold.create({
      user: req.user._id,
      serviceName,
      stylistName,
      date,
      time,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      status: "active",
    });

    res.status(201).json({
      message: "Slot reserved successfully",
      holdId: hold._id,
      expiresAt: hold.expiresAt,
      status: hold.status,
    });
  } catch (error) {
    console.error("holdBookingSlot error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getBookingHoldStatus = async (req, res) => {
  try {
    const hold = await SlotHold.findById(req.params.holdId);

    if (!hold) {
      return res.status(404).json({ message: "Hold not found" });
    }

    if (String(hold.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (hold.status === "active" && new Date(hold.expiresAt) <= new Date()) {
      hold.status = "expired";
      await hold.save();
    }

    res.status(200).json({
      holdId: hold._id,
      status: hold.status,
      expiresAt: hold.expiresAt,
      serviceName: hold.serviceName,
      stylistName: hold.stylistName,
      date: hold.date,
      time: hold.time,
    });
  } catch (error) {
    console.error("getBookingHoldStatus error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const releaseBookingHold = async (req, res) => {
  try {
    const hold = await SlotHold.findById(req.params.holdId);

    if (!hold) {
      return res.status(404).json({ message: "Hold not found" });
    }

    if (String(hold.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (hold.status === "active") {
      hold.status = "released";
      await hold.save();
    }

    res.status(200).json({ message: "Slot released" });
  } catch (error) {
    console.error("releaseBookingHold error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Read bookings
========================= */

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("service")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("getMyBookings error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Payment success
========================= */

export const markBookingPaidAfterSuccess = async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ message: "session_id is required" });
    }

    const billing = await Billing.findOne({ stripeSessionId: session_id });

    if (!billing) {
      return res.status(404).json({ message: "Billing record not found" });
    }

    if (billing.paymentStatus !== "paid") {
      billing.status = "paid";
      billing.paymentStatus = "paid";

      if (!billing.stripePaymentIntentId) {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        billing.stripePaymentIntentId = session.payment_intent || "";
      }

      await billing.save();
    }

    if (billing.booking) {
      const booking = await Booking.findByIdAndUpdate(
        billing.booking,
        {
          $set: {
            status: "Pending",
            paymentStatus: "paid",
            paidAt: new Date(),
          },
        },
        { returnDocument: "after", runValidators: false },
      );

      if (booking) {
        await SlotHold.updateMany(
          {
            user: booking.user,
            stylistName: booking.stylistName,
            date: booking.date,
            time: booking.time,
            status: "active",
          },
          { $set: { status: "converted" } },
        );
      }
    }

    res.status(200).json({ message: "Booking payment marked as paid" });
  } catch (error) {
    console.error("markBookingPaidAfterSuccess error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Customer cancel booking
========================= */

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate("service");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (String(booking.user) !== String(req.user._id)) {
      return res.status(403).json({
        message: "Not authorized to cancel this booking",
      });
    }

    if (booking.status === "Completed") {
      return res.status(400).json({
        message: "Completed booking cannot be cancelled",
      });
    }

    if (booking.status === "Cancelled") {
      return res.status(400).json({
        message: "Booking is already cancelled",
      });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        $set: {
          status: "Cancelled",
          paymentStatus: booking.paymentStatus || "unpaid",
        },
      },
      { returnDocument: "after", runValidators: false },
    ).populate("service");

    await SlotHold.updateMany(
      {
        user: booking.user,
        stylistName: booking.stylistName,
        date: booking.date,
        time: booking.time,
        status: "active",
      },
      { $set: { status: "released" } },
    );

    await createOutboxEvent({
      type: "BOOKING_CANCELLED_EMAIL",
      payload: {
        email: req.user.email,
        customerName: getCustomerName(req.user),
        serviceName: booking.serviceName || booking.service?.name,
        stylistName: booking.stylistName,
        date: booking.date,
        time: booking.time,
      },
    });

    return res.status(200).json({
      message:
        booking.paymentStatus === "paid"
          ? "Booking cancelled. Refund must be handled by admin. Cancellation email queued."
          : "Booking cancelled successfully. Cancellation email queued.",
      booking: updatedBooking,
      refunded: false,
    });
  } catch (error) {
    console.error("cancelBooking error:", error);
    return res.status(500).json({
      message: error.message || "Failed to cancel booking",
    });
  }
};

/* =========================
   Admin: confirm / cancel booking
========================= */

export const updateBookingStatusByAdmin = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Upcoming",
      "Confirmed",
      "Cancelled",
      "Completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    const booking = await Booking.findById(bookingId)
      .populate("user")
      .populate("service")
      .populate("stylist");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "Completed" && status !== "Completed") {
      return res.status(400).json({
        message: "Completed booking cannot be changed",
      });
    }

    if (booking.status === "Cancelled") {
      return res.status(400).json({
        message: "Cancelled booking cannot be changed",
      });
    }

    booking.status = status;
    await booking.save();

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

    return res.status(200).json({
      message:
        status === "Confirmed" || status === "Upcoming"
          ? "Booking confirmed and email queued."
          : status === "Cancelled"
            ? "Booking cancelled and email queued. Refund must be handled separately."
            : "Booking status updated successfully.",
      booking,
    });
  } catch (error) {
    console.error("updateBookingStatusByAdmin error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Reschedule booking
========================= */

export const rescheduleBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { date, time, stylistName, notes } = req.body;

    if (!date || !time || !stylistName) {
      return res.status(400).json({
        message: "date, time, and stylistName are required",
      });
    }

    const booking = await Booking.findById(bookingId).populate("service");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (String(booking.user) !== String(req.user._id)) {
      return res.status(403).json({
        message: "Not authorized to reschedule this booking",
      });
    }

    if (booking.status === "Cancelled") {
      return res.status(400).json({
        message: "Cancelled booking cannot be rescheduled",
      });
    }

    if (booking.status === "Completed") {
      return res.status(400).json({
        message: "Completed booking cannot be rescheduled",
      });
    }

    const now = new Date();

    const existingHold = await SlotHold.findOne({
      stylistName,
      date,
      time,
      status: "active",
      expiresAt: { $gt: now },
    });

    if (existingHold && String(existingHold.user) !== String(req.user._id)) {
      return res.status(409).json({
        message: "This slot is temporarily reserved",
      });
    }

    const stylistUser = await findStylistUserByName(stylistName);

    if (!stylistUser) {
      return res.status(404).json({
        message: `Stylist not found: ${stylistName}`,
      });
    }

    const durationMinutes = Math.max(
      30,
      parseDurationToMinutes(booking.service?.duration || 60),
    );

    const { slotStart, slotEnd } = buildSlotDates(date, time, durationMinutes);

    const existingBooking = await Booking.findOne({
      _id: { $ne: bookingId },
      stylist: stylistUser._id,
      status: { $in: ["Pending", "Upcoming", "Confirmed"] },
      slotStart: { $lt: slotEnd },
      slotEnd: { $gt: slotStart },
    });

    if (existingBooking) {
      return res.status(409).json({ message: "This slot is already booked" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        $set: {
          date,
          time,
          stylist: stylistUser._id,
          stylistName,
          slotStart,
          slotEnd,
          notes: notes || "",
          status: booking.status === "Confirmed" ? "Upcoming" : booking.status,
        },
      },
      { returnDocument: "after", runValidators: false },
    );

    res.status(200).json({
      message: "Booking rescheduled successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("rescheduleBooking error:", error);
    res.status(500).json({ message: error.message });
  }
};
