import Billing from "../models/Billing.js";

export const getMyBillingHistory = async (req, res) => {
  try {
    const history = await Billing.find({ user: req.user._id })
      .populate("booking")
      .populate("service")
      .sort({ createdAt: -1 });

    res.status(200).json(history);
  } catch (error) {
    console.error("getMyBillingHistory error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllBilling = async (req, res) => {
  try {
    const history = await Billing.find()
      .populate("user", "firstName lastName email role")
      .populate("booking")
      .populate("service")
      .sort({ createdAt: -1 });

    res.status(200).json(history);
  } catch (error) {
    console.error("getAllBilling error:", error);
    res.status(500).json({ message: error.message });
  }
};
