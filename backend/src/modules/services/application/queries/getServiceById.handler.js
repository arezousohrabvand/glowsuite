import { serviceRepository } from "../../infrastructure/repositories/service.repository.js";

export const getServiceByIdHandler = async (id) => {
  return serviceRepository.findById(id);
};
