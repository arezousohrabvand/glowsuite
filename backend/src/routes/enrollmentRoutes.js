import express from "express";
import {
  enrollInClass,
  getMyEnrollments,
  markEnrollmentPaidAfterSuccess,
  previewEnrollmentCheckout,
  createEnrollmentCheckout,
} from "../controllers/enrollmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, enrollInClass);
router.get("/my-enrollments", protect, getMyEnrollments);
router.get("/payment-success", protect, markEnrollmentPaidAfterSuccess);

router.post("/preview", protect, previewEnrollmentCheckout);
router.post("/checkout", protect, createEnrollmentCheckout);

export default router;
