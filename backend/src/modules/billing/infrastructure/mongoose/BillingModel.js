import mongoose from "mongoose";
import { BILLING_STATUS, PAYMENT_STATUS } from "../../domain/billingStatus.js";
import { BILLING_TYPE } from "../../domain/billingType.js";

const billingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
      index: true,
    },

    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      default: null,
      index: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      default: null,
      index: true,
    },

    type: {
      type: String,
      enum: Object.values(BILLING_TYPE),
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    subtotal: {
      type: Number,
      default: 0,
      min: 0,
    },

    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    total: {
      type: Number,
      default: 0,
      min: 0,
    },

    currency: {
      type: String,
      default: "usd",
      lowercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: Object.values(BILLING_STATUS),
      default: BILLING_STATUS.PENDING,
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.UNPAID,
      index: true,
    },

    couponCode: {
      type: String,
      default: "",
      uppercase: true,
      trim: true,
    },

    stripeSessionId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },

    stripePaymentIntentId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },

    stripeRefundId: {
      type: String,
      default: "",
      trim: true,
    },

    refundAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    refundReason: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

billingSchema.index({ user: 1, createdAt: -1 });
billingSchema.index({ status: 1, paymentStatus: 1 });
billingSchema.index({ type: 1, createdAt: -1 });
billingSchema.index({ stripeSessionId: 1 });
billingSchema.index({ stripePaymentIntentId: 1 });

const Billing = mongoose.models.Billing || mongoose.model("Billing", billingSchema);

export default Billing;
