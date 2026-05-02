import Billing from "../../../../models/Billing.js";

export async function getPaymentBySessionHandler(sessionId) {
  const billing = await Billing.findOne({
    stripeSessionId: sessionId,
  })
    .populate("booking")
    .populate("enrollment");

  if (!billing) {
    throw new Error("Payment not found");
  }

  return billing;
}
