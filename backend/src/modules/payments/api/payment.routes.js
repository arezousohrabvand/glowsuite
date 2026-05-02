import express from "express";
import { protect } from "../../../shared/middleware/authMiddleware.js";
import Billing from "../../../models/Billing.js";
import {
  createCheckoutSessionController,
  verifyPaymentController,
  getPaymentBySessionController,
  getMyPaymentsController,
} from "./payment.controller.js";

const router = express.Router();

router.post("/checkout", createCheckoutSessionController);
router.get("/verify/:sessionId", verifyPaymentController);
router.get("/session/:sessionId", getPaymentBySessionController);
router.get("/", protect, getMyPaymentsController);
router.get("/debug/:sessionId", async (req, res) => {
  const billing = await Billing.findOne({
    stripeSessionId: req.params.sessionId,
  });

  res.json(billing);
});
export default router;
