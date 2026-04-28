export const validateRegisterInput = (data) => {
  const { firstName, lastName, email, password } = data;

  if (!firstName || !lastName) {
    return "First name and last name are required";
  }

  if (!email) {
    return "Email is required";
  }

  if (!password || password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null;
};

export const validateLoginInput = (data) => {
  const { email, password } = data;

  if (!email || !password) {
    return "Email and password are required";
  }

  return null;
};
