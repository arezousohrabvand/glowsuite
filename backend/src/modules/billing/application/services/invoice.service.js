export function generateInvoiceNumber() {
  const date = new Date();
  const timestamp = date.getTime();

  return `INV-${timestamp}`;
}

export function buildInvoiceDto(billing) {
  return {
    invoiceNumber: generateInvoiceNumber(),
    billingId: billing._id,
    customer: billing.user,
    type: billing.type,
    subtotal: billing.subtotal,
    discountAmount: billing.discountAmount,
    total: billing.total,
    currency: billing.currency,
    status: billing.status,
    paymentStatus: billing.paymentStatus,
    couponCode: billing.couponCode,
    paidAt: billing.paidAt,
    createdAt: billing.createdAt,
  };
}
