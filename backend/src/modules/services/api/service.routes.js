import express from "express";

import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} from "./service.controller.js";

import { protect } from "../../../shared/middleware/authMiddleware.js";
import { authorizeRoles } from "../../../shared/middleware/roleMiddleware.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "services working" });
});

router.get("/", getServices);
router.get("/:id", getServiceById);

router.post("/", protect, authorizeRoles("admin"), createService);
router.put("/:id", protect, authorizeRoles("admin"), updateService);
router.delete("/:id", protect, authorizeRoles("admin"), deleteService);

export default router;
