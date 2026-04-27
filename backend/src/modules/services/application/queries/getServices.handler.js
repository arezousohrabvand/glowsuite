import { serviceRepository } from "../../infrastructure/repositories/service.repository.js";

export const getServicesHandler = async () => {
  return serviceRepository.findAll();
};
