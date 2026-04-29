export const validateUpdateProfileInput = (dto) => {
  if (!dto.firstName || dto.firstName.trim().length < 2) {
    return "First name must be at least 2 characters";
  }

  if (!dto.lastName || dto.lastName.trim().length < 2) {
    return "Last name must be at least 2 characters";
  }

  if (!dto.email || !dto.email.includes("@")) {
    return "Valid email is required";
  }

  return null;
};
