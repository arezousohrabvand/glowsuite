import Coupon from "../../models/Coupon.js";

export function calculateBillingBreakdown({
  subtotal = 0,
  state = "TX",
  coupon = null,
}) {
  const normalizedSubtotal = Number(subtotal || 0);
  const taxState = String(state || "TX").toUpperCase();

  const taxRates = {
    TX: 0.0825,
    CA: 0.0725,
    NY: 0.04,
    FL: 0.06,
  };

  const taxRate = taxRates[taxState] ?? 0.08;

  let couponCode = "";
  let couponDiscountType = "";
  let couponDiscountValue = 0;
  let discountAmount = 0;

  if (coupon) {
    couponCode = coupon.code || "";
    couponDiscountType = coupon.discountType || "";
    couponDiscountValue = Number(coupon.discountValue || 0);

    if (couponDiscountType === "percent") {
      discountAmount = (normalizedSubtotal * couponDiscountValue) / 100;
    } else if (couponDiscountType === "fixed") {
      discountAmount = couponDiscountValue;
    }
  }

  if (discountAmount > normalizedSubtotal) {
    discountAmount = normalizedSubtotal;
  }

  const discountedSubtotal = normalizedSubtotal - discountAmount;
  const taxAmount = discountedSubtotal * taxRate;
  const total = discountedSubtotal + taxAmount;

  return {
    subtotal: Number(normalizedSubtotal.toFixed(2)),
    taxState,
    taxRate,
    taxAmount: Number(taxAmount.toFixed(2)),
    couponCode,
    couponDiscountType,
    couponDiscountValue,
    discountAmount: Number(discountAmount.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
}

export async function getValidCoupon({ couponCode, type, subtotal, state }) {
  if (!couponCode) return null;

  const normalizedCode = String(couponCode).trim().toUpperCase();

  const coupon = await Coupon.findOne({
    code: normalizedCode,
    isActive: true,
  });

  if (!coupon) return null;

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return null;
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return null;
  }

  if (coupon.applicableType && coupon.applicableType !== "all") {
    if (coupon.applicableType !== type) {
      return null;
    }
  }

  if (
    coupon.minimumSubtotal &&
    Number(subtotal) < Number(coupon.minimumSubtotal)
  ) {
    return null;
  }

  if (coupon.allowedStates?.length) {
    const normalizedState = String(state || "TX").toUpperCase();
    if (!coupon.allowedStates.includes(normalizedState)) {
      return null;
    }
  }

  return coupon;
}
