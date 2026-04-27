import cron from "node-cron";
import Booking from "../models/Booking.js";
import { createOutboxEvent } from "../utils/createOutboxEvent.js";

export const startReminderCron = () => {
  console.log("Reminder cron started");

  cron.schedule("*/15 * * * *", async () => {
    try {
      const now = new Date();
      const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const bookings = await Booking.find({
        status: "Confirmed",
        reminderEmailSent: false,
        slotStart: {
          $gte: now,
          $lte: next24Hours,
        },
      })
        .populate("user")
        .populate("service")
        .populate("stylist");

      for (const booking of bookings) {
        await createOutboxEvent({
          type: "BOOKING_REMINDER_EMAIL",
          payload: {
            email: booking.user.email,
            customerName: `${booking.user.firstName} ${booking.user.lastName}`,
            serviceName: booking.serviceName || booking.service?.name,
            stylistName:
              booking.stylistName ||
              `${booking.stylist.firstName} ${booking.stylist.lastName}`,
            date: booking.date,
            time: booking.time,
          },
        });

        booking.reminderEmailSent = true;
        await booking.save();
      }

      if (bookings.length > 0) {
        console.log(`${bookings.length} reminder email events queued`);
      }
    } catch (error) {
      console.error("Reminder cron error:", error.message);
    }
  });
};
