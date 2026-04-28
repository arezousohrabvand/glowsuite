import asyncHandler from "express-async-handler";
import generateToken from "../../../shared/utils/generateToken.js";

import { registerUserDto, loginUserDto } from "../contracts/auth.dto.js";
import {
  validateRegisterInput,
  validateLoginInput,
} from "../contracts/auth.schema.js";
import { registerUserHandler } from "../application/commands/registerUser.handler.js";
import { loginUserHandler } from "../application/commands/loginUser.handler.js";
import { getCurrentUserHandler } from "../application/queries/getCurrentUser.handler.js";

export const registerUser = asyncHandler(async (req, res) => {
  const dto = registerUserDto(req.body);

  const validationError = validateRegisterInput(dto);
  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  const user = await registerUserHandler(dto);

  res.status(201).json({
    message: "User registered successfully",
    token: generateToken(user.id),
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phone: user.phone,
    },
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const dto = loginUserDto(req.body);

  const validationError = validateLoginInput(dto);
  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  const user = await loginUserHandler(dto);

  res.status(200).json({
    message: "Login successful",
    token: generateToken(user.id),
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phone: user.phone,
    },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await getCurrentUserHandler(req.user._id);

  res.status(200).json({
    _id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    phone: user.phone,
  });
});
