export const createBookingSchema = {
  serviceId: { required: true },
  stylistId: { required: true },
  date: { required: true },
  time: { required: true },
};

export const updateBookingStatusSchema = {
  status: {
    required: true,
    allowedValues: [
      "Pending",
      "Upcoming",
      "Confirmed",
      "Completed",
      "Cancelled",
    ],
  },
};
