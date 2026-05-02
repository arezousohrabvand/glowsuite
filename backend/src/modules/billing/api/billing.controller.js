import { getMyBillingHandler } from "../application/queries/getMyBilling.handler.js";
import { getBillingAdminHandler } from "../application/queries/getBillingAdmin.handler.js";
import { refundBillingHandler } from "../application/commands/refundBilling.handler.js";
import { createBillingRecordHandler } from "../application/commands/createBillingRecord.handler.js";
import { createBillingRecordDto, refundBillingDto } from "../contracts/billing.dto.js";
import {
  mapBillingListToResponse,
  mapBillingToResponse,
} from "../contracts/billing.mapper.js";

export const createBillingRecord = async (req, res) => {
  try {
    const dto = createBillingRecordDto(req.body);
    const billing = await createBillingRecordHandler(dto);

    res.status(201).json(mapBillingToResponse(billing));
  } catch (error) {
    console.error("createBillingRecord error:", error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to create billing record",
    });
  }
};

export const getMyBillingHistory = async (req, res) => {
  try {
    const history = await getMyBillingHandler(req.user._id);
    res.status(200).json(mapBillingListToResponse(history));
  } catch (error) {
    console.error("getMyBillingHistory error:", error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to get billing history",
    });
  }
};

export const getAllBilling = async (req, res) => {
  try {
    const history = await getBillingAdminHandler();
    res.status(200).json(mapBillingListToResponse(history));
  } catch (error) {
    console.error("getAllBilling error:", error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to get billing records",
    });
  }
};

export const refundBilling = async (req, res) => {
  try {
    const { billingId } = req.params;
    const dto = refundBillingDto(req.body);

    const result = await refundBillingHandler({
      billingId,
      refundAmount: dto.refundAmount,
      reason: dto.reason,
    });

    res.status(200).json({
      message: "Refund completed successfully",
      billing: mapBillingToResponse(result.billing),
      refundId: result.refundId,
    });
  } catch (error) {
    console.error("refundBilling error:", error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to refund payment",
    });
  }
};