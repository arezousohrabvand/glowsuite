export const createBookingCheckoutDto = (body) => ({
  serviceName: body.serviceName,
  stylistName: body.stylistName,
  date: body.date,
  time: body.time,
  notes: body.notes || "",
  price: body.price,
  couponCode: body.couponCode,
  state: body.state || "TX",
  holdId: body.holdId,
});

export const paymentSuccessDto = (query) => ({
  sessionId: query.session_id,
});
