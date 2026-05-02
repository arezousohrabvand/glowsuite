import { couponRepository } from "../../infrastructure/repositories/coupon.repository.js";

export async function createCouponHandler(data) {
  if (!data.code) {
    const error = new Error("Coupon code is required");
    error.statusCode = 400;
    throw error;
  }

  if (!data.type || !["percent", "fixed"].includes(data.type)) {
    const error = new Error("Coupon type must be percent or fixed");
    error.statusCode = 400;
    throw error;
  }

  if (Number(data.value) <= 0) {
    const error = new Error("Coupon value must be greater than zero");
    error.statusCode = 400;
    throw error;
  }

  const existing = await couponRepository.findByCode(data.code);

  if (existing) {
    const error = new Error("Coupon already exists");
    error.statusCode = 400;
    throw error;
  }

  return couponRepository.create(data);
}
