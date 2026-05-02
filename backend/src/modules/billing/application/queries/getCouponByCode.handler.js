import { couponRepository } from "../../infrastructure/repositories/coupon.repository.js";

export async function getCouponByCodeHandler(code) {
  if (!code) {
    const error = new Error("Coupon code is required");
    error.statusCode = 400;
    throw error;
  }

  const coupon = await couponRepository.findByCode(code);

  if (!coupon) {
    const error = new Error("Coupon not found");
    error.statusCode = 404;
    throw error;
  }

  return coupon;
}
