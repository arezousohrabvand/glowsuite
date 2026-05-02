import express from "express";
import { protect, adminOnly } from "../../../shared/middleware/authMiddleware.js";

import {
  getMe,
  updateProfile,
  getAllUsers,
  getUserById,
  deleteUser,
} from "./user.controller.js";

const router = express.Router();

// get current user
router.get("/me", protect, getMe);

// update profile
router.put("/me", protect, updateProfile);

// admin: get all users
router.get("/admin/all", protect, adminOnly, getAllUsers);

// admin: get user by id
router.get("/admin/:id", protect, adminOnly, getUserById);

// admin: delete user
router.delete("/admin/:id", protect, adminOnly, deleteUser);

export default router;
