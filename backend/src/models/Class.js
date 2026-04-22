import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "Workshop",
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    instructorName: {
      type: String,
      default: "",
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    date: {
      type: String,
      default: "",
    },
    time: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },

    // added fields for seat tracking
    capacity: {
      type: Number,
      required: true,
      default: 10,
      min: 0,
    },
    enrolledCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // optional status field because your controller checks isActive
    isActive: {
      type: Boolean,
      default: true,
    },

    // optional extra field because ClassDetails uses duration
    duration: {
      type: String,
      default: "",
    },

    // optional extra fields because ClassDetails checks them
    level: {
      type: String,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Class", classSchema);
