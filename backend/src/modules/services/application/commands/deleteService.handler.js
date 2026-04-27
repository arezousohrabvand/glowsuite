import { serviceRepository } from "../../infrastructure/repositories/service.repository.js";

export const deleteServiceHandler = async (id) => {
  return serviceRepository.deleteById(id);
};
