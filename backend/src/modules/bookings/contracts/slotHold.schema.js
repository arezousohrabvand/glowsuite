export const SLOT_HOLD_STATUSES = [
  "active",
  "expired",
  "released",
  "converted",
];

export const validateCreateSlotHoldInput = ({
  serviceName,
  stylistName,
  date,
  time,
}) => {
  if (!serviceName || !stylistName || !date || !time) {
    return "serviceName, stylistName, date, and time are required";
  }

  return null;
};

export const validateSlotHoldIdInput = ({ holdId }) => {
  if (!holdId) {
    return "holdId is required";
  }

  return null;
};
