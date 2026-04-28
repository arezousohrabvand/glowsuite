import { z } from "zod";

export const createSlotHoldDto = z.object({
  serviceName: z.string().min(2, "Service name is required").trim(),

  stylistName: z.string().min(2, "Stylist name is required").trim(),

  date: z.string().min(1, "Date is required"),

  time: z.string().min(1, "Time is required"),
});

export const releaseSlotHoldDto = z.object({
  holdId: z.string().min(1, "Hold id is required"),
});

export const slotHoldIdParamDto = z.object({
  holdId: z.string().min(1, "Hold id is required"),
});
