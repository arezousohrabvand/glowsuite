import express from "express";
import { protect } from "../shared/middleware/authMiddleware.js";
import { authorizeRoles } from "../shared/middleware/roleMiddleware.js";

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
  getAllClassEnrollments,
  cleanBrokenEnrollments,
  getAdminRevenue,
} from "../controllers/adminController.js";

import {
  getAdminClasses,
  createAdminClass,
  updateAdminClass,
  deleteAdminClass,
  getAdminClassEnrollments,
} from "../controllers/classController.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("admin"));

router.get("/stats", getAdminStats);

router.get("/bookings", getAllBookings);
router.patch("/bookings/:bookingId/status", updateBookingStatus);

router.get("/services", getAllServices);
router.post("/services", createServiceByAdmin);
router.put("/services/:serviceId", updateServiceByAdmin);
router.delete("/services/:serviceId", deleteServiceByAdmin);

router.get("/users", getAllUsers);
router.patch("/users/:userId/role", updateUserRole);

router.get("/calendar", getAdminCalendar);

router.get("/customers", getAdminCustomers);
router.get("/customers/:customerId", getAdminCustomerDetails);

router.get("/classes", getAdminClasses);
router.post("/classes", createAdminClass);
router.put("/classes/:classId", updateAdminClass);
router.delete("/classes/:classId", deleteAdminClass);
router.get("/classes/:classId/enrollments", getAdminClassEnrollments);
router.get("/enrollments", getAllClassEnrollments);
router.delete("/enrollments/cleanup", cleanBrokenEnrollments);
router.get("/revenue", getAdminRevenue);

export default router;
