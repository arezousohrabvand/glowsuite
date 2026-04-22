import { Navigate, useLocation } from "react-router-dom";
import { getStoredUser, isAuthenticated } from "../utils/auth";

export default function AdminRoute({ children }) {
  const location = useLocation();
  const user = getStoredUser();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user) {
    return <Navigate to="/dashboard" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
