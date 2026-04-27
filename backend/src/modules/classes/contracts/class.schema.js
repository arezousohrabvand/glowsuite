import { z } from "zod";
import { CLASS_LEVEL_VALUES } from "../domain/classLevel.js";
import { CLASS_STATUS_VALUES } from "../domain/classStatus.js";

export const createClassSchema = z.object({
  title: z.string().min(2, "Title is required"),
  category: z.string().min(2, "Category is required"),
  description: z.string().optional(),

  instructorName: z.string().min(2, "Instructor name is required"),

  price: z.coerce.number().min(0),
  capacity: z.coerce.number().int().min(1),

  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),

  image: z.string().optional(),
  duration: z.string().optional(),

  level: z.enum(CLASS_LEVEL_VALUES).default("Beginner"),
  status: z.enum(CLASS_STATUS_VALUES).default("active"),

  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export const updateClassSchema = createClassSchema.partial();

export const classIdParamSchema = z.object({
  id: z.string().min(1, "Class id is required"),
});
