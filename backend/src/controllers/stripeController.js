import Stripe from "stripe";
import Billing from "../models/Billing.js";
import Enrollment from "../models/Enrollment.js";
import ClassModel from "../models/Class.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const TAX_RATE = 0.0825;
const TAX_STATE = "TX";

export const getStripePreview = async (req, res) => {
  try {
    const { enrollmentId, couponCode = "" } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    const cls = await ClassModel.findById(enrollment.classItem);
    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }

    const subtotal = Number(cls.price || enrollment.amount || 0);

    let discountAmount = 0;
    if (couponCode === "SAVE10") {
      discountAmount = subtotal * 0.1;
    }

    const taxableAmount = Math.max(subtotal - discountAmount, 0);
    const taxAmount = taxableAmount * TAX_RATE;
    const total = taxableAmount + taxAmount;

    res.json({
      title: cls.title || "Class Payment",
      type: "class",
      subtotal,
      discountAmount,
      taxAmount,
      taxRate: TAX_RATE,
      total,
      taxState: TAX_STATE,
      couponCode,
    });
  } catch (error) {
    console.error("getStripePreview error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const createStripeCheckout = async (req, res) => {
  try {
    const { enrollmentId, couponCode = "" } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    const cls = await ClassModel.findById(enrollment.classItem);
    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }

    const subtotal = Number(cls.price || enrollment.amount || 0);

    let discountAmount = 0;
    if (couponCode === "SAVE10") {
      discountAmount = subtotal * 0.1;
    }

    const taxableAmount = Math.max(subtotal - discountAmount, 0);
    const taxAmount = taxableAmount * TAX_RATE;
    const total = taxableAmount + taxAmount;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: req.user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: cls.title || "GlowSuite Class Payment",
            },
            unit_amount: Math.round(total * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        enrollmentId: String(enrollment._id),
        userId: String(req.user._id),
        classId: String(cls._id),
        title: cls.title || "Class Payment",
        type: "class",
        state: TAX_STATE,
        couponCode,
      },
      success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/payment-cancel`,
    });

    await Billing.findOneAndUpdate(
      {
        enrollment: enrollment._id,
        paymentStatus: { $ne: "paid" },
      },
      {
        user: req.user._id,
        enrollment: enrollment._id,
        title: cls.title || "Class Payment",
        type: "class",
        subtotal,
        taxAmount,
        discountAmount,
        total,
        amount: total,
        couponCode: couponCode || null,
        stripeSessionId: session.id,
        status: "pending",
        paymentStatus: "pending",
        state: TAX_STATE,
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );

    res.status(200).json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("createStripeCheckout error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const verifyStripeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ message: "Missing session ID" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const billing = await Billing.findOne({
      stripeSessionId: sessionId,
    });

    if (billing && billing.paymentStatus !== "paid") {
      billing.status = "paid";
      billing.paymentStatus = "paid";
      billing.stripePaymentIntentId = session.payment_intent || "";
      await billing.save();
    }

    res.json({
      id: session.id,
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total / 100,
      metadata: session.metadata,
    });
  } catch (error) {
    console.error("verifyStripeSession error:", error);
    res.status(500).json({ message: error.message });
  }
};
