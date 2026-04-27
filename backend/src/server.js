import "dotenv/config";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";

import app from "./app.js";
import connectDB from "./shared/config/db.js";
import { setIo } from "./socket.js";

import ClassSeatHold from "./models/ClassSeatHold.js";
import ClassModel from "./models/Class.js";

import { startEmailWorker } from "./workers/emailWorker.js";
import { startReminderCron } from "./workers/reminderCron.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", process.env.CLIENT_URL].filter(Boolean),
    credentials: true,
  },
});

setIo(io);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-class-room", (classId) => {
    if (!classId) return;
    socket.join(`class:${classId}`);
    console.log(`Socket ${socket.id} joined class:${classId}`);
  });

  socket.on("leave-class-room", (classId) => {
    if (!classId) return;
    socket.leave(`class:${classId}`);
    console.log(`Socket ${socket.id} left class:${classId}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

async function expireClassSeatHolds() {
  if (mongoose.connection.readyState !== 1) {
    console.log("Mongo not ready, skipping expireClassSeatHolds");
    return;
  }

  const now = new Date();

  const expiredHolds = await ClassSeatHold.find({
    status: "active",
    expiresAt: { $lte: now },
  });

  if (!expiredHolds.length) return;

  for (const hold of expiredHolds) {
    hold.status = "expired";
    await hold.save();
  }

  for (const hold of expiredHolds) {
    const classItem = await ClassModel.findById(hold.classItem);
    if (!classItem) continue;

    io.to(`class:${hold.classItem}`).emit("class-seat-update", {
      classId: String(hold.classItem),
      enrolledCount: classItem.enrolledCount || 0,
      activeHoldsReleased: true,
    });
  }

  console.log(`Expired ${expiredHolds.length} class seat holds`);
}

let isExpiringClassSeatHolds = false;

function startClassSeatHoldInterval() {
  setInterval(async () => {
    if (isExpiringClassSeatHolds) return;

    try {
      isExpiringClassSeatHolds = true;
      await expireClassSeatHolds();
    } catch (err) {
      console.error("expireClassSeatHolds error:", err.message);
    } finally {
      isExpiringClassSeatHolds = false;
    }
  }, 15000);

  console.log("Class seat hold interval started");
}

async function startServer() {
  try {
    await connectDB();

    startClassSeatHoldInterval();
    startEmailWorker();
    startReminderCron();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(
        "💳 Stripe loaded:",
        process.env.STRIPE_SECRET_KEY ? "YES" : "NO",
      );
      console.log(
        "🪝 Stripe webhook secret loaded:",
        process.env.STRIPE_WEBHOOK_SECRET ? "YES" : "NO",
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
