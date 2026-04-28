export const mapUserToResponse = (user) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  fullName: `${user.firstName} ${user.lastName}`,
  email: user.email,
  phone: user.phone,
  role: user.role,
  createdAt: user.createdAt,
});
