import { couponRepository } from "../../infrastructure/repositories/coupon.repository.js";

export async function applyCoupon({ subtotal, couponCode }) {
  const safeSubtotal = Number(subtotal || 0);

  if (!couponCode) {
    return {
      coupon: null,
      couponCode: "",
      subtotal: safeSubtotal,
      discountAmount: 0,
      total: safeSubtotal,
    };
  }

  const coupon = await couponRepository.findByCode(couponCode);

  if (!coupon) {
    const error = new Error("Invalid coupon code");
    error.statusCode = 400;
    throw error;
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    const error = new Error("Coupon has expired");
    error.statusCode = 400;
    throw error;
  }

  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    const error = new Error("Coupon usage limit reached");
    error.statusCode = 400;
    throw error;
  }

  let discountAmount = 0;

  if (coupon.type === "percent") {
    discountAmount = safeSubtotal * (coupon.value / 100);
  }

  if (coupon.type === "fixed") {
    discountAmount = coupon.value;
  }

  discountAmount = Math.min(discountAmount, safeSubtotal);
  discountAmount = Math.round(discountAmount * 100) / 100;

  const total = Math.max(safeSubtotal - discountAmount, 0);

  return {
    coupon,
    couponCode: coupon.code,
    subtotal: safeSubtotal,
    discountAmount,
    total,
  };
}
