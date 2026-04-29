export function getCustomerName(user) {
  return (
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    "GlowSuite customer"
  );
}

export function getStylistName(booking) {
  return (
    booking.stylistName ||
    `${booking.stylist?.firstName || ""} ${booking.stylist?.lastName || ""}`.trim()
  );
}
