import { BOOKING_STATUS } from "./bookingStatus.js";
import { PAYMENT_STATUS } from "./paymentStatus.js";

export class Booking {
  constructor(data) {
    this.id = data.id;
    this.user = data.user;
    this.service = data.service;
    this.serviceName = data.serviceName;
    this.stylist = data.stylist;
    this.stylistName = data.stylistName;
    this.date = data.date;
    this.time = data.time;
    this.slotStart = data.slotStart;
    this.slotEnd = data.slotEnd;
    this.notes = data.notes;
    this.price = data.price;

    this.status = data.status || BOOKING_STATUS.PENDING;
    this.paymentStatus = data.paymentStatus || PAYMENT_STATUS.UNPAID;
  }

  confirm() {
    this.status = BOOKING_STATUS.CONFIRMED;
  }

  cancel() {
    this.status = BOOKING_STATUS.CANCELLED;
  }

  markPaid() {
    this.paymentStatus = PAYMENT_STATUS.PAID;
  }

  refund() {
    this.paymentStatus = PAYMENT_STATUS.REFUNDED;
  }

  isActive() {
    return [
      BOOKING_STATUS.PENDING,
      BOOKING_STATUS.UPCOMING,
      BOOKING_STATUS.CONFIRMED,
    ].includes(this.status);
  }
}
