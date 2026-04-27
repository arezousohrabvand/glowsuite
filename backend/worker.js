import dotenv from "dotenv";
import mongoose from "mongoose";
import { startEmailWorker } from "./src/workers/emailWorker.js";

dotenv.config();

const startWorker = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Worker connected to MongoDB");

    startEmailWorker();

    console.log("✅ Email worker running");
  } catch (error) {
    console.error("❌ Worker failed:", error);
    process.exit(1);
  }
};

startWorker();
