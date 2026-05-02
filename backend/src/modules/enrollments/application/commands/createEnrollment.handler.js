import Class from "../../../classes/infrastructure/mongoose/ClassModel.js";
import { enrollmentRepository } from "../../infrastructure/repositories/enrollment.repository.js";
import { createOutboxEvent } from "../../../../shared/utils/createOutboxEvent.js";

function getStudentName(user) {
  return `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Student";
}

function getClassName(classItem) {
  return classItem?.title || classItem?.name || "GlowSuite Class";
}

export async function createEnrollmentHandler({ user, dto }) {
  const classItem = await Class.findById(dto.classId);

  if (!classItem) {
    const error = new Error("Class not found");
    error.statusCode = 404;
    throw error;
  }

  const existingEnrollment = await enrollmentRepository.findExistingActiveEnrollment({
    customerId: user._id,
    classId: classItem._id,
  });

  if (existingEnrollment) {
    const error = new Error("You already enrolled in this class");
    error.statusCode = 409;
    throw error;
  }

  const enrollment = await enrollmentRepository.create({
    customer: user._id,
    classItem: classItem._id,
    status: "paid",
    paymentStatus: "paid",
    amount: Number(classItem.price || 0),
    paidAt: new Date(),
  });

  const populatedEnrollment = await enrollmentRepository.findByIdPopulated(
    enrollment._id,
  );

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

  return populatedEnrollment;
}
