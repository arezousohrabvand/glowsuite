import Booking from "../models/Booking.js";
import { acquireLock, releaseLock } from "../services/lockService.js";
import { hasStylistSlotConflict } from "../services/bookingConflictService.js";

const getDayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

export const getStylistDashboard = async (req, res) => {
  try {
    const stylistId = req.user._id;
    const now = new Date();
    const { start, end } = getDayRange();

    const [todayBookings, upcomingBookings, completedBookings] =
      await Promise.all([
        Booking.countDocuments({
          stylist: stylistId,
          slotStart: { $gte: start, $lte: end },
          status: { $nin: ["Cancelled"] },
        }),
        Booking.countDocuments({
          stylist: stylistId,
          slotStart: { $gte: now },
          status: { $nin: ["Cancelled", "Completed"] },
        }),
        Booking.countDocuments({
          stylist: stylistId,
          status: "Completed",
        }),
      ]);

    res.json({
      todayBookings,
      upcomingBookings,
      completedBookings,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};

export const getStylistBookings = async (req, res) => {
  try {
    const stylistId = req.user._id;

    const {
      status,
      paymentStatus,
      view = "upcoming",
      page = 1,
      limit = 10,
    } = req.query;

    const query = { stylist: stylistId };
    const now = new Date();

    if (view === "today") {
      const { start, end } = getDayRange();
      query.slotStart = { $gte: start, $lte: end };
    }

    if (view === "upcoming") {
      query.slotStart = { $gte: now };
      query.status = { $nin: ["Cancelled", "Completed"] };
    }

    if (view === "past") {
      query.slotStart = { $lt: now };
    }

    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);
    const skip = (pageNumber - 1) * limitNumber;

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate("user", "firstName lastName email phone")
        .populate("service", "name category duration price")
        .sort({ slotStart: 1 })
        .skip(skip)
        .limit(limitNumber),
      Booking.countDocuments(query),
    ]);

    res.json({
      bookings,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error("Get stylist bookings error:", error);
    res.status(500).json({ message: "Failed to fetch stylist bookings" });
  }
};

export const getStylistSchedule = async (req, res) => {
  try {
    const stylistId = req.user._id;

    const bookings = await Booking.find({
      stylist: stylistId,
      status: { $nin: ["Cancelled"] },
    })
      .select("slotStart slotEnd status serviceName stylistNotes")
      .sort({ slotStart: 1 });

    res.json({ bookings });
  } catch (error) {
    console.error("Schedule error:", error);
    res.status(500).json({ message: "Failed to fetch schedule" });
  }
};

export const getStylistTodaySchedule = async (req, res) => {
  try {
    const stylistId = req.user._id;
    const { start, end } = getDayRange();

    const bookings = await Booking.find({
      stylist: stylistId,
      slotStart: { $gte: start, $lte: end },
      status: { $nin: ["Cancelled"] },
    })
      .populate("user", "firstName lastName email phone")
      .populate("service", "name category duration price")
      .sort({ slotStart: 1 });

    res.json({ bookings });
  } catch (error) {
    console.error("Get stylist today schedule error:", error);
    res.status(500).json({ message: "Failed to fetch today schedule" });
  }
};

export const getStylistCustomers = async (req, res) => {
  try {
    const stylistId = req.user._id;

    const bookings = await Booking.find({ stylist: stylistId })
      .populate("user", "firstName lastName email phone")
      .sort({ slotStart: -1 });

    const customerMap = new Map();

    bookings.forEach((booking) => {
      if (!booking.user) return;

      const customerId = booking.user._id.toString();

      if (!customerMap.has(customerId)) {
        customerMap.set(customerId, {
          customer: booking.user,
          totalBookings: 0,
          lastBooking: booking.slotStart,
        });
      }

      const item = customerMap.get(customerId);
      item.totalBookings += 1;

      if (booking.slotStart > item.lastBooking) {
        item.lastBooking = booking.slotStart;
      }
    });

    res.json({
      customers: Array.from(customerMap.values()),
    });
  } catch (error) {
    console.error("Get stylist customers error:", error);
    res.status(500).json({ message: "Failed to get stylist customers" });
  }
};

export const updateStylistBookingStatus = async (req, res) => {
  try {
    const stylistId = req.user._id;
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Confirmed", "Completed", "Cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status for stylist action",
      });
    }

    const booking = await Booking.findOne({
      _id: id,
      stylist: stylistId,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found for this stylist",
      });
    }

    booking.status = status;
    await booking.save();

    res.json({
      message: "Booking status updated",
      booking,
    });
  } catch (error) {
    console.error("Update stylist booking status error:", error);
    res.status(500).json({ message: "Failed to update booking status" });
  }
};

export const updateStylistBookingNotes = async (req, res) => {
  try {
    const stylistId = req.user._id;
    const { id } = req.params;
    const { stylistNotes } = req.body;

    const booking = await Booking.findOne({
      _id: id,
      stylist: stylistId,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found for this stylist",
      });
    }

    booking.stylistNotes = stylistNotes || "";
    await booking.save();

    res.json({
      message: "Stylist notes updated",
      booking,
    });
  } catch (error) {
    console.error("Update stylist notes error:", error);
    res.status(500).json({ message: "Failed to update stylist notes" });
  }
};

export const rescheduleStylistBooking = async (req, res) => {
  const stylistId = req.user._id;
  const { id } = req.params;
  const { slotStart, slotEnd } = req.body;

  if (!slotStart || !slotEnd) {
    return res.status(400).json({
      message: "slotStart and slotEnd are required",
    });
  }

  const newSlotStart = new Date(slotStart);
  const newSlotEnd = new Date(slotEnd);

  if (
    Number.isNaN(newSlotStart.getTime()) ||
    Number.isNaN(newSlotEnd.getTime())
  ) {
    return res.status(400).json({
      message: "Invalid slotStart or slotEnd",
    });
  }

  if (newSlotEnd <= newSlotStart) {
    return res.status(400).json({
      message: "slotEnd must be after slotStart",
    });
  }

  const lockKey = `lock:stylist:${stylistId}:slot:${newSlotStart.toISOString()}`;

  let lockValue;

  try {
    lockValue = await acquireLock(lockKey, 30);

    if (!lockValue) {
      return res.status(409).json({
        message: "This time slot is currently being updated. Please try again.",
      });
    }

    const booking = await Booking.findOne({
      _id: id,
      stylist: stylistId,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found for this stylist",
      });
    }

    if (["Cancelled", "Completed"].includes(booking.status)) {
      return res.status(400).json({
        message: "Cancelled or completed bookings cannot be rescheduled",
      });
    }

    const conflictExists = await hasStylistSlotConflict({
      stylistId,
      slotStart: newSlotStart,
      slotEnd: newSlotEnd,
      excludeBookingId: id,
    });

    if (conflictExists) {
      return res.status(409).json({
        message: "This stylist already has a booking during this time",
      });
    }

    booking.slotStart = newSlotStart;
    booking.slotEnd = newSlotEnd;
    booking.date = newSlotStart.toISOString().slice(0, 10);
    booking.time = newSlotStart.toTimeString().slice(0, 5);
    booking.status = "Confirmed";

    await booking.save();

    return res.json({
      message: "Booking rescheduled successfully",
      booking,
    });
  } catch (error) {
    console.error("Reschedule stylist booking error:", error);
    return res.status(500).json({
      message: "Failed to reschedule booking",
    });
  } finally {
    if (lockValue) {
      await releaseLock(lockKey, lockValue);
    }
  }
};
