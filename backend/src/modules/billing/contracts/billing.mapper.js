export function mapBillingToResponse(billing) {
  return {
    id: billing._id,
    user: billing.user,
    booking: billing.booking,
    enrollment: billing.enrollment,
    service: billing.service,
    type: billing.type,
    amount: billing.amount,
    subtotal: billing.subtotal,
    discountAmount: billing.discountAmount,
    total: billing.total,
    currency: billing.currency,
    status: billing.status,
    paymentStatus: billing.paymentStatus,
    couponCode: billing.couponCode,
    stripeSessionId: billing.stripeSessionId,
    stripePaymentIntentId: billing.stripePaymentIntentId,
    stripeRefundId: billing.stripeRefundId,
    refundAmount: billing.refundAmount,
    refundReason: billing.refundReason,
    description: billing.description,
    paidAt: billing.paidAt,
    createdAt: billing.createdAt,
    updatedAt: billing.updatedAt,
  };
}

export function mapBillingListToResponse(records) {
  return records.map(mapBillingToResponse);
}
