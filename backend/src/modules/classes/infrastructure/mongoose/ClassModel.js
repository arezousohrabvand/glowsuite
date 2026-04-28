import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    category: {
      type: String,
      default: "Workshop",
      trim: true,
      index: true, // filter
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

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    time: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    capacity: {
      type: Number,
      required: true,
      default: 10,
      min: 1,
    },

    enrolledCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["active", "cancelled", "completed"],
      default: "active",
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    duration: {
      type: String,
      default: "",
    },

    level: {
      type: String,
      default: "Beginner",
    },

    tags: {
      type: [String],
      default: [],
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

classSchema.index({ isActive: 1, date: 1 });

classSchema.index({ instructor: 1, date: 1 });

classSchema.index({ createdAt: -1 });

classSchema.index({ _id: 1, capacity: 1, enrolledCount: 1 });

classSchema.virtual("availableSeats").get(function () {
  return Math.max(this.capacity - this.enrolledCount, 0);
});

//
//  SAFETY
//
classSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.models.Class || mongoose.model("Class", classSchema);
