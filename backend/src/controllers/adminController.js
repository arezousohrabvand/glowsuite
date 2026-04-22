import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import User from "../models/User.js";

// =========================
// Dashboard stats
// =========================
export async function getAdminStats(req, res) {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalServices = await Service.countDocuments();

    const pendingBookings = await Booking.countDocuments({ status: "Pending" });
    const upcomingBookings = await Booking.countDocuments({
      status: "Upcoming",
    });
    const confirmedBookings = await Booking.countDocuments({
      status: "Confirmed",
    });
    const completedBookings = await Booking.countDocuments({
      status: "Completed",
    });
    const cancelledBookings = await Booking.countDocuments({
      status: "Cancelled",
    });

    const totalCustomers = await User.countDocuments({ role: "customer" });
    const totalStylists = await User.countDocuments({ role: "stylist" });
    const totalInstructors = await User.countDocuments({ role: "instructor" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    res.json({
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
    });
  } catch (error) {
    console.error("getAdminStats error:", error);
    res.status(500).json({ message: "Failed to load admin stats" });
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
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("getAllBookings error:", error);
    res.status(500).json({ message: "Failed to load bookings" });
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

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    const updatedBooking = await Booking.findById(bookingId)
      .populate("user", "firstName lastName email")
      .populate("stylist", "firstName lastName email")
      .populate("service", "name price duration category");

    res.json({
      message: `Booking updated to ${status}`,
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("updateBookingStatus error:", error);
    res.status(500).json({ message: "Failed to update booking status" });
  }
}

// =========================
// SERVICES
// =========================
export async function getAllServices(req, res) {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    console.error("getAllServices error:", error);
    res.status(500).json({ message: "Failed to load services" });
  }
}

export async function createServiceByAdmin(req, res) {
  try {
    const { name, category, price, duration, description } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const service = await Service.create({
      name,
      category: category || "",
      price: Number(price),
      duration: duration ? Number(duration) : 60,
      description: description || "",
    });

    res.status(201).json({
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("createServiceByAdmin error:", error);
    res.status(500).json({ message: "Failed to create service" });
  }
}

export async function updateServiceByAdmin(req, res) {
  try {
    const { serviceId } = req.params;
    const { name, category, price, duration, description } = req.body;

    const service = await Service.findByIdAndUpdate(
      serviceId,
      {
        name,
        category: category || "",
        price: Number(price),
        duration: duration ? Number(duration) : 60,
        description: description || "",
      },
      { new: true, runValidators: true },
    );

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error("updateServiceByAdmin error:", error);
    res.status(500).json({ message: "Failed to update service" });
  }
}

export async function deleteServiceByAdmin(req, res) {
  try {
    const { serviceId } = req.params;

    const service = await Service.findByIdAndDelete(serviceId);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("deleteServiceByAdmin error:", error);
    res.status(500).json({ message: "Failed to delete service" });
  }
}

// =========================
// USERS
// =========================
export async function getAllUsers(req, res) {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error("getAllUsers error:", error);
    res.status(500).json({ message: "Failed to load users" });
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

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: `User role updated to ${role}`,
      user,
    });
  } catch (error) {
    console.error("updateUserRole error:", error);
    res.status(500).json({ message: "Failed to update user role" });
  }
}

// =========================
// CALENDAR
// =========================
export async function getAdminCalendar(req, res) {
  try {
    const { view = "month", date } = req.query;

    const selectedDate = date ? new Date(date) : new Date();

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
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .populate("user", "firstName lastName email")
      .populate("stylist", "firstName lastName email")
      .populate("service", "name")
      .sort({ createdAt: 1 });

    res.json({
      view,
      startDate,
      endDate,
      bookings,
    });
  } catch (error) {
    console.error("getAdminCalendar error:", error);
    res.status(500).json({ message: "Failed to load admin calendar" });
  }
}
