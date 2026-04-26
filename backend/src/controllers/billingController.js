import Stripe from "stripe";
import Billing from "../models/Billing.js";
import Booking from "../models/Booking.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* =========================
   USER BILLING HISTORY
========================= */

export const getMyBillingHistory = async (req, res) => {
  try {
    const history = await Billing.find({ user: req.user._id })
      .populate("booking")
      .populate("service")
      .sort({ createdAt: -1 });

    res.status(200).json(history);
  } catch (error) {
    console.error("getMyBillingHistory error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ADMIN ALL BILLING
========================= */

export const getAllBilling = async (req, res) => {
  try {
    const history = await Billing.find()
      .populate("user", "firstName lastName email role")
      .populate("booking")
      .populate("service")
      .sort({ createdAt: -1 });

    res.status(200).json(history);
  } catch (error) {
    console.error("getAllBilling error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ADMIN REFUND WITH STRIPE
========================= */

export const refundBilling = async (req, res) => {
  try {
    console.log("✅ REFUND API HIT:", req.params, req.body);

    const { billingId } = req.params;
    const { refundAmount, reason } = req.body;

    const billing = await Billing.findById(billingId);

    if (!billing) {
      return res.status(404).json({
        message: "Billing record not found",
      });
    }

    if (billing.paymentStatus === "refunded") {
      return res.status(400).json({
        message: "This payment is already refunded",
      });
    }

    if (!billing.stripePaymentIntentId) {
      return res.status(400).json({
        message: "Stripe payment intent is missing. Cannot refund.",
      });
    }

    const amountToRefund = refundAmount
      ? Math.round(Number(refundAmount) * 100)
      : undefined;

    const refund = await stripe.refunds.create({
      payment_intent: billing.stripePaymentIntentId,
      ...(amountToRefund ? { amount: amountToRefund } : {}),
      metadata: {
        billingId: billing._id.toString(),
        bookingId: billing.booking?.toString() || "",
        reason: reason || "Admin refund",
      },
    });

    billing.status = "refunded";
    billing.paymentStatus = "refunded";
    billing.refundAmount = refundAmount
      ? Number(refundAmount)
      : Number(billing.total || billing.amount || 0);
    billing.stripeRefundId = refund.id;
    billing.refundReason = reason || "Admin refund";

    await billing.save();

    if (billing.booking) {
      await Booking.findByIdAndUpdate(
        billing.booking,
        {
          $set: {
            status: "Cancelled",
            paymentStatus: "refunded",
          },
        },
        {
          runValidators: false,
        },
      );
    }

    return res.status(200).json({
      message: "Refund completed successfully",
      billing,
      refundId: refund.id,
    });
  } catch (error) {
    console.error("refundBilling error:", error);
    return res.status(500).json({
      message: error.message || "Failed to refund payment",
    });
  }
};
