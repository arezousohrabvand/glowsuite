import User from "../../../users/infrastructure/mongoose/UserModel.js";

export const stylistRepository = {
  async findByName(stylistName) {
    if (!stylistName) return null;

    const clean = stylistName.trim().replace(/\s+/g, " ");
    const parts = clean.split(" ");
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ");

    let stylistUser = await User.findOne({
      role: "stylist",
      firstName: { $regex: `^${firstName}$`, $options: "i" },
      lastName: { $regex: `^${lastName}$`, $options: "i" },
    });

    if (stylistUser) return stylistUser;

    return User.findOne({
      role: "stylist",
      $expr: {
        $regexMatch: {
          input: { $concat: ["$firstName", " ", "$lastName"] },
          regex: clean,
          options: "i",
        },
      },
    });
  },
};
