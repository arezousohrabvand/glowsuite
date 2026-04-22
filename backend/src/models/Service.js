import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 60,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Service =
  mongoose.models.Service || mongoose.model("Service", serviceSchema);

export default Service;
