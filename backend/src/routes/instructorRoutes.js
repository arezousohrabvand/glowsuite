import express from "express";
import {
  getInstructorDashboard,
  getInstructorClasses,
  getInstructorStudents,
  getInstructorSchedule,
} from "../controllers/instructorController.js";

import { protect } from "../shared/middleware/authMiddleware.js";
import { authorizeRoles } from "../shared/middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("instructor", "admin"));

router.get("/dashboard", getInstructorDashboard);
router.get("/classes", getInstructorClasses);
router.get("/students", getInstructorStudents);
router.get("/schedule", getInstructorSchedule);

export default router;
