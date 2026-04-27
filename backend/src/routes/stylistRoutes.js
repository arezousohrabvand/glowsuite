import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

import {
  getStylistDashboard,
  getStylistBookings,
  getStylistSchedule,
  getStylistTodaySchedule,
  getStylistCustomers,
  updateStylistBookingStatus,
  updateStylistBookingNotes,
  rescheduleStylistBooking,
} from "../controllers/stylistController.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("stylist"));

router.get("/dashboard", getStylistDashboard);
router.get("/bookings", getStylistBookings);
router.get("/schedule", getStylistSchedule);
router.get("/schedule/today", getStylistTodaySchedule);
router.get("/customers", getStylistCustomers);

router.patch("/bookings/:id/status", updateStylistBookingStatus);
router.patch("/bookings/:id/notes", updateStylistBookingNotes);
router.patch("/bookings/:id/reschedule", rescheduleStylistBooking);

export default router;
