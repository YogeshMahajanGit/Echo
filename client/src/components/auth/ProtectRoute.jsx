/* eslint-disable react/prop-types */
import { Navigate, Outlet } from "react-router-dom";

function ProtectRoute({ children, user, redirect = "/login" }) {
  if (!user) return <Navigate to={redirect} />;

  return children ? children : <Outlet />;
}

export default ProtectRoute;
