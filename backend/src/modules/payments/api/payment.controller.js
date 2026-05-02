import { createCheckoutSessionHandler } from "../application/commands/createCheckoutSession.handler.js";
import { verifyPaymentHandler } from "../application/commands/verifyPayment.handler.js";
import { getPaymentBySessionHandler } from "../application/queries/getPaymentBySession.handler.js";
import { getMyPaymentsHandler } from "../application/queries/getMyPayments.handler.js";
import { toPaymentDTO as mapPaymentsToDTO } from "../contracts/payment.dto.js";
export async function createCheckoutSessionController(req, res, next) {
  try {
    const result = await createCheckoutSessionHandler(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function verifyPaymentController(req, res, next) {
  try {
    const result = await verifyPaymentHandler(req.params.sessionId);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getPaymentBySessionController(req, res, next) {
  try {
    const result = await getPaymentBySessionHandler(req.params.sessionId);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
export async function getMyPaymentsController(req, res, next) {
  try {
    const result = await getMyPaymentsHandler(req.user._id, req.query);

    res.json({
      data: result.data.map(mapPaymentsToDTO),
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}
