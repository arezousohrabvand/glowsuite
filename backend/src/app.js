import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/api/auth.routes.js";
import classRoutes from "./modules/classes/api/class.routes.js";
import userRoutes from "./modules/users/api/user.routes.js";
import bookingRoutes from "./modules/bookings/api/booking.routes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import seedRoutes from "./routes/seedRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import stripeRoutes from "./routes/stripeRoutes.js";
import stylistRoutes from "./routes/stylistRoutes.js";
import instructorRoutes from "./routes/instructorRoutes.js";
import serviceRoutes from "./modules/services/api/service.routes.js";
import profileRoutes from "./modules/users/api/profile.routes.js";

import { stripeWebhookHandler } from "./controllers/paymentController.js";

import { notFound, errorHandler } from "./shared/middleware/errorMiddleware.js";

const app = express();

// CORS
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_URL].filter(Boolean),
    credentials: true,
  }),
);

// ✅ Stripe webhook BEFORE json middleware
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler,
);

// Normal middleware
app.use(express.json());

// ✅ Health routes
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "GlowSuite API is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.send("GlowSuite API is running...");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/seed", seedRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/stylist", stylistRoutes);
app.use("/api/instructor", instructorRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/profile", profileRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
