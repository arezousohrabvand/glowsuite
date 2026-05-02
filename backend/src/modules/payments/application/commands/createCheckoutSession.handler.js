import Stripe from "stripe";
import Billing from "../../../../models/Billing.js";
import mongoose from "mongoose";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export async function createCheckoutSessionHandler(data) {
  const {
    userId,
    type, // "booking" | "class"
    bookingId,
    enrollmentId,
    amount,
    currency = "usd",
    successUrl,
    cancelUrl,
  } = data;

  // 🧠 1. Validate
  if (!userId || !amount) {
    throw new Error("Missing required fields");
  }
  if (!stripe) {
    throw new Error("Stripe is not configured");
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid userId");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",

    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            name: type === "booking" ? "Salon Booking" : "Class Enrollment",
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],

    metadata: {
      userId,
      bookingId: bookingId || "",
      enrollmentId: enrollmentId || "",
      type,
    },

    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&type=${type}`,
    cancel_url: cancelUrl,
  });

  const billing = await Billing.create({
    user: userId,
    booking: bookingId || null,
    enrollment: enrollmentId || null,

    amount,
    total: amount, // ✅ ADD THIS LINE

    currency,

    status: "pending",
    paymentStatus: "pending",

    stripeSessionId: session.id,
  });
  return {
    sessionId: session.id,
    url: session.url,
    billingId: billing._id,
  };
}
