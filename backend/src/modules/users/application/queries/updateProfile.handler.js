import { updateUserProfileById } from "../../infrastructure/repositories/user.repository.js";

export const updateProfileHandler = async (userId, dto) => {
  const updateData = {
    firstName: dto.firstName,
    lastName: dto.lastName,
    phone: dto.phone || "",
    email: dto.email,
  };

  const updatedUser = await updateUserProfileById(userId, updateData);

  if (!updatedUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return updatedUser;
};
