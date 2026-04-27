import OutboxEvent from "../models/OutboxEvent.js";
import DeadLetterEvent from "../models/DeadLetterEvent.js";

import { sendEmail } from "../infra/email/emailService.js";

import { bookingConfirmedEmail } from "../infra/email/template/bookingConfirmedEmail.js";
import { bookingCancelledEmail } from "../infra/email/template/bookingCancelledEmail.js";
import { classEnrollmentEmail } from "../infra/email/template/classEnrollmentEmail.js";
import { reminderEmail } from "../infra/email/template/reminderEmail.js";

/**
 * Build email payload based on event type
 */
const buildEmail = (event) => {
  const { type, payload } = event;

  switch (type) {
    case "BOOKING_CONFIRMED_EMAIL":
      return {
        to: payload.email,
        subject: "Your GlowSuite booking is confirmed",
        html: bookingConfirmedEmail(payload),
      };

    case "BOOKING_CANCELLED_EMAIL":
      return {
        to: payload.email,
        subject: "Your GlowSuite booking was cancelled",
        html: bookingCancelledEmail(payload),
      };

    case "CLASS_ENROLLMENT_EMAIL":
      return {
        to: payload.email,
        subject: "Your GlowSuite class enrollment is confirmed",
        html: classEnrollmentEmail(payload),
      };

    case "BOOKING_REMINDER_EMAIL":
      return {
        to: payload.email,
        subject: "Reminder: your GlowSuite appointment is coming up",
        html: reminderEmail(payload),
      };

    default:
      throw new Error(`Unknown outbox event type: ${type}`);
  }
};

/**
 * Process ONE outbox event
 */
export const processEmailOutbox = async () => {
  // lock one event (prevents double processing)
  const event = await OutboxEvent.findOneAndUpdate(
    { status: "pending" },
    { status: "processing" },
    {
      sort: { createdAt: 1 },
      returnDocument: "after",
    },
  );

  if (!event) return;

  try {
    const email = buildEmail(event);

    await sendEmail(email);

    event.status = "processed";
    event.processedAt = new Date();

    await event.save();

    console.log(`✅ Email sent: ${event.type} | ${event._id}`);
  } catch (error) {
    event.attempts += 1;
    event.lastError = error.message;

    if (event.attempts >= event.maxAttempts) {
      event.status = "failed";

      // move to dead letter queue
      await DeadLetterEvent.create({
        originalEventId: event._id,
        type: event.type,
        payload: event.payload,
        attempts: event.attempts,
        error: error.message,
      });

      console.error(`💀 Moved to DLQ: ${event._id}`);
    } else {
      event.status = "pending";
      console.warn(`🔁 Retry scheduled: ${event._id}`);
    }

    await event.save();
  }
};

/**
 * Worker loop
 */
export const startEmailWorker = () => {
  console.log("📧 Email worker started");

  setInterval(async () => {
    try {
      await processEmailOutbox();
    } catch (error) {
      console.error("❌ Worker crash:", error.message);
    }
  }, 10000); // every 10 sec
};
