export const registerUserDto = (body) => ({
  firstName: body.firstName,
  lastName: body.lastName,
  email: body.email,
  password: body.password,
  phone: body.phone,
  role: body.role,
});

export const loginUserDto = (body) => ({
  email: body.email,
  password: body.password,
});
