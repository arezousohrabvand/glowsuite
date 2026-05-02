export function createEnrollmentDto(body = {}) {
  return {
    classId: body.classId,
  };
}

export function createEnrollmentCheckoutDto(body = {}) {
  return {
    classId: body.classId,
    couponCode: body.couponCode || "",
    state: body.state || "TX",
  };
}

export function paymentSuccessDto(query = {}) {
  return {
    sessionId: query.session_id,
  };
}

export function cancelEnrollmentDto(params = {}) {
  return {
    enrollmentId: params.enrollmentId || params.id,
  };
}
