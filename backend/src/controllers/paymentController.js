import Stripe from "stripe";
import Billing from "../models/Billing.js";
import Booking from "../models/Booking.js";
import Enrollment from "../models/Enrollment.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhookHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    console.log("Webhook event received:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      console.log("Webhook: checkout.session.completed", session.id);

      const billing = await Billing.findOne({
        stripeSessionId: session.id,
      });

      if (!billing) {
        console.log("No billing found for session:", session.id);
        return res.json({ received: true });
      }

      if (billing.paymentStatus === "paid") {
        console.log("Already processed:", session.id);
        return res.json({ received: true });
      }

      billing.status = "paid";
      billing.paymentStatus = "paid";
      billing.stripePaymentIntentId = session.payment_intent || null;
      await billing.save();

      if (billing.booking) {
        await Booking.findByIdAndUpdate(billing.booking, {
          status: "confirmed",
          paymentStatus: "paid",
        });
      }

      if (billing.enrollment) {
        await Enrollment.findByIdAndUpdate(billing.enrollment, {
          status: "confirmed",
          paymentStatus: "paid",
        });
      }

      console.log("Billing marked paid:", billing._id);
    }

    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;

      console.log("Webhook: payment_intent.payment_failed", paymentIntent.id);

      await Billing.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        {
          status: "failed",
          paymentStatus: "failed",
        },
      );
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ message: error.message });
  }
};
