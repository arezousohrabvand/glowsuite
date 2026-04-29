import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["customer", "admin", "stylist", "instructor"],
      default: "customer",
      index: true, // ⚡ admin filters (very important)
    },
  },
  { timestamps: true },
);

// admin dashboard → filter users by role + sort by newest
userSchema.index({ role: 1, createdAt: -1 });

// search users by name
userSchema.index({ firstName: 1, lastName: 1 });

userSchema.index({ email: 1 }, { collation: { locale: "en", strength: 2 } });

export default mongoose.models.User || mongoose.model("User", userSchema);
