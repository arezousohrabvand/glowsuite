import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
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
  getAdminCustomers,
  getAdminCustomerDetails,
  getAdminClasses,
  createAdminClass,
  updateAdminClass,
  deleteAdminClass,
  getAdminClassEnrollments,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

// dashboard
router.get("/stats", protect, adminOnly, getAdminStats);

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
// customers
router.get("/customers", getAdminCustomers);
router.get("/customers/:customerId", getAdminCustomerDetails);

// classes
router.get("/classes", getAdminClasses);
router.post("/classes", createAdminClass);
router.put("/classes/:classId", updateAdminClass);
router.delete("/classes/:classId", deleteAdminClass);
router.get("/classes/:classId/enrollments", getAdminClassEnrollments);

export default router;
