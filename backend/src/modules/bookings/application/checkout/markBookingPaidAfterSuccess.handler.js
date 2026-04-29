import { bookingRepository } from "../../infrastructure/repositories/booking.repository.js";
import { billingRepository } from "../../infrastructure/repositories/billing.repository.js";
import { slotHoldRepository } from "../../infrastructure/repositories/slotHold.repository.js";
import { stripeCheckoutService } from "../services/stripeCheckout.service.js";

export const markBookingPaidAfterSuccessHandler = async ({ sessionId }) => {
  const billing = await billingRepository.findByStripeSessionId(sessionId);

  if (!billing) {
    const error = new Error("Billing record not found");
    error.statusCode = 404;
    throw error;
  }

  if (billing.paymentStatus !== "paid") {
    let paymentIntentId = billing.stripePaymentIntentId;

    if (!paymentIntentId) {
      const session = await stripeCheckoutService.retrieveSession(sessionId);
      paymentIntentId = session.payment_intent || "";
    }

    await billingRepository.markPaid(billing, paymentIntentId);
  }

  if (billing.booking) {
    const booking = await bookingRepository.updateById(billing.booking, {
      status: "Pending",
      paymentStatus: "paid",
      paidAt: new Date(),
    });

    if (booking) {
      await slotHoldRepository.convertActiveHold({
        userId: booking.user._id || booking.user,
        stylistName: booking.stylistName,
        date: booking.date,
        time: booking.time,
      });
    }
  }

  return {
    message: "Booking payment marked as paid",
  };
};