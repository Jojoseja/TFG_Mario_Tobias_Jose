import { Navigate, Outlet } from "react-router-dom";
import { getStoredUser } from "../services/userStorageService";

function ProtectedRoute() {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;