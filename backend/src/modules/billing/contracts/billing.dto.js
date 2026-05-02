export function createBillingRecordDto(body) {
  return {
    user: body.user,

    booking: body.booking || null,
    enrollment: body.enrollment || null,
    service: body.service || null,

    type: body.type || "booking",

    amount: Number(body.amount || 0),
    subtotal: Number(body.subtotal || body.amount || 0),
    total: Number(body.total || body.amount || 0), // ✅ IMPORTANT

    couponCode: body.couponCode || "",

    currency: body.currency || "usd",

    description: body.description || "",

    stripeSessionId: body.stripeSessionId || null,
    stripePaymentIntentId: body.stripePaymentIntentId || null,

    status: "pending",
    paymentStatus: "unpaid",
  };
}
export function toBillingDTO(b) {
  if (!b) return null;

  return {
    id: b._id?.toString(),
    _id: b._id?.toString(),

    user: b.user?.toString?.() || b.user || null,

    booking: b.booking
      ? typeof b.booking === "object"
        ? {
            id: b.booking._id?.toString(),
            serviceName: b.booking.serviceName || "",
          }
        : b.booking.toString()
      : null,

    enrollment: b.enrollment
      ? typeof b.enrollment === "object"
        ? {
            id: b.enrollment._id?.toString(),
          }
        : b.enrollment.toString()
      : null,

    amount: b.amount ?? 0,
    subtotal: b.subtotal ?? b.amount ?? 0,
    total: b.total ?? b.amount ?? 0,

    currency: b.currency || "usd",

    status: b.status || "pending",
    paymentStatus: b.paymentStatus || "unpaid",

    stripeSessionId: b.stripeSessionId || null,

    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  };
}

export function refundBillingDto(body) {
  return {
    refundAmount: Number(body.refundAmount || 0),
    reason: body.reason || "Admin refund",
  };
}
