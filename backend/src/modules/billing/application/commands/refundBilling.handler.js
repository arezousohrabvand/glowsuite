import Stripe from "stripe";
import Booking from "../../../../models/Booking.js";
import { BillingAggregate } from "../../domain/BillingAggregate.js";
import { billingRepository } from "../../infrastructure/repositories/billing.repository.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function refundBillingHandler({ billingId, refundAmount, reason }) {
  const billing = await billingRepository.findById(billingId);

  if (!billing) {
    const error = new Error("Billing record not found");
    error.statusCode = 404;
    throw error;
  }

  if (!billing.stripePaymentIntentId) {
    const error = new Error("Stripe payment intent is missing. Cannot refund.");
    error.statusCode = 400;
    throw error;
  }

  const amountToRefund = refundAmount
    ? Math.round(Number(refundAmount) * 100)
    : undefined;

  const refund = await stripe.refunds.create({
    payment_intent: billing.stripePaymentIntentId,
    ...(amountToRefund ? { amount: amountToRefund } : {}),
    metadata: {
      billingId: billing._id.toString(),
      bookingId: billing.booking?.toString() || "",
      reason: reason || "Admin refund",
    },
  });

  const aggregate = BillingAggregate.create(billing.toObject());

  aggregate.refund({
    refundAmount,
    stripeRefundId: refund.id,
    reason,
  });

  Object.assign(billing, aggregate.toPersistence());

  await billingRepository.save(billing);

  if (billing.booking) {
    await Booking.findByIdAndUpdate(
      billing.booking,
      {
        $set: {
          status: "Cancelled",
          paymentStatus: "refunded",
        },
      },
      { runValidators: false },
    );
  }

  return {
    billing,
    refundId: refund.id,
  };
}
