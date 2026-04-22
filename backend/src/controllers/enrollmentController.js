import mongoose from "mongoose";
import Stripe from "stripe";
import Enrollment from "../models/Enrollment.js";
import ClassModel from "../models/Class.js";
import Billing from "../models/Billing.js";
import ClassSeatHold from "../models/ClassSeatHold.js";
import { emitClassSeatUpdate } from "../socket.js";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing in .env");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const DEFAULT_TAX_RATE = 0.0825;
const HOLD_MINUTES = 10;

function buildSuccessUrl() {
  return `${
    process.env.CLIENT_URL || "http://localhost:5173"
  }/payment-success?type=enrollment&session_id={CHECKOUT_SESSION_ID}`;
}

function buildCancelUrl() {
  return `${process.env.CLIENT_URL || "http://localhost:5173"}/classes`;
}

function calculateCheckoutAmounts({ subtotal, couponCode = "", state = "TX" }) {
  const normalizedSubtotal = Number(subtotal || 0);

  let discountAmount = 0;
  if (couponCode === "SAVE10") {
    discountAmount = normalizedSubtotal * 0.1;
  }

  const taxRate = state === "TX" ? DEFAULT_TAX_RATE : 0;
  const taxableAmount = Math.max(normalizedSubtotal - discountAmount, 0);
  const taxAmount = taxableAmount * taxRate;
  const total = taxableAmount + taxAmount;

  return {
    subtotal: normalizedSubtotal,
    discountAmount,
    taxRate,
    taxAmount,
    total,
  };
}

async function getLiveSeatState(classId) {
  const classItem = await ClassModel.findById(classId);
  if (!classItem) return null;

  const activeHolds = await ClassSeatHold.countDocuments({
    classItem: classId,
    status: "active",
    expiresAt: { $gt: new Date() },
  });

  const capacity = Number(classItem.capacity || 0);
  const enrolledCount = Number(classItem.enrolledCount || 0);
  const seatsLeft = Math.max(capacity - enrolledCount - activeHolds, 0);

  return {
    classId: String(classItem._id),
    capacity,
    enrolledCount,
    activeHolds,
    seatsLeft,
  };
}

// POST /api/enrollments
export const enrollInClass = async (req, res) => {
  try {
    const { classId } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!classId) {
      return res.status(400).json({ message: "Class ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({ message: "Invalid class ID" });
    }

    const classItem = await ClassModel.findById(classId);

    if (!classItem) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (classItem.isActive === false) {
      return res.status(400).json({ message: "Class is not active" });
    }

    const activeHolds = await ClassSeatHold.countDocuments({
      classItem: classId,
      status: "active",
      expiresAt: { $gt: new Date() },
    });

    const totalReserved = (classItem.enrolledCount || 0) + activeHolds;

    if (totalReserved >= (classItem.capacity || 0)) {
      return res.status(400).json({ message: "Class is full" });
    }

    const existing = await Enrollment.findOne({
      customer: req.user._id,
      classItem: classId,
    }).populate("classItem");

    if (existing) {
      return res.status(200).json({
        message: "Already enrolled in this class",
        enrollment: existing,
        alreadyEnrolled: true,
      });
    }

    const price = Number(classItem.price || 0);
    const title = classItem.title || "Class Enrollment";

    const enrollment = await Enrollment.create({
      customer: req.user._id,
      classItem: classItem._id,
      amount: price,
      status: price > 0 ? "pending" : "paid",
      paymentStatus: price > 0 ? "unpaid" : "paid",
    });

    if (price === 0) {
      const updatedClass = await ClassModel.findOneAndUpdate(
        {
          _id: classItem._id,
          $expr: { $lt: ["$enrolledCount", "$capacity"] },
        },
        {
          $inc: { enrolledCount: 1 },
        },
        {
          returnDocument: "after",
        },
      );

      await Billing.create({
        user: req.user._id,
        type: "class",
        enrollment: enrollment._id,
        title,
        description: `Free class enrollment for ${title}`,
        amount: 0,
        subtotal: 0,
        taxAmount: 0,
        discountAmount: 0,
        total: 0,
        currency: "usd",
        state: "TX",
        status: "paid",
        paymentStatus: "paid",
        stripeSessionId: "",
        stripePaymentIntentId: "",
        refundAmount: 0,
        stripeRefundId: "",
      });

      const liveState = await getLiveSeatState(classItem._id);
      if (liveState) emitClassSeatUpdate(classItem._id, liveState);

      const populatedEnrollment = await Enrollment.findById(
        enrollment._id,
      ).populate("classItem");

      return res.status(201).json({
        message: "Enrolled successfully",
        enrollment: populatedEnrollment,
        updatedClass,
      });
    }

    const hold = await ClassSeatHold.create({
      user: req.user._id,
      classItem: classItem._id,
      enrollment: enrollment._id,
      expiresAt: new Date(Date.now() + HOLD_MINUTES * 60 * 1000),
      status: "active",
    });

    const liveState = await getLiveSeatState(classItem._id);
    if (liveState) emitClassSeatUpdate(classItem._id, liveState);

    const populatedEnrollment = await Enrollment.findById(
      enrollment._id,
    ).populate("classItem");

    return res.status(201).json({
      message: "Enrollment created. Proceed to payment.",
      enrollment: populatedEnrollment,
      alreadyEnrolled: false,
      holdId: hold._id,
      holdExpiresAt: hold.expiresAt,
    });
  } catch (error) {
    console.error("Enroll error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Enrollment failed" });
  }
};

export const getMyEnrollments = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const enrollments = await Enrollment.find({ customer: req.user._id })
      .populate("classItem")
      .sort({ createdAt: -1 });

    return res.json(enrollments);
  } catch (error) {
    console.error("Get enrollments error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const previewEnrollmentCheckout = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { couponCode = "", state = "TX" } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const enrollment =
      await Enrollment.findById(enrollmentId).populate("classItem");

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    if (String(enrollment.customer) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const classItem = enrollment.classItem;

    if (!classItem) {
      return res.status(404).json({ message: "Class not found" });
    }

    const { subtotal, discountAmount, taxRate, taxAmount, total } =
      calculateCheckoutAmounts({
        subtotal: classItem.price || enrollment.amount || 0,
        couponCode,
        state,
      });

    const liveState = await getLiveSeatState(classItem._id);

    return res.json({
      title: classItem.title || "Class Enrollment",
      type: "class",
      subtotal,
      discountAmount,
      taxAmount,
      taxRate,
      total,
      taxState: state,
      couponCode,
      seatState: liveState,
    });
  } catch (error) {
    console.error("Preview enrollment checkout error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const createEnrollmentCheckout = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { couponCode = "", state = "TX" } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const enrollment =
      await Enrollment.findById(enrollmentId).populate("classItem");

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    if (String(enrollment.customer) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const classItem = enrollment.classItem;

    if (!classItem) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (enrollment.paymentStatus === "paid") {
      return res
        .status(400)
        .json({ message: "This enrollment is already paid" });
    }

    const hold = await ClassSeatHold.findOne({
      enrollment: enrollment._id,
      user: req.user._id,
      status: "active",
      expiresAt: { $gt: new Date() },
    });

    if (!hold) {
      return res.status(409).json({
        message: "Seat hold expired. Please enroll again.",
      });
    }

    const { subtotal, discountAmount, taxRate, taxAmount, total } =
      calculateCheckoutAmounts({
        subtotal: classItem.price || enrollment.amount || 0,
        couponCode,
        state,
      });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: req.user.email ?? undefined,
      success_url: buildSuccessUrl(),
      cancel_url: buildCancelUrl(),
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: classItem.title || "Class Enrollment",
            },
            unit_amount: Math.round(total * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "class",
        userId: String(req.user._id),
        enrollmentId: String(enrollment._id),
        classId: String(classItem._id),
        holdId: String(hold._id),
        title: classItem.title || "Class Enrollment",
        state,
        couponCode,
        subtotal: String(subtotal),
        discountAmount: String(discountAmount),
        taxRate: String(taxRate),
        taxAmount: String(taxAmount),
        total: String(total),
      },
    });

    await Billing.findOneAndUpdate(
      {
        enrollment: enrollment._id,
        paymentStatus: { $ne: "paid" },
      },
      {
        user: req.user._id,
        type: "class",
        enrollment: enrollment._id,
        title: classItem.title || "Class Enrollment",
        description: `Class payment for ${classItem.title || "Class Enrollment"}`,
        amount: total,
        subtotal,
        taxAmount,
        discountAmount,
        total,
        couponCode: couponCode || null,
        couponDiscountType: couponCode ? "percentage" : null,
        couponDiscountValue: couponCode === "SAVE10" ? 10 : 0,
        state,
        currency: "usd",
        status: "pending",
        paymentStatus: "pending",
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent || "",
        refundAmount: 0,
        stripeRefundId: "",
      },
      {
        returnDocument: "after",
        upsert: true,
      },
    );

    return res.status(200).json({
      url: session.url,
      sessionId: session.id,
      holdExpiresAt: hold.expiresAt,
    });
  } catch (error) {
    console.error("Create enrollment checkout error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const markEnrollmentPaidAfterSuccess = async (req, res) => {
  try {
    const sessionId = req.query.sessionId || req.query.session_id;

    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Stripe session not found" });
    }

    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const enrollmentId = session.metadata?.enrollmentId;
    const holdId = session.metadata?.holdId;

    if (!enrollmentId) {
      return res.status(400).json({ message: "Enrollment ID missing" });
    }

    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    if (String(enrollment.customer) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (enrollment.paymentStatus !== "paid") {
      enrollment.paymentStatus = "paid";
      enrollment.status = "paid";
      enrollment.stripeSessionId = session.id;
      await enrollment.save();

      const updatedClass = await ClassModel.findOneAndUpdate(
        {
          _id: enrollment.classItem,
          $expr: { $lt: ["$enrolledCount", "$capacity"] },
        },
        {
          $inc: { enrolledCount: 1 },
        },
        {
          returnDocument: "after",
        },
      );

      if (holdId) {
        await ClassSeatHold.findByIdAndUpdate(
          holdId,
          {
            $set: { status: "converted" },
          },
          { returnDocument: "after" },
        );
      }

      await Billing.findOneAndUpdate(
        { stripeSessionId: session.id },
        {
          status: "paid",
          paymentStatus: "paid",
          stripePaymentIntentId: session.payment_intent || "",
        },
        { returnDocument: "after" },
      );

      const liveState = await getLiveSeatState(enrollment.classItem);
      if (liveState) emitClassSeatUpdate(enrollment.classItem, liveState);

      const populatedEnrollment =
        await Enrollment.findById(enrollmentId).populate("classItem");

      return res.json({
        message: "Enrollment payment confirmed",
        enrollment: populatedEnrollment,
        updatedClass,
      });
    }

    const populatedEnrollment =
      await Enrollment.findById(enrollmentId).populate("classItem");

    return res.json({
      message: "Enrollment already marked as paid",
      enrollment: populatedEnrollment,
    });
  } catch (error) {
    console.error("Payment success error:", error);
    return res.status(500).json({ message: error.message });
  }
};
