import { userRepository } from "../../infrastructure/repositories/user.repository.js";
import { mapUserToResponse } from "../../contracts/auth.mapper.js";

export const getCurrentUserHandler = async (userId) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return mapUserToResponse(user);
};
