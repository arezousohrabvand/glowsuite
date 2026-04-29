export const createBookingDto = (body) => ({
  service: body.service,
  serviceName: body.serviceName,
  stylist: body.stylist,
  stylistName: body.stylistName,
  date: body.date,
  time: body.time,
  slotStart: body.slotStart,
  slotEnd: body.slotEnd,
  notes: body.notes || "",
  price: body.price,
  holdId: body.holdId || "",
});

export const rescheduleBookingDto = (body) => ({
  date: body.date,
  time: body.time,
  stylistName: body.stylistName,
  notes: body.notes || "",
});

export const updateBookingStatusDto = (body) => ({
  status: body.status,
});
