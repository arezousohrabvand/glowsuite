import { updateClassDto } from "../../contracts/class.dto.js";
import { toClassResponse } from "../../contracts/class.mapper.js";
import { updateClassById } from "../../infrastructure/repositories/class.repository.js";

export async function updateClassHandler(id, body) {
  const dto = updateClassDto(body);
  const updatedClass = await updateClassById(id, dto);

  if (!updatedClass) {
    const error = new Error("Class not found");
    error.statusCode = 404;
    throw error;
  }

  return toClassResponse(updatedClass);
}
