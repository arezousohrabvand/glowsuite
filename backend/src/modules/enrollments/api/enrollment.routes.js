import express from "express";

import {
  enrollInClass,
  getMyEnrollments,
  getEnrollmentsAdmin,
  markEnrollmentPaidAfterSuccess,
  previewEnrollmentCheckout,
  createEnrollmentCheckout,
  cancelEnrollment,
} from "./enrollment.controller.js";

import { protect, adminOnly } from "../../../shared/middleware/authMiddleware.js";

const router = express.Router();

router.get("/my-enrollments", protect, getMyEnrollments);
router.get("/payment-success", protect, markEnrollmentPaidAfterSuccess);

router.get("/admin", protect, adminOnly, getEnrollmentsAdmin);

router.post("/preview", protect, previewEnrollmentCheckout);
router.post("/checkout", protect, createEnrollmentCheckout);

router.post("/:classId/preview", protect, (req, res, next) => {
  req.body.classId = req.params.classId;
  return previewEnrollmentCheckout(req, res, next);
});

router.post("/:classId/checkout", protect, (req, res, next) => {
  req.body.classId = req.params.classId;
  return createEnrollmentCheckout(req, res, next);
});

router.post("/:classId", protect, (req, res, next) => {
  req.body.classId = req.params.classId;
  return enrollInClass(req, res, next);
});

router.post("/", protect, enrollInClass);

router.patch("/:enrollmentId/cancel", protect, cancelEnrollment);

export default router;
