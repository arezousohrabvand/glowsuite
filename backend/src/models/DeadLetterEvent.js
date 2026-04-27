import mongoose from "mongoose";

const deadLetterEventSchema = new mongoose.Schema(
  {
    originalEventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OutboxEvent",
    },

    type: {
      type: String,
      required: true,
    },

    payload: {
      type: Object,
      required: true,
    },

    attempts: {
      type: Number,
      required: true,
    },

    error: {
      type: String,
      required: true,
    },

    failedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.model("DeadLetterEvent", deadLetterEventSchema);
