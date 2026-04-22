import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    classItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed", "refunded"],
      default: "unpaid",
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
  },
  { timestamps: true },
);

enrollmentSchema.index({ customer: 1, classItem: 1 }, { unique: true });

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
export default Enrollment;
