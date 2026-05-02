export function validateCreateEnrollmentInput(dto) {
  if (!dto.classId) return "classId is required";
  return null;
}

export function validateCheckoutInput(dto) {
  if (!dto.classId) return "classId is required";
  return null;
}

export function validatePaymentSuccessInput(dto) {
  if (!dto.sessionId) return "session_id is required";
  return null;
}

export function validateCancelEnrollmentInput(dto) {
  if (!dto.enrollmentId) return "enrollmentId is required";
  return null;
}
