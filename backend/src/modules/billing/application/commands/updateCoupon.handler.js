import { couponRepository } from "../../infrastructure/repositories/coupon.repository.js";

export async function updateCouponHandler(id, data) {
  const coupon = await couponRepository.update(id, data);

  if (!coupon) {
    const error = new Error("Coupon not found");
    error.statusCode = 404;
    throw error;
  }

  return coupon;
}
