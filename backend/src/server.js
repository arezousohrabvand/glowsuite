import "dotenv/config";
import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import connectDB from "./config/db.js";
import { setIo } from "./socket.js";
import ClassSeatHold from "./models/ClassSeatHold.js";
import ClassModel from "./models/Class.js";

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
}

async function startServer() {
  try {
    await connectDB();

    setInterval(() => {
      expireClassSeatHolds().catch((err) => {
        console.error("expireClassSeatHolds error:", err);
      });
    }, 15000);

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
