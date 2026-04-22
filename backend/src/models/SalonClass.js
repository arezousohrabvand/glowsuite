import mongoose from "mongoose";

const salonClassSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    instructor: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    capacity: {
      type: Number,
      default: 20,
    },
  },
  {
    timestamps: true,
  },
);

const SalonClass =
  mongoose.models.SalonClass || mongoose.model("SalonClass", salonClassSchema);

export default SalonClass;
