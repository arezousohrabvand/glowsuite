import express from "express";
import cors from "cors";

import classRoutes from "./routes/classRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import seedRoutes from "./routes/seedRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import stripeRoutes from "./routes/stripeRoutes.js";
import stylistRoutes from "./routes/stylistRoutes.js";
import instructorRoutes from "./routes/instructorRoutes.js";

import { stripeWebhookHandler } from "./controllers/paymentController.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_URL].filter(Boolean),
    credentials: true,
  }),
);

// Stripe webhook must come before express.json()
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler,
);

// normal middleware
app.use(express.json());

// health route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.get("/", (req, res) => {
  res.send("GlowSuite API is running...");
});

// mount all routes
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

// error handling
app.use(notFound);
app.use(errorHandler);

export default app;
