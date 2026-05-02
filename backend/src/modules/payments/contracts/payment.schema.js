import { z } from "zod";
import { PAYMENT_STATUS } from "../domain/paymentStatus.js";

export const createPaymentSchema = z.object({
  user: z.string().min(1),
  booking: z.string().optional().nullable(),
  enrollment: z.string().optional().nullable(),
  amount: z.number().min(0),
  currency: z.string().default("usd"),
  stripeSessionId: z.string().optional().nullable(),
  description: z.string().optional(),
});

export const updatePaymentStatusSchema = z.object({
  status: z.enum(Object.values(PAYMENT_STATUS)),
});
