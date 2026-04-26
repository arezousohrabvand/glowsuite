import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  getMyBillingHistory,
  getAllBilling,
  refundBilling,
} from "../controllers/billingController.js";

const router = express.Router();

router.get("/test-billing", (req, res) => {
  res.json({ message: "billing routes working" });
});

router.get("/my-history", protect, getMyBillingHistory);

router.get("/admin/all", protect, adminOnly, getAllBilling);

router.post("/admin/:billingId/refund", protect, adminOnly, refundBilling);

export default router;
