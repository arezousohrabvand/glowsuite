import Payment from "../../infrastructure/mongoose/PaymentModel.js";

export async function getMyPaymentsHandler(userId, query = {}) {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);
  const status = query.status;
  const from = query.from;
  const to = query.to;

  const filter = {
    user: userId,
  };

  if (status) {
    filter.status = status;
  }

  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }

  const skip = (page - 1) * limit;

  const [payments, total] = await Promise.all([
    Payment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),

    Payment.countDocuments(filter),
  ]);

  return {
    data: payments,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}
