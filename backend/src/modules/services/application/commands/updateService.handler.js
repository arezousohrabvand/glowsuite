import { serviceRepository } from "../../infrastructure/repositories/service.repository.js";

export const updateServiceHandler = async (id, data) => {
  return serviceRepository.updateById(id, data);
};
