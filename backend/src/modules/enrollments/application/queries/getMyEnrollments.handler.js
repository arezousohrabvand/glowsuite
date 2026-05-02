import { enrollmentRepository } from "../../infrastructure/repositories/enrollment.repository.js";

export async function getMyEnrollmentsHandler({ user }) {
  return enrollmentRepository.findMyEnrollments(user._id);
}
