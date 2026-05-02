import express from "express";
import { protect, adminOnly } from "../../../shared/middleware/authMiddleware.js";
import {
  createBillingRecord,
  getMyBillingHistory,
  getAllBilling,
  refundBilling,
} from "./billing.controller.js";
import { getInvoiceByBillingId } from "./invoice.controller.js";
import {
  validateCreateBillingRecord,
  validateRefundBilling,
} from "../contracts/billing.schema.js";

const router = express.Router();

router.get("/test-billing", (req, res) => {
  res.json({ message: "billing routes working" });
});

router.post("/", protect, adminOnly, validateCreateBillingRecord, createBillingRecord);

router.get("/my-history", protect, getMyBillingHistory);

router.get("/admin/all", protect, adminOnly, getAllBilling);

router.get("/:billingId/invoice", protect, getInvoiceByBillingId);

router.post(
  "/admin/:billingId/refund",
  protect,
  adminOnly,
  validateRefundBilling,
  refundBilling,
);

export default router;
