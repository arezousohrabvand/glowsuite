import { BILLING_STATUS, PAYMENT_STATUS } from "./billingStatus.js";
import { BILLING_TYPE } from "./billingType.js";
import { BillingDomainError } from "./billingErrors.js";

export class BillingAggregate {
  constructor(data = {}) {
    this.user = data.user;
    this.booking = data.booking || null;
    this.enrollment = data.enrollment || null;
    this.service = data.service || null;

    this.type = data.type;
    this.amount = Number(data.amount || 0);
    this.subtotal = Number(data.subtotal ?? data.amount ?? 0);
    this.discountAmount = Number(data.discountAmount || 0);
    this.total = Number(data.total ?? data.amount ?? 0);

    this.currency = data.currency || "usd";
    this.status = data.status || BILLING_STATUS.PENDING;
    this.paymentStatus = data.paymentStatus || PAYMENT_STATUS.UNPAID;

    this.couponCode = data.couponCode || "";
    this.description = data.description || "";

    this.stripeSessionId = data.stripeSessionId || "";
    this.stripePaymentIntentId = data.stripePaymentIntentId || "";

    this.refundAmount = Number(data.refundAmount || 0);
    this.stripeRefundId = data.stripeRefundId || "";
    this.refundReason = data.refundReason || "";
    this.paidAt = data.paidAt || null;
  }

  static create(data) {
    const billing = new BillingAggregate(data);
    billing.validate();
    return billing;
  }

  validate() {
    if (!this.user) {
      throw new BillingDomainError("Billing user is required");
    }

    if (!Object.values(BILLING_TYPE).includes(this.type)) {
      throw new BillingDomainError("Invalid billing type");
    }

    if (this.amount < 0 || this.subtotal < 0 || this.total < 0) {
      throw new BillingDomainError("Billing amount cannot be negative");
    }

    if (this.discountAmount < 0) {
      throw new BillingDomainError("Discount cannot be negative");
    }

    if (this.discountAmount > this.subtotal) {
      throw new BillingDomainError("Discount cannot be greater than subtotal");
    }

    if (!Object.values(BILLING_STATUS).includes(this.status)) {
      throw new BillingDomainError("Invalid billing status");
    }

    if (!Object.values(PAYMENT_STATUS).includes(this.paymentStatus)) {
      throw new BillingDomainError("Invalid payment status");
    }
  }

  markPaid({ stripeSessionId, stripePaymentIntentId }) {
    if (this.paymentStatus === PAYMENT_STATUS.REFUNDED) {
      throw new BillingDomainError("Refunded billing cannot be marked as paid");
    }

    this.status = BILLING_STATUS.PAID;
    this.paymentStatus = PAYMENT_STATUS.PAID;
    this.stripeSessionId = stripeSessionId || this.stripeSessionId;
    this.stripePaymentIntentId = stripePaymentIntentId || this.stripePaymentIntentId;
    this.paidAt = new Date();

    return this;
  }

  markFailed() {
    if (this.paymentStatus === PAYMENT_STATUS.PAID) {
      throw new BillingDomainError("Paid billing cannot be marked as failed");
    }

    this.status = BILLING_STATUS.FAILED;
    this.paymentStatus = PAYMENT_STATUS.FAILED;

    return this;
  }

  refund({ refundAmount, stripeRefundId, reason }) {
    if (this.paymentStatus === PAYMENT_STATUS.REFUNDED) {
      throw new BillingDomainError("This payment is already refunded");
    }

    if (this.paymentStatus !== PAYMENT_STATUS.PAID) {
      throw new BillingDomainError("Only paid billing can be refunded");
    }

    const amount = refundAmount ? Number(refundAmount) : this.total;

    if (amount <= 0) {
      throw new BillingDomainError("Refund amount must be greater than zero");
    }

    if (amount > this.total) {
      throw new BillingDomainError("Refund amount cannot be greater than total");
    }

    this.status = BILLING_STATUS.REFUNDED;
    this.paymentStatus = PAYMENT_STATUS.REFUNDED;
    this.refundAmount = amount;
    this.stripeRefundId = stripeRefundId || "";
    this.refundReason = reason || "Admin refund";

    return this;
  }

  toPersistence() {
    return {
      user: this.user,
      booking: this.booking,
      enrollment: this.enrollment,
      service: this.service,
      type: this.type,
      amount: this.amount,
      subtotal: this.subtotal,
      discountAmount: this.discountAmount,
      total: this.total,
      currency: this.currency,
      status: this.status,
      paymentStatus: this.paymentStatus,
      couponCode: this.couponCode,
      description: this.description,
      stripeSessionId: this.stripeSessionId,
      stripePaymentIntentId: this.stripePaymentIntentId,
      refundAmount: this.refundAmount,
      stripeRefundId: this.stripeRefundId,
      refundReason: this.refundReason,
      paidAt: this.paidAt,
    };
  }
}
