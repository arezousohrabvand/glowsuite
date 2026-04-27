import { toClassResponse } from "../../contracts/class.mapper.js";
import { findClassById } from "../../infrastructure/repositories/class.repository.js";

export async function getClassByIdHandler(id) {
  const classDoc = await findClassById(id);

  if (!classDoc) {
    const error = new Error("Class not found");
    error.statusCode = 404;
    throw error;
  }

  return toClassResponse(classDoc);
}
