import { createCouponHandler } from "../application/commands/createCoupon.handler.js";
import { updateCouponHandler } from "../application/commands/updateCoupon.handler.js";
import { deleteCouponHandler } from "../application/commands/deleteCoupon.handler.js";
import { getCouponsHandler } from "../application/queries/getCoupons.handler.js";
import { getCouponByCodeHandler } from "../application/queries/getCouponByCode.handler.js";

export const createCoupon = async (req, res) => {
  try {
    const coupon = await createCouponHandler(req.body);
    res.status(201).json(coupon);
  } catch (error) {
    console.error("createCoupon error:", error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to create coupon",
    });
  }
};

export const getCoupons = async (req, res) => {
  try {
    const coupons = await getCouponsHandler();
    res.status(200).json(coupons);
  } catch (error) {
    console.error("getCoupons error:", error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to get coupons",
    });
  }
};

export const getCouponByCode = async (req, res) => {
  try {
    const coupon = await getCouponByCodeHandler(req.params.code);
    res.status(200).json(coupon);
  } catch (error) {
    console.error("getCouponByCode error:", error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to get coupon",
    });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const coupon = await updateCouponHandler(req.params.id, req.body);
    res.status(200).json(coupon);
  } catch (error) {
    console.error("updateCoupon error:", error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to update coupon",
    });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    await deleteCouponHandler(req.params.id);
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("deleteCoupon error:", error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to delete coupon",
    });
  }
};
