export class PaymentAggregate {
  constructor({ billing, booking, enrollment }) {
    this.billing = billing;
    this.booking = booking;
    this.enrollment = enrollment;
  }

  isAlreadyPaid() {
    return this.billing?.paymentStatus === "paid";
  }

  markAsPaid(paymentIntentId) {
    if (this.isAlreadyPaid()) return;

    this.billing.status = "paid";
    this.billing.paymentStatus = "paid";
    this.billing.stripePaymentIntentId = paymentIntentId;

    if (this.booking) {
      this.booking.status = "Confirmed";
      this.booking.paymentStatus = "paid";
    }

    if (this.enrollment) {
      this.enrollment.status = "confirmed";
      this.enrollment.paymentStatus = "paid";
    }
  }

  markAsFailed() {
    this.billing.status = "failed";
    this.billing.paymentStatus = "failed";
  }
}
