import { PAYMENT_STATUS } from "../domain/paymentStatus.js";
import { PAYMENT_PROVIDER } from "../domain/paymentProvider.js";

export function mapCreatePaymentToModel(data) {
  return {
    user: data.user,
    booking: data.booking || null,
    enrollment: data.enrollment || null,
    amount: data.amount,
    currency: data.currency || "usd",
    provider: data.provider || PAYMENT_PROVIDER.STRIPE,
    status: data.status || PAYMENT_STATUS.PENDING,
    stripeSessionId: data.stripeSessionId || null,
    stripePaymentIntentId: data.stripePaymentIntentId || null,
    description: data.description || "",
  };
}

export function mapStripeSessionCompleted(session) {
  return {
    stripeSessionId: session.id,
    stripePaymentIntentId: session.payment_intent || null,
    status: PAYMENT_STATUS.PAID,
  };
}
