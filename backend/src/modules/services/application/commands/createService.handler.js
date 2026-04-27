import { serviceRepository } from "../../infrastructure/repositories/service.repository.js";

export const createServiceHandler = async (data) => {
  return serviceRepository.create(data);
};
