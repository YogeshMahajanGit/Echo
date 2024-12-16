/* eslint-disable react/prop-types */
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectRoute({ children, user, redirect = "/login" }) {
  if (!user) return <Navigate to={redirect} />;

  return children ? (
    React.isValidElement(children) ? (
      children
    ) : (
      <children />
    )
  ) : (
    <Outlet />
  );
}

export default ProtectRoute;
