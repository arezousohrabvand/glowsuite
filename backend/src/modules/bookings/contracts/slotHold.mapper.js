export const mapSlotHoldToResponse = (hold) => ({
  id: hold._id,
  holdId: hold._id,
  user: hold.user,
  serviceName: hold.serviceName,
  stylistName: hold.stylistName,
  date: hold.date,
  time: hold.time,
  expiresAt: hold.expiresAt,
  status: hold.status,
  createdAt: hold.createdAt,
  updatedAt: hold.updatedAt,
});
