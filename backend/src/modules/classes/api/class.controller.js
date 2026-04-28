import ClassModel from "../infrastructure/mongoose/ClassModel.js";
import Enrollment from "../../../models/Enrollment.js";
import {
  toClassResponse,
  toClassListResponse,
} from "../contracts/class.mapper.js";

async function addClassCounts(classItem) {
  const enrolledCount = await Enrollment.countDocuments({
    classItem: classItem._id,
    status: { $in: ["pending", "paid"] },
  });

  const capacity = Number(classItem.capacity || 0);

  return {
    ...classItem.toObject(),
    enrolledCount,
  };
}

/* =========================
   PUBLIC: GET ALL CLASSES
========================= */
export const getClasses = async (req, res) => {
  try {
    const classes = await ClassModel.find().sort({ createdAt: -1 });

    const result = await Promise.all(classes.map(addClassCounts));

    res.status(200).json(toClassListResponse(result));
  } catch (error) {
    console.error("getClasses error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   PUBLIC: GET SINGLE CLASS
========================= */
export const getClassById = async (req, res) => {
  try {
    const classItem = await ClassModel.findById(req.params.id);

    if (!classItem) {
      return res.status(404).json({ message: "Class not found" });
    }

    const result = await addClassCounts(classItem);

    res.status(200).json(toClassResponse(result));
  } catch (error) {
    console.error("getClassById error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ADMIN: GET CLASSES
========================= */
export const getAdminClasses = getClasses;

/* =========================
   ADMIN: CREATE CLASS
========================= */
export const createAdminClass = async (req, res) => {
  try {
    const { title, description, date, time, capacity, price } = req.body;

    if (!title || !date || !time || !capacity || price === undefined) {
      return res.status(400).json({
        message: "title, date, time, capacity, and price are required",
      });
    }

    const classItem = await ClassModel.create({
      title: title.trim(),
      description: description || "",
      date,
      time: time.trim(),
      capacity: Number(capacity),
      price: Number(price),
    });

    const result = await addClassCounts(classItem);
    res.status(201).json(toClassResponse(result));
  } catch (error) {
    console.error("createAdminClass error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ADMIN: UPDATE CLASS
========================= */
export const updateAdminClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const payload = {
      title: req.body.title?.trim(),
      description: req.body.description || "",
      date: req.body.date,
      time: req.body.time?.trim(),
      capacity: Number(req.body.capacity),
      price: Number(req.body.price),
    };

    const updatedClass = await ClassModel.findByIdAndUpdate(
      classId,
      { $set: payload },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    const result = await addClassCounts(updatedClass);
    res.status(200).json(toClassResponse(result));
  } catch (error) {
    console.error("updateAdminClass error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ADMIN: DELETE CLASS
========================= */
export const deleteAdminClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const deletedClass = await ClassModel.findByIdAndDelete(classId);

    if (!deletedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    await Enrollment.deleteMany({ classItem: classId });

    res.status(200).json({
      message: "Class deleted successfully",
    });
  } catch (error) {
    console.error("deleteAdminClass error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ADMIN: GET ENROLLMENTS
========================= */
export const getAdminClassEnrollments = async (req, res) => {
  try {
    const { classId } = req.params;

    const enrollments = await Enrollment.find({ classItem: classId })
      .populate("customer", "firstName lastName email")
      .sort({ createdAt: -1 });

    const result = enrollments.map((enrollment) => ({
      ...enrollment.toObject(),
      user: enrollment.customer,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("getAdminClassEnrollments error:", error);
    res.status(500).json({ message: error.message });
  }
};
