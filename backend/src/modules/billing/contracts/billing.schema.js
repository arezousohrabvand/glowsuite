export function validateCreateBillingRecord(req, res, next) {
  const { user, type, amount } = req.body;

  if (!user) {
    return res.status(400).json({ message: "User is required" });
  }

  if (!type || !["booking", "class"].includes(type)) {
    return res.status(400).json({
      message: "Billing type must be booking or class",
    });
  }

  if (amount === undefined || Number(amount) < 0) {
    return res.status(400).json({
      message: "Amount must be zero or greater",
    });
  }

  next();
}

export function validateRefundBilling(req, res, next) {
  const { refundAmount } = req.body;

  if (refundAmount !== undefined && Number(refundAmount) <= 0) {
    return res.status(400).json({
      message: "Refund amount must be greater than zero",
    });
  }

  next();
}
