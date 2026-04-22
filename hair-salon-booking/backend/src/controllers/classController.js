import mongoose from "mongoose";
import Class from "../models/Class.js";
import Enrollment from "../models/Enrollment.js";

console.log("LOADED classController");

// GET /api/classes
export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find().sort({ createdAt: -1 });

    const mappedClasses = classes.map((item) => {
      const classObj = item.toObject();
      return {
        ...classObj,
        seatsLeft: Math.max(
          (classObj.capacity || 0) - (classObj.enrolledCount || 0),
          0,
        ),
      };
    });

    res.json(mappedClasses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/classes/:id
export const getClassById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid class id" });
    }

    const classItem = await Class.findById(id);

    if (!classItem) {
      return res.status(404).json({ message: "Class not found" });
    }

    const classObj = classItem.toObject();

    res.json({
      ...classObj,
      seatsLeft: Math.max(
        (classObj.capacity || 0) - (classObj.enrolledCount || 0),
        0,
      ),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/classes/my-enrollments
export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ customer: req.user._id })
      .populate("classItem")
      .sort({ createdAt: -1 });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
