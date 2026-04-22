import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getClasses,
  getClassById,
  getMyEnrollments,
} from "../controllers/classController.js";

const router = express.Router();

router.get("/", getClasses);
router.get("/my-enrollments", protect, getMyEnrollments);
router.get("/:id", getClassById);

export default router;
