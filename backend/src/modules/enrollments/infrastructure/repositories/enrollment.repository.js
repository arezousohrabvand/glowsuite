import Enrollment from "../mongoose/EnrollmentModel.js";

export const enrollmentRepository = {
  create(data) {
    return Enrollment.create(data);
  },

  findById(id) {
    return Enrollment.findById(id);
  },

  findByIdPopulated(id) {
    return Enrollment.findById(id).populate("customer").populate("classItem");
  },

  findExistingActiveEnrollment({ customerId, classId }) {
    return Enrollment.findOne({
      customer: customerId,
      classItem: classId,
      status: { $in: ["pending", "paid"] },
    });
  },

  findMyEnrollments(customerId) {
    return Enrollment.find({ customer: customerId })
      .populate("classItem")
      .sort({ createdAt: -1 });
  },

  findAllAdmin() {
    return Enrollment.find()
      .populate("customer")
      .populate("classItem")
      .sort({ createdAt: -1 });
  },

  markPaidById(id) {
    return Enrollment.findByIdAndUpdate(
      id,
      {
        $set: {
          status: "paid",
          paymentStatus: "paid",
          paidAt: new Date(),
        },
      },
      { returnDocument: "after", runValidators: false },
    )
      .populate("customer")
      .populate("classItem");
  },

  cancelById(id) {
    return Enrollment.findByIdAndUpdate(
      id,
      {
        $set: {
          status: "cancelled",
        },
      },
      { returnDocument: "after" },
    )
      .populate("customer")
      .populate("classItem");
  },

  save(enrollment) {
    return enrollment.save();
  },
};
