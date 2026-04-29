import express from "express";
import {
  protect,
  adminOnly,
} from "../../../shared/middleware/authMiddleware.js";

import { getUsersAdmin } from "./user.controller.js";

const router = express.Router();

router.get("/", protect, adminOnly, getUsersAdmin);

export default router;
