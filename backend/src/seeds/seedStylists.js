import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const stylists = [
  ["Charlotte", "Kim", "charlotte.kim@glowsuite.com"],
  ["Sophia", "Bennett", "sophia.bennett@glowsuite.com"],
  ["Mia", "Carter", "mia.carter@glowsuite.com"],
  ["Olivia", "Reed", "olivia.reed@glowsuite.com"],
  ["Ava", "Martinez", "ava.martinez@glowsuite.com"],
  ["Isabella", "Moore", "isabella.moore@glowsuite.com"],
  ["Emma", "Hayes", "emma.hayes@glowsuite.com"],
];

async function seedStylists() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const password = await bcrypt.hash("Stylist123!", 10);

    for (const [firstName, lastName, email] of stylists) {
      await User.findOneAndUpdate(
        { email },
        {
          firstName,
          lastName,
          email,
          password,
          role: "stylist",
        },
        { upsert: true, new: true },
      );

      console.log(`✅ Seeded stylist: ${firstName} ${lastName}`);
    }

    console.log("🎉 Done seeding stylists");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
}

seedStylists();
