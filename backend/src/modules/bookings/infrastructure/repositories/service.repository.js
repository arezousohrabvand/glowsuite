import Service from "../../../../models/Service.js";

export const serviceRepository = {
  async findByName(serviceName) {
    return Service.findOne({
      name: { $regex: new RegExp(`^${serviceName}$`, "i") },
    });
  },

  async findAllBasic() {
    return Service.find().select(
      "_id name price category duration durationMinutes",
    );
  },

  async findBestMatch(serviceName) {
    let service = await this.findByName(serviceName);

    if (service) return service;

    const simplified = serviceName
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .trim();

    const services = await this.findAllBasic();

    return (
      services.find((item) => {
        const candidate = String(item.name || "")
          .toLowerCase()
          .replace(/[^a-z0-9 ]/g, "")
          .trim();

        return candidate.includes(simplified) || simplified.includes(candidate);
      }) || null
    );
  },
};
