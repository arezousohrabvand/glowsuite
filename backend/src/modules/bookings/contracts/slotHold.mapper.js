export function toSlotHoldResponse(slotHoldDoc) {
  if (!slotHoldDoc) return null;

  return {
    id: slotHoldDoc._id.toString(),
    user: slotHoldDoc.user?.toString?.() || slotHoldDoc.user,
    serviceName: slotHoldDoc.serviceName,
    stylistName: slotHoldDoc.stylistName,
    date: slotHoldDoc.date,
    time: slotHoldDoc.time,
    status: slotHoldDoc.status,
    expiresAt: slotHoldDoc.expiresAt,
    createdAt: slotHoldDoc.createdAt,
    updatedAt: slotHoldDoc.updatedAt,
  };
}

export function toSlotHoldListResponse(slotHolds = []) {
  return slotHolds.map(toSlotHoldResponse);
}
