import { createClassDto } from "../../contracts/class.dto.js";
import { toClassResponse } from "../../contracts/class.mapper.js";
import { createClass } from "../../infrastructure/repositories/class.repository.js";

export async function createClassHandler(body) {
  const dto = createClassDto(body);
  const createdClass = await createClass(dto);

  return toClassResponse(createdClass);
}
