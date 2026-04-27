import express from "express";
import {
  getClasses,
  getClassById,
  getAdminClasses,
  createAdminClass,
  updateAdminClass,
  deleteAdminClass,
  getAdminClassEnrollments,
} from "./class.controller.js";

import {
  protect,
  adminOnly,
} from "../../../shared/middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   PUBLIC CLASS ROUTES
   /api/classes
========================= */

router.get("/", getClasses);

/* =========================
   ADMIN CLASS ROUTES
   /api/admin/classes
========================= */

router.get("/admin", protect, adminOnly, getAdminClasses);

router.post("/classes", protect, adminOnly, createAdminClass);

router.put("/classes/:classId", protect, adminOnly, updateAdminClass);

router.delete("/classes/:classId", protect, adminOnly, deleteAdminClass);

router.get(
  "/classes/:classId/enrollments",
  protect,
  adminOnly,
  getAdminClassEnrollments,
);
router.get("/classes", protect, adminOnly, getAdminClasses);
/* =========================
   PUBLIC SINGLE CLASS
   /api/classes/:id
========================= */

router.get("/:id", getClassById);

export default router;
