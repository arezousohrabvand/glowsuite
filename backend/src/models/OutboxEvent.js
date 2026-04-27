import mongoose from "mongoose";

const outboxEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "BOOKING_CONFIRMED_EMAIL",
        "BOOKING_CANCELED_EMAIL",
        "CLASS_ENROLLED_EMAIL",
        "BOOKING_REMINDER_EMAIL",
      ],
      required: true,
    },

    recipientEmail: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    payload: {
      type: Object,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "sent", "failed"],
      default: "pending",
    },

    attempts: {
      type: Number,
      default: 0,
    },

    lastError: String,

    scheduledFor: {
      type: Date,
      default: Date.now,
    },

    sentAt: Date,
  },
  { timestamps: true },
);

outboxEventSchema.index({ status: 1, scheduledFor: 1 });

export default mongoose.model("OutboxEvent", outboxEventSchema);
