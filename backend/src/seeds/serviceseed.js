import mongoose from "mongoose";
import dotenv from "dotenv";
import Service from "../models/Service.js";

dotenv.config();

const services = [
  {
    name: "Signature Haircut & Finish",
    category: "Cuts",
    price: 75,
    duration: 60,
    description:
      "A precision haircut tailored to your face shape, texture, and styling goals, finished with a polished salon blowout.",
  },
  {
    name: "Luxury Blowout & Style",
    category: "Styling",
    price: 55,
    duration: 45,
    description:
      "Smooth, voluminous, and long-lasting blowout styling for everyday polish or special events.",
  },
  {
    name: "Signature Balayage",
    category: "Color",
    price: 220,
    duration: 180,
    description:
      "Soft blended dimension with a luxury lived-in finish, customized to your tone, depth, and maintenance preference.",
  },
  {
    name: "Bridal Hair & Preview",
    category: "Bridal",
    price: 140,
    duration: 90,
    description:
      "Elegant bridal styling with preview planning, secure structure, and a photo-ready luxury finish.",
  },
  {
    name: "Curl Definition Treatment",
    category: "Texture",
    price: 95,
    duration: 75,
    description:
      "Hydrating curl-focused treatment and styling service designed to reduce frizz and enhance natural definition.",
  },
  {
    name: "Keratin Smoothing Service",
    category: "Treatment",
    price: 250,
    duration: 150,
    description:
      "A smoothing treatment for softness, shine, and easier styling with reduced frizz and polished movement.",
  },
  {
    name: "Scalp Reset & Repair",
    category: "Wellness",
    price: 65,
    duration: 50,
    description:
      "A restorative scalp and hair wellness service focused on hydration, balance, and healthier roots.",
  },
  {
    name: "Face-Framing & Fringe Refresh",
    category: "Cuts",
    price: 35,
    duration: 30,
    description:
      "A quick refresh service for bangs, face-framing pieces, and shape detailing between full haircuts.",
  },
  {
    name: "Gloss & Tone Refresh",
    category: "Color",
    price: 70,
    duration: 45,
    description:
      "Refresh shine, neutralize tone, and revive your color with a customized gloss service.",
  },
  {
    name: "Editorial Waves Styling",
    category: "Styling",
    price: 65,
    duration: 50,
    description:
      "Soft glam waves with movement, polish, and an editorial-inspired finish for events or content days.",
  },
  {
    name: "Bridal Party Styling",
    category: "Bridal",
    price: 120,
    duration: 120,
    description:
      "Coordinated event styling for bridal parties with polished looks, timing support, and elegant finishing.",
  },
  {
    name: "Deep Repair Mask & Blowdry",
    category: "Treatment",
    price: 80,
    duration: 55,
    description:
      "A nourishing treatment mask paired with a smooth blowdry to restore softness, shine, and manageability.",
  },
];

const seedServices = async () => {
  try {
    console.log("MONGO_URI:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected DB:", mongoose.connection.name);

    const deleted = await Service.deleteMany({});
    console.log("Deleted count:", deleted.deletedCount);

    const inserted = await Service.insertMany(services);
    console.log("Inserted count:", inserted.length);

    const all = await Service.find().select("name category price");
    console.log("Services now in DB:", all);

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedServices();
