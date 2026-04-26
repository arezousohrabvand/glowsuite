import express from "express";
import {
  getClasses,
  getClassById,
  getAdminClasses,
  createAdminClass,
  updateAdminClass,
  deleteAdminClass,
  getAdminClassEnrollments,
} from "../controllers/classController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

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

router.get("/classes", protect, adminOnly, getAdminClasses);

router.post("/classes", protect, adminOnly, createAdminClass);

router.put("/classes/:classId", protect, adminOnly, updateAdminClass);

router.delete("/classes/:classId", protect, adminOnly, deleteAdminClass);

router.get(
  "/classes/:classId/enrollments",
  protect,
  adminOnly,
  getAdminClassEnrollments,
);

/* =========================
   PUBLIC SINGLE CLASS
   /api/classes/:id
========================= */

router.get("/:id", getClassById);

export default router;
