import mongoose from "mongoose";

const slotHoldSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
      trim: true,
    },
    stylistName: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },
    status: {
      type: String,
      enum: ["active", "expired", "released", "converted"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

slotHoldSchema.index(
  { stylistName: 1, date: 1, time: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "active" },
  },
);

const SlotHold =
  mongoose.models.SlotHold || mongoose.model("SlotHold", slotHoldSchema);

export default SlotHold;
