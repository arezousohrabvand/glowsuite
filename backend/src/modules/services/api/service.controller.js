import { createServiceHandler } from "../application/commands/createService.handler.js";
import { updateServiceHandler } from "../application/commands/updateService.handler.js";
import { deleteServiceHandler } from "../application/commands/deleteService.handler.js";
import { getServicesHandler } from "../application/queries/getServices.handler.js";
import { getServiceByIdHandler } from "../application/queries/getServiceById.handler.js";

export const createService = async (req, res, next) => {
  try {
    const service = await createServiceHandler(req.body);
    res.status(201).json(service);
  } catch (err) {
    next(err);
  }
};

export const getServices = async (req, res, next) => {
  try {
    const services = await getServicesHandler();
    res.json(services);
  } catch (err) {
    next(err);
  }
};

export const getServiceById = async (req, res, next) => {
  try {
    const service = await getServiceByIdHandler(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (err) {
    next(err);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const service = await updateServiceHandler(req.params.id, req.body);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (err) {
    next(err);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const service = await deleteServiceHandler(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};
