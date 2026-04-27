import { deleteClassById } from "../../infrastructure/repositories/class.repository.js";

export async function deleteClassHandler(id) {
  const deletedClass = await deleteClassById(id);

  if (!deletedClass) {
    const error = new Error("Class not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    success: true,
    message: "Class deleted successfully",
  };
}
