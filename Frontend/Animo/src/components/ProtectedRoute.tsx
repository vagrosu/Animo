import { Navigate, Outlet } from "react-router-dom";
import {useUser} from "../context/UserContext.tsx";

export default function ProtectedRoute() {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}