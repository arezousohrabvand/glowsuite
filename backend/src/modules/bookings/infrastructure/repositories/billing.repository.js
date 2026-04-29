import Billing from "../../../../models/Billing.js";

export const billingRepository = {
  create(data) {
    return Billing.create(data);
  },

  findByStripeSessionId(sessionId) {
    return Billing.findOne({ stripeSessionId: sessionId });
  },

  async markPaid(billing, paymentIntentId) {
    billing.status = "paid";
    billing.paymentStatus = "paid";

    if (paymentIntentId) {
      billing.stripePaymentIntentId = paymentIntentId;
    }

    return billing.save();
  },
};
