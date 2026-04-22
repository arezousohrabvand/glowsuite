import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["percent", "fixed"],
      required: true,
    },

    value: {
      type: Number,
      required: true,
      min: 0,
    },

    active: {
      type: Boolean,
      default: true,
    },

    startsAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    usageLimit: {
      type: Number,
      default: null,
      min: 1,
    },

    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    minAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    applicableTo: {
      type: [String],
      enum: ["booking", "class", "all"],
      default: ["all"],
    },

    stateWhitelist: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Coupon", couponSchema);
