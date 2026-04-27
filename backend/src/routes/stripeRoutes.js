import express from "express";
import { protect } from "../shared/middleware/authMiddleware.js";
import {
  getStripePreview,
  createStripeCheckout,
  verifyStripeSession,
} from "../controllers/stripeController.js";

const router = express.Router();

router.post("/preview", protect, getStripePreview);
router.post("/checkout", protect, createStripeCheckout);
router.get("/verify/:sessionId", protect, verifyStripeSession);

export default router;
