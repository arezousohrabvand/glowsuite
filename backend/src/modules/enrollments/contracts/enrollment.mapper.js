export function mapEnrollmentToResponse(enrollment) {
  if (!enrollment) return null;

  return {
    id: enrollment._id,
    customer: enrollment.customer,
    classItem: enrollment.classItem,
    status: enrollment.status,
    paymentStatus: enrollment.paymentStatus,
    amount: enrollment.amount,
    stripeSessionId: enrollment.stripeSessionId,
    paidAt: enrollment.paidAt,
    createdAt: enrollment.createdAt,
    updatedAt: enrollment.updatedAt,
  };
}

export function mapEnrollmentsToResponse(enrollments = []) {
  return enrollments.map(mapEnrollmentToResponse);
}
