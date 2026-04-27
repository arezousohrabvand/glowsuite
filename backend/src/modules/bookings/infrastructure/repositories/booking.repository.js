import Booking from "../mongoose/booking.model.js";

export const bookingRepository = {
  async create(data) {
    return Booking.create(data);
  },

  async findById(id) {
    return Booking.findById(id);
  },

  async findByIdAndUpdate(id, update) {
    return Booking.findByIdAndUpdate(id, update, {
      new: true,
    });
  },

  async findByUser(userId) {
    return Booking.find({ user: userId }).sort({ createdAt: -1 });
  },

  async findAll(filter = {}) {
    return Booking.find(filter).sort({ createdAt: -1 });
  },

  async count(filter = {}) {
    return Booking.countDocuments(filter);
  },

  async delete(id) {
    return Booking.findByIdAndDelete(id);
  },
};
