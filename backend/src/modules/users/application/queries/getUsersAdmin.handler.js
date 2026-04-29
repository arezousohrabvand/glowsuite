import { findUsersForAdmin } from "../../infrastructure/repositories/user.repository.js";

export const getUsersAdminHandler = async (dto) => {
  return findUsersForAdmin(dto);
};
