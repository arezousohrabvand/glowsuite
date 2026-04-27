import OutboxEvent from "../models/OutboxEvent.js";
import { sendEmail } from "../services/emailService.js";
import {
  bookingConfirmedTemplate,
  bookingCanceledTemplate,
  classEnrolledTemplate,
  bookingReminderTemplate,
} from "../services/emailTemplates.js";

const getTemplate = (event) => {
  switch (event.type) {
    case "BOOKING_CONFIRMED_EMAIL":
      return bookingConfirmedTemplate(event.payload);

    case "BOOKING_CANCELED_EMAIL":
      return bookingCanceledTemplate(event.payload);

    case "CLASS_ENROLLED_EMAIL":
      return classEnrolledTemplate(event.payload);

    case "BOOKING_REMINDER_EMAIL":
      return bookingReminderTemplate(event.payload);

    default:
      throw new Error(`Unknown email event type: ${event.type}`);
  }
};

export const processEmailOutbox = async () => {
  const events = await OutboxEvent.find({
    status: "pending",
    scheduledFor: { $lte: new Date() },
  })
    .sort({ createdAt: 1 })
    .limit(10);

  for (const event of events) {
    try {
      event.status = "processing";
      event.attempts += 1;
      await event.save();

      const html = getTemplate(event);

      await sendEmail({
        to: event.recipientEmail,
        subject: event.subject,
        html,
      });

      event.status = "sent";
      event.sentAt = new Date();
      await event.save();
    } catch (error) {
      event.status = event.attempts >= 3 ? "failed" : "pending";
      event.lastError = error.message;
      await event.save();
    }
  }
};
