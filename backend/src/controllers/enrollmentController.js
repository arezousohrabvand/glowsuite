import Stripe from "stripe";
import Enrollment from "../models/Enrollment.js";
import Class from "../models/Class.js";
import Billing from "../models/Billing.js";
import { createOutboxEvent } from "../shared/utils/createOutboxEvent.js";
import {
  calculateBillingBreakdown,
  getValidCoupon,
} from "../shared/utils/billingMath.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function getStudentName(user) {
  return `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Student";
}

function getClassName(classItem) {
  return classItem?.title || classItem?.name || "GlowSuite Class";
}

export const previewEnrollmentCheckout = async (req, res) => {
  try {
    const { classId, couponCode, state } = req.body;

    if (!classId) {
      return res.status(400).json({ message: "classId is required" });
    }

    const classItem = await Class.findById(classId);

    if (!classItem) {
      return res.status(404).json({ message: "Class not found" });
    }

    const subtotal = Number(classItem.price || 0);

    const coupon = await getValidCoupon({
      couponCode,
      type: "class",
      subtotal,
      state: state || "TX",
    });

    const breakdown = calculateBillingBreakdown({
      subtotal,
      state: state || "TX",
      coupon,
    });

    return res.status(200).json({
      classId: classItem._id,
      className: getClassName(classItem),
      breakdown,
    });
  } catch (error) {
    console.error("previewEnrollmentCheckout error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const createEnrollmentCheckout = async (req, res) => {
  try {
    const { classId, couponCode, state } = req.body;

    if (!classId) {
      return res.status(400).json({ message: "classId is required" });
    }

    const classItem = await Class.findById(classId);

    if (!classItem) {
      return res.status(404).json({ message: "Class not found" });
    }

    const existingEnrollment = await Enrollment.findOne({
      customer: req.user._id,
      classItem: classItem._id,
      status: { $in: ["pending", "paid"] },
    });

    if (existingEnrollment) {
      return res.status(409).json({
        message: "You already have an enrollment for this class",
      });
    }

    const subtotal = Number(classItem.price || 0);

    const coupon = await getValidCoupon({
      couponCode,
      type: "class",
      subtotal,
      state: state || "TX",
    });

    const breakdown = calculateBillingBreakdown({
      subtotal,
      state: state || "TX",
      coupon,
    });

    const enrollment = await Enrollment.create({
      customer: req.user._id,
      classItem: classItem._id,
      status: "pending",
      paymentStatus: "unpaid",
      amount: breakdown.total,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: req.user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: getClassName(classItem),
              description: `Class enrollment for ${getClassName(classItem)}`,
            },
            unit_amount: Math.round(breakdown.total * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        enrollmentId: enrollment._id.toString(),
        userId: req.user._id.toString(),
        classId: classItem._id.toString(),
        className: getClassName(classItem),
        couponCode: coupon?.code || "",
        state: state || "TX",
        checkoutType: "class_enrollment",
      },
      success_url: `${process.env.CLIENT_URL}/payment-success?type=enrollment&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    await Billing.create({
      user: req.user._id,
      enrollment: enrollment._id,
      class: classItem._id,
      title: getClassName(classItem),
      type: "class",
      status: "pending",
      paymentStatus: "pending",
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent || null,
      subtotal: breakdown.subtotal,
      taxAmount: breakdown.taxAmount,
      discountAmount: breakdown.discountAmount,
      total: breakdown.total,
      amount: breakdown.total,
      couponCode: coupon?.code || null,
      couponDiscountType: coupon?.discountType || null,
      couponDiscountValue: coupon?.discountValue || 0,
      state: state || "TX",
      refundAmount: 0,
      stripeRefundId: "",
    });

    enrollment.stripeSessionId = session.id;
    await enrollment.save();

    return res.status(200).json({
      url: session.url,
      enrollmentId: enrollment._id,
      breakdown,
    });
  } catch (error) {
    console.error("createEnrollmentCheckout error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const markEnrollmentPaidAfterSuccess = async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ message: "session_id is required" });
    }

    const billing = await Billing.findOne({
      stripeSessionId: session_id,
      type: "class",
    });

    if (!billing) {
      return res.status(404).json({ message: "Billing record not found" });
    }

    if (billing.paymentStatus !== "paid") {
      billing.status = "paid";
      billing.paymentStatus = "paid";

      if (!billing.stripePaymentIntentId) {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        billing.stripePaymentIntentId = session.payment_intent || "";
      }

      await billing.save();
    }

    const enrollment = await Enrollment.findByIdAndUpdate(
      billing.enrollment,
      {
        $set: {
          status: "paid",
          paymentStatus: "paid",
          paidAt: new Date(),
        },
      },
      { returnDocument: "after", runValidators: false },
    )
      .populate("customer")
      .populate("classItem");

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    await createOutboxEvent({
      type: "CLASS_ENROLLMENT_EMAIL",
      payload: {
        email: enrollment.customer.email,
        studentName: getStudentName(enrollment.customer),
        className: getClassName(enrollment.classItem),
        date: enrollment.classItem.date,
        time: enrollment.classItem.time,
      },
    });

    return res.status(200).json({
      message: "Enrollment payment marked as paid and email queued",
      enrollment,
    });
  } catch (error) {
    console.error("markEnrollmentPaidAfterSuccess error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const enrollInClass = async (req, res) => {
  try {
    const { classId } = req.body;

    if (!classId) {
      return res.status(400).json({ message: "classId is required" });
    }

    const classItem = await Class.findById(classId);

    if (!classItem) {
      return res.status(404).json({ message: "Class not found" });
    }

    const existingEnrollment = await Enrollment.findOne({
      customer: req.user._id,
      classItem: classItem._id,
      status: { $in: ["pending", "paid"] },
    });

    if (existingEnrollment) {
      return res.status(409).json({
        message: "You already enrolled in this class",
      });
    }

    const enrollment = await Enrollment.create({
      customer: req.user._id,
      classItem: classItem._id,
      status: "paid",
      paymentStatus: "paid",
      amount: Number(classItem.price || 0),
    });

    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate("customer")
      .populate("classItem");

    await createOutboxEvent({
      type: "CLASS_ENROLLMENT_EMAIL",
      payload: {
        email: populatedEnrollment.customer.email,
        studentName: getStudentName(populatedEnrollment.customer),
        className: getClassName(populatedEnrollment.classItem),
        date: populatedEnrollment.classItem.date,
        time: populatedEnrollment.classItem.time,
      },
    });

    return res.status(201).json({
      message: "Class enrollment created and email queued",
      enrollment: populatedEnrollment,
    });
  } catch (error) {
    console.error("enrollInClass error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ customer: req.user._id })
      .populate("classItem")
      .sort({ createdAt: -1 });

    return res.status(200).json(enrollments);
  } catch (error) {
    console.error("getMyEnrollments error:", error);
    return res.status(500).json({ message: error.message });
  }
};
