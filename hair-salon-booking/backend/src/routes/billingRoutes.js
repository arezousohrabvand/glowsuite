import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMyBillingHistory,
  getAllBilling,
} from "../controllers/billingController.js";

const router = express.Router();

router.get("/test-billing", (req, res) => {
  res.json({ message: "billing routes working" });
});

router.get("/my-history", protect, getMyBillingHistory);
router.get("/admin/all", protect, getAllBilling);

export default router;
