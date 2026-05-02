import Service from "../mongoose/ServiceModel.js";

export const serviceRepository = {
  findAll() {
    return Service.find().sort({ createdAt: -1 });
  },

  findById(id) {
    return Service.findById(id);
  },

  create(data) {
    return Service.create(data);
  },

  update(id, data) {
    return Service.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  },

  delete(id) {
    return Service.findByIdAndDelete(id);
  },
};
