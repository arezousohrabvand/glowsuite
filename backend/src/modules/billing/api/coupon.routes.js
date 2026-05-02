import express from "express";
import { protect, adminOnly } from "../../../shared/middleware/authMiddleware.js";
import {
  createCoupon,
  getCoupons,
  getCouponByCode,
  updateCoupon,
  deleteCoupon,
} from "./coupon.controller.js";

const router = express.Router();

router.post("/", protect, adminOnly, createCoupon);

router.get("/", protect, adminOnly, getCoupons);

router.get("/code/:code", protect, getCouponByCode);

router.put("/:id", protect, adminOnly, updateCoupon);

router.delete("/:id", protect, adminOnly, deleteCoupon);

export default router;
