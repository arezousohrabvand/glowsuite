import "dotenv/config";
import mongoose from "mongoose";
import ClassModel from "../models/Class.js";

const classes = [
  {
    title: "Hair Coloring Masterclass",
    description:
      "Learn professional color theory, glossing, toning, and salon-safe color techniques.",
    date: new Date("2026-05-10"),
    time: "10:00 AM",
    capacity: 12,
    price: 150,
    category: "Color",
    level: "Intermediate",
    duration: "3 hours",
    instructorName: "Sophia Bennett",
    image:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80",
    tags: ["Color", "Toning", "Gloss"],
  },
  {
    title: "Luxury Blowout Styling Workshop",
    description:
      "Practice salon-quality blowouts, soft waves, volume control, and finishing techniques.",
    date: new Date("2026-05-15"),
    time: "1:00 PM",
    capacity: 10,
    price: 95,
    category: "Styling",
    level: "Beginner",
    duration: "2 hours",
    instructorName: "Mia Carter",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
    tags: ["Blowout", "Styling", "Waves"],
  },
  {
    title: "Salon Business Growth Masterclass",
    description:
      "Learn pricing, client retention, booking strategy, and salon service packaging.",
    date: new Date("2026-05-20"),
    time: "11:00 AM",
    capacity: 20,
    price: 200,
    category: "Business",
    level: "Advanced",
    duration: "4 hours",
    instructorName: "Emma Hayes",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    tags: ["Business", "Growth", "Pricing"],
  },
];

async function seedClasses() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await ClassModel.deleteMany({});

    await ClassModel.insertMany(classes);

    console.log("✅ Classes seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed classes error:", error);
    process.exit(1);
  }
}

seedClasses();
