import mongoose from "mongoose";
import ClassModel from "../models/Class.js";
import Enrollment from "../models/Enrollment.js";

const getUserId = (req) => req.user?._id || req.user?.id;

const toObjectId = (id) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) return null;
  return new mongoose.Types.ObjectId(id);
};

export const getInstructorDashboard = async (req, res) => {
  try {
    const instructorObjectId = toObjectId(getUserId(req));

    if (!instructorObjectId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const assignedClasses = await ClassModel.find({
      instructor: instructorObjectId,
    }).sort({ createdAt: -1 });

    const classIds = assignedClasses.map((item) => item._id);

    const enrollments = await Enrollment.find({
      classItem: { $in: classIds },
    }).populate("customer", "firstName lastName email phone");

    const totalStudents = enrollments.length;

    const revenue = enrollments
      .filter((item) => item.paymentStatus === "paid" || item.status === "paid")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const recentClasses = await Promise.all(
      assignedClasses.slice(0, 6).map(async (classItem) => {
        const classEnrollments = await Enrollment.find({
          classItem: classItem._id,
        }).populate("customer", "firstName lastName email phone");

        return {
          ...classItem.toObject(),
          enrolledCount: classEnrollments.length,
          students: classEnrollments
            .map((item) => item.customer)
            .filter(Boolean),
        };
      }),
    );

    return res.json({
      totalClasses: assignedClasses.length,
      upcomingClasses: assignedClasses.filter((item) => item.isActive).length,
      totalStudents,
      revenue,
      recentClasses,
    });
  } catch (error) {
    console.error("Instructor dashboard error:", error);
    return res.status(500).json({
      message: "Failed to load instructor dashboard",
    });
  }
};

export const getInstructorClasses = async (req, res) => {
  try {
    const instructorObjectId = toObjectId(getUserId(req));

    console.log("DB NAME:", mongoose.connection.name);
    console.log("USER:", req.user);
    console.log("QUERY INSTRUCTOR:", instructorObjectId);

    const allClasses = await ClassModel.find({}).lean();

    console.log(
      "ALL CLASSES:",
      allClasses.map((c) => ({
        _id: c._id,
        title: c.title,
        instructor: c.instructor,
        instructorType: typeof c.instructor,
      })),
    );

    const classes = await ClassModel.find({
      instructor: instructorObjectId,
    }).lean();

    console.log("MATCHED:", classes);

    return res.json(classes);
  } catch (error) {
    console.error("Instructor classes error:", error);
    return res.status(500).json({
      message: "Failed to load instructor classes",
    });
  }
};
export const getInstructorStudents = async (req, res) => {
  try {
    const instructorObjectId = toObjectId(getUserId(req));

    if (!instructorObjectId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const classes = await ClassModel.find({
      instructor: instructorObjectId,
    }).select("_id title date time");

    const classIds = classes.map((item) => item._id);

    const enrollments = await Enrollment.find({
      classItem: { $in: classIds },
    })
      .populate("customer", "firstName lastName email phone")
      .populate("classItem", "title date time price");

    const students = enrollments.map((item) => ({
      _id: item.customer?._id,
      firstName: item.customer?.firstName,
      lastName: item.customer?.lastName,
      email: item.customer?.email,
      phone: item.customer?.phone,
      classTitle: item.classItem?.title,
      classDate: item.classItem?.date,
      classTime: item.classItem?.time,
      amount: item.amount,
      enrollmentStatus: item.status,
      paymentStatus: item.paymentStatus,
    }));

    return res.json(students);
  } catch (error) {
    console.error("Instructor students error:", error);
    return res.status(500).json({
      message: "Failed to load instructor students",
    });
  }
};

export const getInstructorSchedule = async (req, res) => {
  try {
    const instructorObjectId = toObjectId(getUserId(req));

    if (!instructorObjectId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const classes = await ClassModel.find({
      instructor: instructorObjectId,
      isActive: true,
    }).sort({ date: 1, time: 1 });

    return res.json(classes);
  } catch (error) {
    console.error("Instructor schedule error:", error);
    return res.status(500).json({
      message: "Failed to load instructor schedule",
    });
  }
};
