import express from "express";
import { stripeWebhookController } from "./stripe.controller.js";

const router = express.Router();

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookController,
);

export default router;
