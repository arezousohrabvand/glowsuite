export const validateCreateBookingCheckoutInput = ({ holdId }) => {
  if (!holdId) {
    return "holdId is required";
  }

  return null;
};

export const validatePaymentSuccessInput = ({ sessionId }) => {
  if (!sessionId) {
    return "session_id is required";
  }

  return null;
};
