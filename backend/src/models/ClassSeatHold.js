import mongoose from "mongoose";

const classSeatHoldSchema = new mongoose.Schema(
  {
    user: {
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
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "released", "expired", "converted"],
      default: "active",
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

classSeatHoldSchema.index(
  { user: 1, classItem: 1, status: 1 },
  {
    partialFilterExpression: { status: "active" },
  },
);

const ClassSeatHold = mongoose.model("ClassSeatHold", classSeatHoldSchema);

export default ClassSeatHold;
