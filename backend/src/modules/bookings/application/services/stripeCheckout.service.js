import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeCheckoutService = {
  createBookingCheckoutSession({
    user,
    booking,
    service,
    stylistUser,
    breakdown,
    coupon,
    state,
    holdId,
  }) {
    return stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: service.name,
              description: `Booking for ${service.name}`,
            },
            unit_amount: Math.round(breakdown.total * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking._id.toString(),
        userId: user._id.toString(),
        serviceId: service._id.toString(),
        holdId: holdId.toString(),
        stylistId: stylistUser._id.toString(),
        serviceName: service.name,
        stylistName: booking.stylistName,
        bookingDate: booking.date,
        bookingTime: booking.time,
        couponCode: coupon?.code || "",
        state: state || "TX",
        bookingType: "service",
      },
      success_url: `${process.env.CLIENT_URL}/payment-success?type=booking&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });
  },

  retrieveSession(sessionId) {
    return stripe.checkout.sessions.retrieve(sessionId);
  },
};
