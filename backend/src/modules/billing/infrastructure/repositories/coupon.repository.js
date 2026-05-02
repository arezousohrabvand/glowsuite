import Coupon from "../mongoose/CouponModel.js";

export const couponRepository = {
  create(data) {
    return Coupon.create({
      ...data,
      code: data.code.toUpperCase().trim(),
    });
  },

  findAll() {
    return Coupon.find().sort({ createdAt: -1 });
  },

  findById(id) {
    return Coupon.findById(id);
  },

  findByCode(code) {
    return Coupon.findOne({
      code: code.toUpperCase().trim(),
      isActive: true,
    });
  },

  update(id, data) {
    const payload = { ...data };

    if (payload.code) {
      payload.code = payload.code.toUpperCase().trim();
    }

    return Coupon.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
  },

  delete(id) {
    return Coupon.findByIdAndDelete(id);
  },

  incrementUsage(id) {
    return Coupon.findByIdAndUpdate(id, {
      $inc: { usedCount: 1 },
    });
  },
};
