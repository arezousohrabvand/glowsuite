import asyncHandler from "express-async-handler";
import Stripe from "stripe";

import Class from "../../classes/infrastructure/mongoose/ClassModel.js";
import Billing from "../../../models/Billing.js";

import {
  createEnrollmentDto,
  createEnrollmentCheckoutDto,
  paymentSuccessDto,
  cancelEnrollmentDto,
} from "../contracts/enrollment.dto.js";

import {
  validateCreateEnrollmentInput,
  validateCheckoutInput,
  validatePaymentSuccessInput,
  validateCancelEnrollmentInput,
} from "../contracts/enrollment.schema.js";

import {
  mapEnrollmentToResponse,
  mapEnrollmentsToResponse,
} from "../contracts/enrollment.mapper.js";

import { createEnrollmentHandler } from "../application/commands/createEnrollment.handler.js";
import { cancelEnrollmentHandler } from "../application/commands/cancelEnrollment.handler.js";
import { getMyEnrollmentsHandler } from "../application/queries/getMyEnrollments.handler.js";
import { getEnrollmentsAdminHandler } from "../application/queries/getEnrollmentsAdmin.handler.js";

import { enrollmentRepository } from "../infrastructure/repositories/enrollment.repository.js";
import { createOutboxEvent } from "../../../shared/utils/createOutboxEvent.js";

import {
  calculateBillingBreakdown,
  getValidCoupon,
} from "../../../shared/utils/billingMath.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function getStudentName(user) {
  return `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Student";
}

function getClassName(classItem) {
  return classItem?.title || classItem?.name || "GlowSuite Class";
}

export const previewEnrollmentCheckout = asyncHandler(async (req, res) => {
  const dto = createEnrollmentCheckoutDto(req.body);

  const validationError = validateCheckoutInput(dto);
  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  const classItem = await Class.findById(dto.classId);

  if (!classItem) {
    res.status(404);
    throw new Error("Class not found");
  }

  const subtotal = Number(classItem.price || 0);

  const coupon = await getValidCoupon({
    couponCode: dto.couponCode,
    type: "class",
    subtotal,
    state: dto.state,
  });

  const breakdown = calculateBillingBreakdown({
    subtotal,
    state: dto.state,
    coupon,
  });

  res.status(200).json({
    classId: classItem._id,
    className: getClassName(classItem),
    breakdown,
  });
});

export const createEnrollmentCheckout = asyncHandler(async (req, res) => {
  const dto = createEnrollmentCheckoutDto(req.body);

  const validationError = validateCheckoutInput(dto);
  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  const classItem = await Class.findById(dto.classId);

  if (!classItem) {
    res.status(404);
    throw new Error("Class not found");
  }

  const existingEnrollment = await enrollmentRepository.findExistingActiveEnrollment({
    customerId: req.user._id,
    classId: classItem._id,
  });

  if (existingEnrollment) {
    res.status(409);
    throw new Error("You already have an enrollment for this class");
  }

  const subtotal = Number(classItem.price || 0);

  const coupon = await getValidCoupon({
    couponCode: dto.couponCode,
    type: "class",
    subtotal,
    state: dto.state,
  });

  const breakdown = calculateBillingBreakdown({
    subtotal,
    state: dto.state,
    coupon,
  });

  const enrollment = await enrollmentRepository.create({
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
      state: dto.state,
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
    state: dto.state,
    refundAmount: 0,
    stripeRefundId: "",
  });

  enrollment.stripeSessionId = session.id;
  await enrollmentRepository.save(enrollment);

  res.status(200).json({
    url: session.url,
    enrollmentId: enrollment._id,
    breakdown,
  });
});

export const markEnrollmentPaidAfterSuccess = asyncHandler(async (req, res) => {
  const dto = paymentSuccessDto(req.query);

  const validationError = validatePaymentSuccessInput(dto);
  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  const billing = await Billing.findOne({
    stripeSessionId: dto.sessionId,
    type: "class",
  });

  if (!billing) {
    res.status(404);
    throw new Error("Billing record not found");
  }

  if (billing.paymentStatus !== "paid") {
    billing.status = "paid";
    billing.paymentStatus = "paid";

    if (!billing.stripePaymentIntentId) {
      const session = await stripe.checkout.sessions.retrieve(dto.sessionId);
      billing.stripePaymentIntentId = session.payment_intent || "";
    }

    await billing.save();
  }

  const enrollment = await enrollmentRepository.markPaidById(billing.enrollment);

  if (!enrollment) {
    res.status(404);
    throw new Error("Enrollment not found");
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

  res.status(200).json({
    message: "Enrollment payment marked as paid and email queued",
    enrollment: mapEnrollmentToResponse(enrollment),
  });
});

export const enrollInClass = asyncHandler(async (req, res) => {
  const dto = createEnrollmentDto(req.body);

  const validationError = validateCreateEnrollmentInput(dto);
  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  const enrollment = await createEnrollmentHandler({
    user: req.user,
    dto,
  });

  res.status(201).json({
    message: "Class enrollment created and email queued",
    enrollment: mapEnrollmentToResponse(enrollment),
  });
});

export const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await getMyEnrollmentsHandler({
    user: req.user,
  });

  res.status(200).json(mapEnrollmentsToResponse(enrollments));
});

export const getEnrollmentsAdmin = asyncHandler(async (req, res) => {
  const enrollments = await getEnrollmentsAdminHandler();

  res.status(200).json(mapEnrollmentsToResponse(enrollments));
});

export const cancelEnrollment = asyncHandler(async (req, res) => {
  const dto = cancelEnrollmentDto(req.params);

  const validationError = validateCancelEnrollmentInput(dto);
  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  const enrollment = await cancelEnrollmentHandler({ dto });

  res.status(200).json({
    message: "Enrollment cancelled",
    enrollment: mapEnrollmentToResponse(enrollment),
  });
});
