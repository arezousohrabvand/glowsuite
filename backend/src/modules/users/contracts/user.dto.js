export const updateProfileDto = (body) => {
  return {
    firstName: body.firstName,
    lastName: body.lastName,
    phone: body.phone,
    email: body.email,
  };
};

export const getUsersAdminDto = (query) => {
  return {
    page: query.page || 1,
    limit: query.limit || 10,
    role: query.role,
    search: query.search,
  };
};
