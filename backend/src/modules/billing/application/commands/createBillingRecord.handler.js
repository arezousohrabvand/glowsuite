import { BillingAggregate } from "../../domain/BillingAggregate.js";
import { billingRepository } from "../../infrastructure/repositories/billing.repository.js";
import { applyCoupon } from "../services/coupon.service.js";

export async function createBillingRecordHandler(data) {
  const subtotal = Number(data.subtotal ?? data.amount ?? 0);

  const pricing = await applyCoupon({
    subtotal,
    couponCode: data.couponCode,
  });

  const aggregate = BillingAggregate.create({
    ...data,
    amount: pricing.total,
    subtotal: pricing.subtotal,
    discountAmount: pricing.discountAmount,
    total: pricing.total,
    couponCode: pricing.couponCode,
  });

  return billingRepository.create(aggregate.toPersistence());
}
