import { enrollmentRepository } from "../../infrastructure/repositories/enrollment.repository.js";

export async function cancelEnrollmentHandler({ dto }) {
  const enrollment = await enrollmentRepository.cancelById(dto.enrollmentId);

  if (!enrollment) {
    const error = new Error("Enrollment not found");
    error.statusCode = 404;
    throw error;
  }

  return enrollment;
}
