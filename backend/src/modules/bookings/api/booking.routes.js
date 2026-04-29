import express from "express";

import {
  createBooking,
  getMyBookings,
  rescheduleBooking,
  cancelBooking,
  updateBookingStatusByAdmin,
} from "./booking.controller.js";
import {
  holdBookingSlot,
  getBookingHoldStatus,
  releaseBookingHold,
  createBookingCheckoutSession,
  markBookingPaidAfterSuccess,
} from "./booking.checkout.controller.js";

import { protect } from "../../../shared/middleware/authMiddleware.js";
import { authorizeRoles } from "../../../shared/middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);

router.post("/hold-slot", protect, holdBookingSlot);
router.get("/hold-slot/:holdId", protect, getBookingHoldStatus);
router.delete("/hold-slot/:holdId", protect, releaseBookingHold);

router.get("/my", protect, getMyBookings);
router.post("/checkout", protect, createBookingCheckoutSession);
router.get("/payment-success", protect, markBookingPaidAfterSuccess);

router.put("/:bookingId/reschedule", protect, rescheduleBooking);
router.put("/:bookingId/cancel", protect, cancelBooking);

router.patch(
  "/admin/bookings/:bookingId/status",
  protect,
  authorizeRoles("admin"),
  updateBookingStatusByAdmin,
);

router.get("/test", (req, res) => {
  res.json({ message: "booking route works" });
});

export default router;
