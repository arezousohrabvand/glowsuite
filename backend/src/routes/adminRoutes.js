import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  getAdminStats,
  getAllBookings,
  updateBookingStatus,
  getAllServices,
  createServiceByAdmin,
  updateServiceByAdmin,
  deleteServiceByAdmin,
  getAllUsers,
  updateUserRole,
  getAdminCalendar,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

// dashboard
router.get("/stats", getAdminStats);

// bookings
router.get("/bookings", getAllBookings);
router.patch("/bookings/:bookingId/status", updateBookingStatus);

// services
router.get("/services", getAllServices);
router.post("/services", createServiceByAdmin);
router.put("/services/:serviceId", updateServiceByAdmin);
router.delete("/services/:serviceId", deleteServiceByAdmin);

// users
router.get("/users", getAllUsers);
router.patch("/users/:userId/role", updateUserRole);

// calendar
router.get("/calendar", getAdminCalendar);

export default router;
