import SlotHold from "../mongoose/slotHold.model.js";

export const slotHoldRepository = {
  findById(id) {
    return SlotHold.findById(id);
  },

  findActiveHold({ stylistName, date, time }) {
    return SlotHold.findOne({
      stylistName,
      date,
      time,
      status: "active",
      expiresAt: { $gt: new Date() },
    });
  },

  releaseActiveHold({ userId, stylistName, date, time }) {
    return SlotHold.updateMany(
      {
        user: userId,
        stylistName,
        date,
        time,
        status: "active",
      },
      { $set: { status: "released" } },
    );
  },

  convertActiveHold({ userId, stylistName, date, time }) {
    return SlotHold.updateMany(
      {
        user: userId,
        stylistName,
        date,
        time,
        status: "active",
      },
      { $set: { status: "converted" } },
    );
  },
};
