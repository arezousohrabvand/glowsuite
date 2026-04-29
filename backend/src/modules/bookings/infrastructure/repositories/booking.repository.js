import Booking from "../mongoose/booking.model.js";

export const bookingRepository = {
  async create(data) {
    return Booking.create(data);
  },

  async findById(id) {
    return Booking.findById(id);
  },

  async findByIdWithDetails(id) {
    return Booking.findById(id)
      .populate("user")
      .populate("service")
      .populate("stylist");
  },

  async findMyBookings(userId) {
    return Booking.find({ user: userId })
      .populate("service")
      .sort({ createdAt: -1 });
  },

  async findAdminBookings(filters = {}) {
    const query = {};

    if (filters.status) query.status = filters.status;
    if (filters.paymentStatus) query.paymentStatus = filters.paymentStatus;
    if (filters.stylist) query.stylist = filters.stylist;
    if (filters.user) query.user = filters.user;

    return Booking.find(query)
      .populate("user", "firstName lastName email phone role")
      .populate("service")
      .populate("stylist", "firstName lastName email role")
      .sort({ slotStart: -1 });
  },

  async findConflict({
    stylistId,
    slotStart,
    slotEnd,
    excludeBookingId = null,
  }) {
    const query = {
      stylist: stylistId,
      status: { $in: ["Pending", "Upcoming", "Confirmed"] },
      slotStart: { $lt: new Date(slotEnd) },
      slotEnd: { $gt: new Date(slotStart) },
    };

    if (excludeBookingId) {
      query._id = { $ne: excludeBookingId };
    }

    return Booking.findOne(query);
  },

  async updateById(id, data) {
    return Booking.findByIdAndUpdate(
      id,
      { $set: data },
      { returnDocument: "after", runValidators: false },
    )
      .populate("service")
      .populate("user")
      .populate("stylist");
  },
};
