import Booking from "../infrastructure/mongoose/booking.model.js";

export const hasStylistSlotConflict = async ({
  stylistId,
  slotStart,
  slotEnd,
  excludeBookingId = null,
}) => {
  const query = {
    stylist: stylistId,
    status: { $nin: ["Cancelled"] },

    // overlap rule:
    // existing slotStart < new slotEnd
    // existing slotEnd > new slotStart
    slotStart: { $lt: slotEnd },
    slotEnd: { $gt: slotStart },
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflict = await Booking.findOne(query).select("_id slotStart slotEnd");

  return Boolean(conflict);
};
