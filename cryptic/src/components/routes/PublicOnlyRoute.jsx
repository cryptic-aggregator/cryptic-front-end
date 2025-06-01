// components/routes/PublicOnlyRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const PublicOnlyRoute = ({ isAuthenticated }) => {
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicOnlyRoute;
