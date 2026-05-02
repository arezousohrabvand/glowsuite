import Billing from "../../../../models/Billing.js";
import Booking from "../../../../models/Booking.js";
import Enrollment from "../../../../models/Enrollment.js";

import { PaymentAggregate } from "../../domain/payment.aggregate.js";

export async function verifyPaymentHandler(sessionId) {
  const billing = await Billing.findOne({
    stripeSessionId: sessionId,
  });

  if (!billing) {
    throw new Error("Payment not found");
  }

  const booking = billing.booking ? await Booking.findById(billing.booking) : null;

  const enrollment = billing.enrollment
    ? await Enrollment.findById(billing.enrollment)
    : null;

  const aggregate = new PaymentAggregate({
    billing,
    booking,
    enrollment,
  });

  // ✅ Idempotency
  if (aggregate.isAlreadyPaid()) {
    return {
      message: "Already verified",
      billing,
    };
  }

  aggregate.markAsPaid();

  await billing.save();
  if (booking) await booking.save();
  if (enrollment) await enrollment.save();

  return {
    message: "Payment verified",
    billing,
  };
}
