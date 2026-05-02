import { couponRepository } from "../../infrastructure/repositories/coupon.repository.js";

export async function getCouponsHandler() {
  return couponRepository.findAll();
}
