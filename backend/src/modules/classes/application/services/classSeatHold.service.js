import ClassSeatHoldModel from "../../infrastructure/mongoose/ClassSeatHoldModel.js";
import ClassModel from "../../infrastructure/mongoose/ClassModel.js";

const HOLD_MINUTES = 10;

export async function holdClassSeat({ classId, userId }) {
  const classItem = await ClassModel.findById(classId);

  if (!classItem) {
    const error = new Error("Class not found");
    error.statusCode = 404;
    throw error;
  }

  const availableSeats =
    Number(classItem.capacity || 0) - Number(classItem.enrolledCount || 0);

  if (availableSeats <= 0) {
    const error = new Error("Class is full");
    error.statusCode = 409;
    throw error;
  }

  const existingHold = await ClassSeatHoldModel.findOne({
    user: userId,
    classItem: classId,
    status: "active",
    expiresAt: { $gt: new Date() },
  });

  if (existingHold) {
    return existingHold;
  }

  const expiresAt = new Date(Date.now() + HOLD_MINUTES * 60 * 1000);

  return ClassSeatHoldModel.create({
    user: userId,
    classItem: classId,
    status: "active",
    expiresAt,
  });
}

export async function releaseClassSeatHold({ holdId, userId }) {
  const hold = await ClassSeatHoldModel.findOneAndUpdate(
    {
      _id: holdId,
      user: userId,
      status: "active",
    },
    {
      status: "released",
    },
    {
      new: true,
    },
  );

  if (!hold) {
    const error = new Error("Seat hold not found");
    error.statusCode = 404;
    throw error;
  }

  return hold;
}

export async function getClassSeatHold(holdId) {
  const hold = await ClassSeatHoldModel.findById(holdId);

  if (!hold) {
    const error = new Error("Seat hold not found");
    error.statusCode = 404;
    throw error;
  }

  return hold;
}

export async function convertClassSeatHold({ holdId, enrollmentId }) {
  const hold = await ClassSeatHoldModel.findOneAndUpdate(
    {
      _id: holdId,
      status: "active",
      expiresAt: { $gt: new Date() },
    },
    {
      status: "converted",
      enrollment: enrollmentId,
    },
    {
      new: true,
    },
  );

  if (!hold) {
    const error = new Error("Active seat hold not found or expired");
    error.statusCode = 404;
    throw error;
  }

  return hold;
}
