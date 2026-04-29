export const BOOKING_STATUSES = [
  "Pending",
  "Upcoming",
  "Confirmed",
  "Completed",
  "Cancelled",
];

export const ACTIVE_BOOKING_STATUSES = ["Pending", "Upcoming", "Confirmed"];

export const validateCreateBookingInput = (data) => {
  if (
    !data.serviceName ||
    !data.stylist ||
    !data.stylistName ||
    !data.date ||
    !data.time ||
    !data.slotStart ||
    !data.slotEnd
  ) {
    return "serviceName, stylist, stylistName, date, time, slotStart, and slotEnd are required";
  }

  if (Number(data.price) < 0) {
    return "Price cannot be negative";
  }

  return null;
};

export const validateRescheduleBookingInput = ({ date, time, stylistName }) => {
  if (!date || !time || !stylistName) {
    return "date, time, and stylistName are required";
  }

  return null;
};

export const validateBookingStatusInput = ({ status }) => {
  if (!BOOKING_STATUSES.includes(status)) {
    return "Invalid status update";
  }

  return null;
};
