import bcrypt from "bcryptjs";
import { userRepository } from "../../infrastructure/repositories/user.repository.js";
import { USER_ROLES } from "../../domain/userRoles.js";
import { mapUserToResponse } from "../../contracts/auth.mapper.js";

export const registerUserHandler = async ({
  firstName,
  lastName,
  phone,
  email,
  password,
  role,
}) => {
  const normalizedEmail = email.toLowerCase().trim();

  const emailExists = await userRepository.existsByEmail(normalizedEmail);

  if (emailExists) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepository.create({
    firstName,
    lastName,
    phone: phone || "",
    email: normalizedEmail,
    password: hashedPassword,
    role: role || USER_ROLES.CUSTOMER,
  });

  return mapUserToResponse(user);
};
