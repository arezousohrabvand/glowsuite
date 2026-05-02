import mongoose from "mongoose";
import {
  ENROLLMENT_STATUS,
  ENROLLMENT_PAYMENT_STATUS,
} from "../../domain/enrollmentStatus.js";

const enrollmentSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    classItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(ENROLLMENT_STATUS),
      default: ENROLLMENT_STATUS.PENDING,
    },

    paymentStatus: {
      type: String,
      enum: Object.values(ENROLLMENT_PAYMENT_STATUS),
      default: ENROLLMENT_PAYMENT_STATUS.UNPAID,
    },

    amount: {
      type: Number,
      required: true,
      default: 0,
    },

    stripeSessionId: {
      type: String,
      default: "",
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const Enrollment =
  mongoose.models.Enrollment || mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;
