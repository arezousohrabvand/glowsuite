export const createBookingCheckoutSession = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      serviceName,
      stylistName,
      date,
      time,
      notes,
      price,
      couponCode,
      state,
    } = req.body;

    const service = await Service.findOne({
      title: { $regex: new RegExp(`^${serviceName}$`, "i") },
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const subtotal = Number(service.price || price || 0);

    const coupon = await getValidCoupon({
      couponCode,
      type: "booking",
      subtotal,
      state: state || "TX",
    });

    const breakdown = calculateBillingBreakdown({
      subtotal,
      state: state || "TX",
      coupon,
    });

    const pendingBooking = await Booking.create({
      user: req.user._id,
      service: service._id,
      fullName: fullName || req.user.name || "",
      email: email || req.user.email || "",
      phone: phone || "",
      stylistName: stylistName || "",
      bookingDate: date,
      timeSlot: time,
      notes: notes || "",
      status: "pending",
      paymentStatus: "pending",
      price: breakdown.total,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email || req.user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: service.title,
              description: `Booking for ${service.title}`,
            },
            unit_amount: Math.round(breakdown.total * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: pendingBooking._id.toString(),
        userId: req.user._id.toString(),
        serviceId: service._id.toString(),
        serviceName: service.title,
        stylistName: stylistName || "",
        bookingDate: date || "",
        bookingTime: time || "",
        couponCode: coupon?.code || "",
        state: state || "TX",
        bookingType: "service",
      },
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    await Billing.create({
      user: req.user._id,
      booking: pendingBooking._id,
      service: service._id,
      title: service.title,
      type: "booking",
      status: "pending",
      paymentStatus: "pending",
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent || null,
      subtotal: breakdown.subtotal,
      taxAmount: breakdown.taxAmount,
      discountAmount: breakdown.discountAmount,
      total: breakdown.total,
      amount: breakdown.total,
      couponCode: coupon?.code || null,
      couponDiscountType: coupon?.discountType || null,
      couponDiscountValue: coupon?.discountValue || 0,
      state: state || "TX",
    });

    res.status(200).json({
      url: session.url,
      breakdown,
    });
  } catch (error) {
    console.error("createBookingCheckoutSession error:", error);
    res.status(500).json({ message: error.message });
  }
};
