import User from "../mongoose/UserModel.js";

export const userRepository = {
  async findByEmail(email) {
    return User.findOne({ email });
  },

  async findById(id) {
    return User.findById(id).select("-password");
  },

  async create(userData) {
    return User.create(userData);
  },

  async existsByEmail(email) {
    const user = await User.exists({ email });
    return Boolean(user);
  },
};
