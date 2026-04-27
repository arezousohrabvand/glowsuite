export const PAYMENT_STATUS = {
  UNPAID: "unpaid",
  PAID: "paid",
  REFUNDED: "refunded",
};

// optional helper
export const isPaid = (status) => status === PAYMENT_STATUS.PAID;
