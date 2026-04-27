import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const users = [
  {
    firstName: "Admin",
    lastName: "User",
    email: "admin@glowsuite.com",
    role: "admin",
  },
  {
    firstName: "Emma",
    lastName: "Hayes",
    email: "emma.hayes@glowsuite.com",
    role: "instructor",
  },
  {
    firstName: "Mia",
    lastName: "Carter",
    email: "mia.carter@glowsuite.com",
    role: "stylist",
  },
  {
    firstName: "Customer",
    lastName: "Demo",
    email: "customer@glowsuite.com",
    role: "customer",
  },
];

async function seedTestUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const password = await bcrypt.hash("Password123!", 10);

    for (const user of users) {
      await User.findOneAndUpdate(
        { email: user.email },
        {
          ...user,
          fullName: `${user.firstName} ${user.lastName}`,
          phone: "5120000000",
          password,
        },
        { upsert: true, new: true },
      );

      console.log(`✅ Seeded ${user.role}: ${user.email}`);
    }

    console.log("🎉 Done");
    console.log("Password for all: Password123!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
}

seedTestUsers();
