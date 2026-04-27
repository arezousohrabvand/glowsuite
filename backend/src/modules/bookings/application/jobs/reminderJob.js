import cron from "node-cron";
import Booking from "../../infrastructure/mongoose/booking.model.js";
import { createOutboxEmail } from "../services/outboxService.js";

export const startReminderJob = () => {
  cron.schedule("0 */1 * * *", async () => {
    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const bookings = await Booking.find({
      status: "Confirmed",
      reminderEmailQueued: { $ne: true },
      slotStart: {
        $gte: now,
        $lte: next24Hours,
      },
    })
      .populate("user")
      .populate("service")
      .populate("stylist");

    for (const booking of bookings) {
      await createOutboxEmail({
        type: "BOOKING_REMINDER_EMAIL",
        recipientEmail: booking.user.email,
        subject: "Reminder: Your GlowSuite appointment is tomorrow",
        payload: {
          customerName: booking.user.firstName,
          serviceName: booking.serviceName || booking.service?.name,
          stylistName: booking.stylistName || booking.stylist?.firstName,
          date: booking.date,
          time: booking.time,
        },
      });

      booking.reminderEmailQueued = true;
      await booking.save();
    }
  });

  console.log("Reminder job started");
};
