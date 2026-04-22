import mongoose from "mongoose";

const billingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      default: null,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      default: null,
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    invoiceNumber: {
      type: String,
      default: "",
      trim: true,
    },
    currency: {
      type: String,
      default: "usd",
      trim: true,
    },
    type: {
      type: String,
      enum: ["booking", "class"],
      default: "booking",
    },
    subtotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    taxAmount: {
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
      required: true,
      min: 0,
    },
    amount: {
      type: Number,
      default: 0,
      min: 0,
    },
    couponCode: {
      type: String,
      default: null,
    },
    couponDiscountType: {
      type: String,
      default: null,
    },
    couponDiscountValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    state: {
      type: String,
      default: "TX",
    },
    stripeSessionId: {
      type: String,
      default: null,
    },
    stripePaymentIntentId: {
      type: String,
      default: null,
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
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled", "refunded"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true },
);

billingSchema.index({ user: 1, createdAt: -1 });
billingSchema.index({ booking: 1 });
billingSchema.index({ enrollment: 1 });
billingSchema.index({ stripeSessionId: 1 });
billingSchema.index({ stripePaymentIntentId: 1 });
billingSchema.index({ paymentStatus: 1, status: 1 });

const Billing = mongoose.model("Billing", billingSchema);

export default Billing;
