import Payment from "../mongoose/PaymentModel.js";

export const paymentRepository = {
  create(data) {
    return Payment.create(data);
  },

  findById(id) {
    return Payment.findById(id);
  },

  findByStripeSessionId(stripeSessionId) {
    return Payment.findOne({ stripeSessionId });
  },

  findByStripePaymentIntentId(stripePaymentIntentId) {
    return Payment.findOne({ stripePaymentIntentId });
  },

  markPaidBySessionId(stripeSessionId, data = {}) {
    return Payment.findOneAndUpdate(
      { stripeSessionId },
      {
        $set: {
          status: "paid",
          stripePaymentIntentId: data.stripePaymentIntentId || null,
        },
      },
      { new: true },
    );
  },

  markFailedByPaymentIntentId(stripePaymentIntentId) {
    return Payment.findOneAndUpdate(
      { stripePaymentIntentId },
      {
        $set: {
          status: "failed",
        },
      },
      { new: true },
    );
  },
};
