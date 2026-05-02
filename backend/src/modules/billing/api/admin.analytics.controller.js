import Billing from "../models/Billing.js";

export async function getRevenueAnalytics(req, res) {
  try {
    const { from, to } = req.query;

    const match = {
      paymentStatus: "paid",
    };

    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }

    const result = await Billing.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
          totalTransactions: { $sum: 1 },
          avgOrderValue: { $avg: "$total" },
        },
      },
    ]);

    res.json(
      result[0] || {
        totalRevenue: 0,
        totalTransactions: 0,
        avgOrderValue: 0,
      },
    );
  } catch (err) {
    res.status(500).json({ message: "Analytics failed" });
  }
}
