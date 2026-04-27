import mongoose from "mongoose";

const outboxEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "BOOKING_CONFIRMED_EMAIL",
        "BOOKING_CANCELLED_EMAIL",
        "CLASS_ENROLLMENT_EMAIL",
        "BOOKING_REMINDER_EMAIL",
      ],
    },

    payload: {
      type: Object,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "processed", "failed"],
      default: "pending",
    },

    attempts: {
      type: Number,
      default: 0,
    },

    maxAttempts: {
      type: Number,
      default: 5,
    },

    lastError: {
      type: String,
      default: null,
    },
    provider: String,
    providerMessageId: String,
    sentAt: Date,

    processedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

outboxEventSchema.index({ status: 1, createdAt: 1 });

export default mongoose.model("OutboxEvent", outboxEventSchema);
