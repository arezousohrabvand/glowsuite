import bcrypt from "bcryptjs";
import { userRepository } from "../../infrastructure/repositories/user.repository.js";
import { mapUserToResponse } from "../../contracts/auth.mapper.js";

export const loginUserHandler = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await userRepository.findByEmail(normalizedEmail);

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  return mapUserToResponse(user);
};
