import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
import Class from "../models/Class.js";
import Enrollment from "../models/Enrollment.js";
import Billing from "../models/Billing.js";

export async function getAdminStats(req, res) {
  try {
    const now = new Date();

    const statsPromise = Promise.all([
      User.countDocuments(),
      Booking.countDocuments(),
      Service.countDocuments(),
      Booking.countDocuments({ status: "Pending" }),
      Booking.countDocuments({ status: "Upcoming" }),
      Booking.countDocuments({ status: "Confirmed" }),
      Booking.countDocuments({ status: "Completed" }),
      Booking.countDocuments({ status: "Cancelled" }),
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "stylist" }),
      User.countDocuments({ role: "instructor" }),
      User.countDocuments({ role: "admin" }),

      Booking.find()
        .populate("user", "firstName lastName")
        .populate("service", "name")
        .populate("stylist", "firstName lastName")
        .sort({ createdAt: -1 })
        .limit(5),

      User.find({ role: "customer" })
        .select("firstName lastName email role")
        .sort({ createdAt: -1 })
        .limit(5),

      Billing.find().sort({ createdAt: -1 }).limit(5),

      Booking.find({
        status: { $in: ["Upcoming", "Confirmed"] },
        slotStart: { $exists: true, $gte: now },
      })
        .populate("user", "firstName lastName")
        .populate("service", "name")
        .populate("stylist", "firstName lastName")
        .sort({ slotStart: 1 })
        .limit(8),
    ]);

    const [
      totalUsers,
      totalBookings,
      totalServices,
      pendingBookings,
      upcomingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalCustomers,
      totalStylists,
      totalInstructors,
      totalAdmins,
      recentBookings,
      recentCustomers,
      recentBilling,
      upcomingBookingsList,
    ] = await statsPromise;

    return res.json({
      totalUsers,
      totalBookings,
      totalServices,
      pendingBookings,
      upcomingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalCustomers,
      totalStylists,
      totalInstructors,
      totalAdmins,
      recentBookings,
      recentCustomers,
      recentBilling,
      upcomingBookingsList,
    });
  } catch (error) {
    console.error("getAdminStats error:", error);
    return res.status(500).json({ message: "Failed to load admin stats" });
  }
}

// =========================
// BOOKINGS
// =========================
export async function getAllBookings(req, res) {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate("user", "firstName lastName email")
      .populate("stylist", "firstName lastName email")
      .populate("service", "name price duration category")
      .sort({ slotStart: -1, createdAt: -1 });

    return res.json(bookings);
  } catch (error) {
    console.error("getAllBookings error:", error);
    return res.status(500).json({ message: "Failed to load bookings" });
  }
}

export async function updateBookingStatus(req, res) {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Upcoming",
      "Confirmed",
      "Completed",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid booking status" });
    }

    const booking = await Booking.findById(bookingId).select("status");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const currentStatus = booking.status;

    const validTransitions = {
      Pending: ["Confirmed", "Cancelled", "Upcoming"],
      Upcoming: ["Confirmed", "Cancelled", "Completed"],
      Confirmed: ["Completed", "Cancelled"],
      Completed: [],
      Cancelled: [],
    };

    if (
      currentStatus &&
      validTransitions[currentStatus] &&
      !validTransitions[currentStatus].includes(status) &&
      currentStatus !== status
    ) {
      return res.status(400).json({
        message: `Cannot change booking from ${currentStatus} to ${status}`,
      });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { $set: { status } },
      { new: true },
    )
      .populate("user", "firstName lastName email")
      .populate("stylist", "firstName lastName email")
      .populate("service", "name price duration category");

    return res.json({
      message: `Booking updated to ${status}`,
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("updateBookingStatus error:", error);
    return res.status(500).json({ message: "Failed to update booking status" });
  }
}

// =========================
// SERVICES
// =========================
export async function getAllServices(req, res) {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    return res.json(services);
  } catch (error) {
    console.error("getAllServices error:", error);
    return res.status(500).json({ message: "Failed to load services" });
  }
}

export async function createServiceByAdmin(req, res) {
  try {
    const { name, category, price, duration, description } = req.body;

    if (!name || price === undefined || price === null || Number(price) < 0) {
      return res.status(400).json({
        message: "Valid name and price are required",
      });
    }

    const service = await Service.create({
      name: String(name).trim(),
      category: category ? String(category).trim() : "",
      price: Number(price),
      duration: duration ? Number(duration) : 60,
      description: description ? String(description).trim() : "",
    });

    return res.status(201).json({
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("createServiceByAdmin error:", error);
    return res.status(500).json({ message: "Failed to create service" });
  }
}

export async function updateServiceByAdmin(req, res) {
  try {
    const { serviceId } = req.params;
    const { name, category, price, duration, description } = req.body;

    if (!name || price === undefined || price === null || Number(price) < 0) {
      return res.status(400).json({
        message: "Valid name and price are required",
      });
    }

    const service = await Service.findByIdAndUpdate(
      serviceId,
      {
        name: String(name).trim(),
        category: category ? String(category).trim() : "",
        price: Number(price),
        duration: duration ? Number(duration) : 60,
        description: description ? String(description).trim() : "",
      },
      { new: true, runValidators: true },
    );

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.json({
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error("updateServiceByAdmin error:", error);
    return res.status(500).json({ message: "Failed to update service" });
  }
}

export async function deleteServiceByAdmin(req, res) {
  try {
    const { serviceId } = req.params;

    const service = await Service.findByIdAndDelete(serviceId);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("deleteServiceByAdmin error:", error);
    return res.status(500).json({ message: "Failed to delete service" });
  }
}

// =========================
// USERS
// =========================
export async function getAllUsers(req, res) {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    console.error("getAllUsers error:", error);
    return res.status(500).json({ message: "Failed to load users" });
  }
}

export async function updateUserRole(req, res) {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const allowedRoles = ["customer", "admin", "stylist", "instructor"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (String(req.user._id) === String(userId) && role !== "admin") {
      return res.status(400).json({
        message: "You cannot remove your own admin role",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: `User role updated to ${role}`,
      user,
    });
  } catch (error) {
    console.error("updateUserRole error:", error);
    return res.status(500).json({ message: "Failed to update user role" });
  }
}

// =========================
// CALENDAR
// =========================
export async function getAdminCalendar(req, res) {
  try {
    const { view = "month", date } = req.query;

    const selectedDate = date ? new Date(date) : new Date();

    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date" });
    }

    let startDate;
    let endDate;

    if (view === "day") {
      startDate = new Date(selectedDate);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(selectedDate);
      endDate.setHours(23, 59, 59, 999);
    } else if (view === "week") {
      const day = selectedDate.getDay();
      const diff = day === 0 ? -6 : 1 - day;

      startDate = new Date(selectedDate);
      startDate.setDate(selectedDate.getDate() + diff);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else {
      startDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1,
      );
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0,
      );
      endDate.setHours(23, 59, 59, 999);
    }

    const bookings = await Booking.find({
      $or: [
        {
          slotStart: {
            $gte: startDate,
            $lte: endDate,
          },
        },
        {
          slotStart: { $exists: false },
          date: { $exists: true },
        },
      ],
    })
      .populate("user", "firstName lastName email")
      .populate("stylist", "firstName lastName email")
      .populate("service", "name price duration")
      .sort({ slotStart: 1, createdAt: 1 });

    const filteredBookings = bookings.filter((booking) => {
      if (booking.slotStart) {
        const slotDate = new Date(booking.slotStart);
        return slotDate >= startDate && slotDate <= endDate;
      }

      if (booking.date) {
        const bookingDate = new Date(booking.date);
        if (!Number.isNaN(bookingDate.getTime())) {
          bookingDate.setHours(12, 0, 0, 0);
          return bookingDate >= startDate && bookingDate <= endDate;
        }
      }

      return false;
    });

    return res.json({
      view,
      date: selectedDate,
      startDate,
      endDate,
      bookings: filteredBookings,
    });
  } catch (error) {
    console.error("getAdminCalendar error:", error);
    return res.status(500).json({ message: "Failed to load admin calendar" });
  }
}

// =========================
// CUSTOMERS
// =========================
export async function getAdminCustomers(req, res) {
  try {
    const { search = "" } = req.query;

    const filter = { role: "customer" };

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const customers = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    const customerIds = customers.map((c) => c._id);

    const bookings = await Booking.find({
      user: { $in: customerIds },
    }).select("user price");

    const bookingSummary = {};

    for (const booking of bookings) {
      const key = String(booking.user);
      if (!bookingSummary[key]) {
        bookingSummary[key] = {
          totalBookings: 0,
          totalSpend: 0,
        };
      }

      bookingSummary[key].totalBookings += 1;
      bookingSummary[key].totalSpend += Number(booking.price || 0);
    }

    const result = customers.map((customer) => {
      const summary = bookingSummary[String(customer._id)] || {
        totalBookings: 0,
        totalSpend: 0,
      };

      return {
        ...customer.toObject(),
        totalBookings: summary.totalBookings,
        totalSpend: summary.totalSpend,
      };
    });

    return res.json(result);
  } catch (error) {
    console.error("getAdminCustomers error:", error);
    return res.status(500).json({ message: "Failed to load customers" });
  }
}

export async function getAdminCustomerDetails(req, res) {
  try {
    const { customerId } = req.params;

    const customer = await User.findOne({
      _id: customerId,
      role: "customer",
    }).select("-password");

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const bookings = await Booking.find({ user: customerId })
      .populate("service", "name price duration")
      .sort({ createdAt: -1 });

    const totalSpend = bookings.reduce(
      (sum, item) => sum + Number(item.price || 0),
      0,
    );

    return res.json({
      customer,
      totalBookings: bookings.length,
      totalSpend,
      bookings,
    });
  } catch (error) {
    console.error("getAdminCustomerDetails error:", error);
    return res.status(500).json({ message: "Failed to load customer details" });
  }
}

// =========================
// CLASSES
// =========================
export async function getAdminClasses(req, res) {
  try {
    const classes = await Class.find()
      .populate("instructor", "firstName lastName email")
      .sort({ createdAt: -1 });

    const classIds = classes.map((item) => item._id);

    const enrollments = await Enrollment.find({
      class: { $in: classIds },
    }).select("class");

    const enrollmentCountMap = {};

    for (const enrollment of enrollments) {
      const key = String(enrollment.class);
      enrollmentCountMap[key] = (enrollmentCountMap[key] || 0) + 1;
    }

    const result = classes.map((item) => ({
      ...item.toObject(),
      enrolledCount: enrollmentCountMap[String(item._id)] || 0,
    }));

    return res.json(result);
  } catch (error) {
    console.error("getAdminClasses error:", error);
    return res.status(500).json({ message: "Failed to load classes" });
  }
}

export async function createAdminClass(req, res) {
  try {
    const { title, description, instructor, date, time, capacity, price } =
      req.body;

    if (!title || !date || !time || price === undefined) {
      return res.status(400).json({
        message: "Title, date, time, and price are required",
      });
    }

    const newClass = await Class.create({
      title: String(title).trim(),
      description: description ? String(description).trim() : "",
      instructor: instructor || null,
      date,
      time,
      capacity: capacity ? Number(capacity) : 10,
      price: Number(price),
    });

    return res.status(201).json({
      message: "Class created successfully",
      classItem: newClass,
    });
  } catch (error) {
    console.error("createAdminClass error:", error);
    return res.status(500).json({ message: "Failed to create class" });
  }
}

export async function updateAdminClass(req, res) {
  try {
    const { classId } = req.params;
    const { title, description, instructor, date, time, capacity, price } =
      req.body;

    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      {
        title: String(title).trim(),
        description: description ? String(description).trim() : "",
        instructor: instructor || null,
        date,
        time,
        capacity: capacity ? Number(capacity) : 10,
        price: Number(price),
      },
      { new: true, runValidators: true },
    );

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    return res.json({
      message: "Class updated successfully",
      classItem: updatedClass,
    });
  } catch (error) {
    console.error("updateAdminClass error:", error);
    return res.status(500).json({ message: "Failed to update class" });
  }
}

export async function deleteAdminClass(req, res) {
  try {
    const { classId } = req.params;

    const classItem = await Class.findByIdAndDelete(classId);

    if (!classItem) {
      return res.status(404).json({ message: "Class not found" });
    }

    await Enrollment.deleteMany({ class: classId });

    return res.json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("deleteAdminClass error:", error);
    return res.status(500).json({ message: "Failed to delete class" });
  }
}

export async function getAdminClassEnrollments(req, res) {
  try {
    const { classId } = req.params;

    const enrollments = await Enrollment.find({ class: classId })
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.json(enrollments);
  } catch (error) {
    console.error("getAdminClassEnrollments error:", error);
    return res
      .status(500)
      .json({ message: "Failed to load class enrollments" });
  }
}
