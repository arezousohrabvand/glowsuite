import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const stylists = [
  {
    firstName: "Charlotte",
    lastName: "Kim",
    email: "charlotte.kim@glowsuite.com",
    password: "Stylist123!",
    role: "stylist",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
  },
  {
    firstName: "Mia",
    lastName: "Carter",
    email: "mia.carter@glowsuite.com",
    password: "Stylist123!",
    role: "stylist",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
  },
  {
    firstName: "Sophia",
    lastName: "Bennett",
    email: "sophia.bennett@glowsuite.com",
    password: "Stylist123!",
    role: "stylist",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
  },
  {
    firstName: "Olivia",
    lastName: "Reed",
    email: "olivia.reed@glowsuite.com",
    password: "Stylist123!",
    role: "stylist",
    image:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=80",
  },
  {
    firstName: "Isabella",
    lastName: "Moore",
    email: "isabella.moore@glowsuite.com",
    password: "Stylist123!",
    role: "stylist",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
  },
];

async function seedStylists() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    for (const stylist of stylists) {
      const existing = await User.findOne({ email: stylist.email });

      if (existing) {
        existing.firstName = stylist.firstName;
        existing.lastName = stylist.lastName;
        existing.role = "stylist";
        existing.image = stylist.image;
        await existing.save();
        console.log(
          `Updated stylist: ${stylist.firstName} ${stylist.lastName}`,
        );
      } else {
        const hashedPassword = await bcrypt.hash(stylist.password, 10);

        await User.create({
          ...stylist,
          password: hashedPassword,
        });

        console.log(
          `Created stylist: ${stylist.firstName} ${stylist.lastName}`,
        );
      }
    }

    console.log("Stylist seed complete");
    process.exit(0);
  } catch (error) {
    console.error("Seed stylists error:", error);
    process.exit(1);
  }
}

seedStylists();
