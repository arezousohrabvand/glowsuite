import OutboxEvent from "../models/OutboxEvent.js";

export const createOutboxEmail = async ({
  type,
  recipientEmail,
  subject,
  payload = {},
  scheduledFor = new Date(),
}) => {
  return OutboxEvent.create({
    type,
    payload: {
      email: recipientEmail, // ✅ FIX HERE
      subject,
      ...payload,
    },
    scheduledFor,
  });
};
