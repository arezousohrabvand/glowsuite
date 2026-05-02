import Billing from "../mongoose/BillingModel.js";

export async function findBillingWithPagination(filter, options) {
  const { page, limit } = options;

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Billing.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),

    Billing.countDocuments(filter),
  ]);

  return { data, total };
}
export const billingRepository = {
  findByUser(userId) {
    return Billing.find({ user: userId })
      .populate("booking")
      .populate("service")
      .populate("enrollment")
      .sort({ createdAt: -1 });
  },

  findAllAdmin() {
    return Billing.find()
      .populate("user", "firstName lastName email role")
      .populate("booking")
      .populate("service")
      .populate("enrollment")
      .sort({ createdAt: -1 });
  },

  findById(id) {
    return Billing.findById(id);
  },

  findByStripeSessionId(stripeSessionId) {
    return Billing.findOne({ stripeSessionId });
  },

  create(data) {
    return Billing.create(data);
  },

  save(billing) {
    return billing.save();
  },
};
