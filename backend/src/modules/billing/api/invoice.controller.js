import { billingRepository } from "../infrastructure/repositories/billing.repository.js";
import { buildInvoiceDto } from "../application/services/invoice.service.js";

export const getInvoiceByBillingId = async (req, res) => {
  try {
    const { billingId } = req.params;
    const billing = await billingRepository.findById(billingId);

    if (!billing) {
      return res.status(404).json({ message: "Billing record not found" });
    }

    return res.status(200).json(buildInvoiceDto(billing));
  } catch (error) {
    console.error("getInvoiceByBillingId error:", error);
    return res.status(error.statusCode || 500).json({
      message: error.message || "Failed to generate invoice",
    });
  }
};
