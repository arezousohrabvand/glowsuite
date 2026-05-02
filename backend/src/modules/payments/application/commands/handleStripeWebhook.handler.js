import Stripe from "stripe";

import Billing from "../../../../models/Billing.js";
import Booking from "../../../../models/Booking.js";
import Enrollment from "../../../../models/Enrollment.js";

import { PaymentAggregate } from "../../domain/payment.aggregate.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function handleStripeWebhookHandler({ rawBody, signature }) {
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    const err = new Error(`Webhook Error: ${error.message}`);
    err.statusCode = 400;
    throw err;
  }

  console.log("Webhook received:", event.type);

  if (event.type === "checkout.session.completed") {
    await handleCheckoutSessionCompleted(event.data.object);
  }

  if (event.type === "payment_intent.payment_failed") {
    await handlePaymentIntentFailed(event.data.object);
  }

  return { received: true };
}

// ==========================
// ✅ SUCCESS FLOW
// ==========================

async function handleCheckoutSessionCompleted(session) {
  const billing = await Billing.findOne({
    stripeSessionId: session.id,
  });

  if (!billing) {
    console.error("🚨 Billing not found for session:", session.id);
    return;
  }

  // ✅ Load related entities
  const booking = billing.booking ? await Booking.findById(billing.booking) : null;

  const enrollment = billing.enrollment
    ? await Enrollment.findById(billing.enrollment)
    : null;

  // ✅ Create Aggregate
  const aggregate = new PaymentAggregate({
    billing,
    booking,
    enrollment,
  });

  // ✅ Idempotency (VERY IMPORTANT)
  if (aggregate.isAlreadyPaid()) {
    console.log("Already processed:", session.id);
    return;
  }

  // ✅ Apply business logic
  aggregate.markAsPaid(session.payment_intent);

  // ✅ Save all changes
  await billing.save();

  if (booking) {
    await booking.save();
  }

  if (enrollment) {
    await enrollment.save();
  }

  console.log("✅ Payment processed via aggregate:", billing._id);
}

// ==========================
// ❌ FAILURE FLOW
// ==========================

async function handlePaymentIntentFailed(paymentIntent) {
  const billing = await Billing.findOne({
    stripePaymentIntentId: paymentIntent.id,
  });

  if (!billing) {
    console.error("🚨 Billing not found for failed payment:", paymentIntent.id);
    return;
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

  aggregate.markAsFailed();

  await billing.save();

  if (booking) {
    await booking.save();
  }

  if (enrollment) {
    await enrollment.save();
  }

  console.log("❌ Payment failed handled:", billing._id);
}
