import { enrollmentRepository } from "../../infrastructure/repositories/enrollment.repository.js";

export async function getEnrollmentsAdminHandler() {
  return enrollmentRepository.findAllAdmin();
}
