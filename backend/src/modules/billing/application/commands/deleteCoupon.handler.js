import { couponRepository } from "../../infrastructure/repositories/coupon.repository.js";

export async function deleteCouponHandler(id) {
  const coupon = await couponRepository.delete(id);

  if (!coupon) {
    const error = new Error("Coupon not found");
    error.statusCode = 404;
    throw error;
  }

  return coupon;
}
