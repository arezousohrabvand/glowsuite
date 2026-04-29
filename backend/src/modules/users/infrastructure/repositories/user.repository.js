import UserModel from "../mongoose/UserModel.js";

export const findUserById = async (userId) => {
  return UserModel.findById(userId);
};

export const findUserProfileById = async (userId) => {
  return UserModel.findById(userId).select(
    "firstName lastName email phone role createdAt",
  );
};

export const updateUserProfileById = async (userId, updateData) => {
  return UserModel.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
    select: "firstName lastName email phone role createdAt updatedAt",
  });
};

export const findUsersForAdmin = async ({
  page = 1,
  limit = 10,
  role,
  search,
}) => {
  const query = {};

  if (role) {
    query.role = role;
  }

  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [users, total] = await Promise.all([
    UserModel.find(query)
      .select("firstName lastName email phone role createdAt updatedAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),

    UserModel.countDocuments(query),
  ]);

  return {
    users,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  };
};
