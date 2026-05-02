import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    price: { type: Number, required: true, min: 0 },
    duration: { type: Number, default: 60, min: 1 },
    category: { type: String, default: "", trim: true },
    image: { type: String, default: "" },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema);

export default Service;
