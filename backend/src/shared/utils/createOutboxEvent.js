import OutboxEvent from "../../models/OutboxEvent.js";

export const createOutboxEvent = async ({ type, payload }) => {
  if (!type || !payload) {
    throw new Error("Outbox event requires type and payload");
  }

  return await OutboxEvent.create({
    type,
    payload,
    status: "pending",
  });
};
