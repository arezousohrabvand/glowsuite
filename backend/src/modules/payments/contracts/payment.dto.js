export function toPaymentDTO(p) {
  if (!p) return null;

  return {
    id: p._id?.toString(),
    _id: p._id?.toString(),

    user: p.user?.toString?.() || p.user || null,

    // handle populated or plain ObjectId
    booking: p.booking
      ? typeof p.booking === "object"
        ? {
            id: p.booking._id?.toString(),
            serviceName: p.booking.serviceName || "",
          }
        : p.booking.toString()
      : null,

    enrollment: p.enrollment
      ? typeof p.enrollment === "object"
        ? {
            id: p.enrollment._id?.toString(),
          }
        : p.enrollment.toString()
      : null,

    amount: p.amount ?? 0,
    currency: p.currency || "usd",

    provider: p.provider || "stripe",
    status: p.status || "pending",

    stripeSessionId: p.stripeSessionId || null,
    stripePaymentIntentId: p.stripePaymentIntentId || null,

    description: p.description || "",

    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}
