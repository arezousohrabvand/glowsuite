import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      default: null,
      index: true,
    },

    serviceName: {
      type: String,
      required: true,
      trim: true,
    },

    stylist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    stylistName: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: String,
      required: true,
      trim: true,
    },

    time: {
      type: String,
      required: true,
      trim: true,
    },

    slotStart: {
      type: Date,
      required: true,
      index: true,
    },

    slotEnd: {
      type: Date,
      required: true,
      index: true,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    stylistNotes: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Pending", "Upcoming", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
      index: true,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    stripeSessionId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },

    holdId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

bookingSchema.index(
  { stylist: 1, slotStart: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ["Pending", "Upcoming", "Confirmed"] },
    },
  },
);

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ stylist: 1, date: 1 });
bookingSchema.index({ status: 1, paymentStatus: 1 });
bookingSchema.index({ stylist: 1, slotStart: 1, slotEnd: 1 });
bookingSchema.index({ stylist: 1, status: 1, slotStart: 1 });
bookingSchema.index({ stylist: 1, paymentStatus: 1, slotStart: 1 });
bookingSchema.index({ user: 1, slotStart: -1 });
bookingSchema.index({ slotStart: 1, slotEnd: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
