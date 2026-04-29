import { findUserProfileById } from "../../infrastructure/repositories/user.repository.js";

export const getProfileHandler = async (userId) => {
  const user = await findUserProfileById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};
