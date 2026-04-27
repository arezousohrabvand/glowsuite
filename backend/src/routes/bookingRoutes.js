import express from "express";
import {
  holdBookingSlot,
  getBookingHoldStatus,
  releaseBookingHold,
  createBookingCheckoutSession,
  getMyBookings,
  markBookingPaidAfterSuccess,
  rescheduleBooking,
  cancelBooking,
  updateBookingStatusByAdmin,
} from "../controllers/bookingController.js";
import { protect, adminOnly } from "../shared/middleware/authMiddleware.js";

const router = express.Router();

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
  adminOnly,
  updateBookingStatusByAdmin,
);

router.get("/test", (req, res) => {
  res.json({ message: "booking route works" });
});

export default router;
