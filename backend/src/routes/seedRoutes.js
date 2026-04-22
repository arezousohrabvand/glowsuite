import express from "express";
import Class from "../models/Class.js";

const router = express.Router();

router.post("/classes", async (req, res) => {
  try {
    await Class.deleteMany({});

    const created = await Class.insertMany([
      {
        title: "Hair Coloring Masterclass",
        description:
          "Learn advanced coloring, tone correction, and salon-safe product usage.",
        price: 150,
        capacity: 12,
        enrolledCount: 0,
        category: "Color",
        level: "Beginner",
        instructorName: "Emma Smith",
        role: "Senior Color Specialist",
        date: "May 10, 2026",
        time: "2:00 PM",
        duration: "2 hours",
        image:
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop",
        featured: true,
        tags: ["Color", "Hands-on", "Salon Skills"],
        isActive: true,
      },
      {
        title: "Bridal Hair Styling Workshop",
        description:
          "Practice elegant bridal styles, pinning techniques, and long-lasting finish methods.",
        price: 180,
        capacity: 10,
        enrolledCount: 0,
        category: "Styling",
        level: "Intermediate",
        instructorName: "Sophia Lee",
        role: "Bridal Stylist",
        date: "May 18, 2026",
        time: "11:00 AM",
        duration: "3 hours",
        image:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop",
        featured: false,
        tags: ["Bridal", "Styling", "Premium"],
        isActive: true,
      },
    ]);

    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
