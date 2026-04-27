import Service from "../mongoose/service.model.js";

export const serviceRepository = {
  create(data) {
    return Service.create(data);
  },

  findAll() {
    return Service.find().sort({ createdAt: -1 });
  },

  findById(id) {
    return Service.findById(id);
  },

  updateById(id, data) {
    return Service.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  },

  deleteById(id) {
    return Service.findByIdAndDelete(id);
  },
};
