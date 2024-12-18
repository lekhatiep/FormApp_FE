import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { HOME_PAGE, PERMISSIONS } from "@constants";
import UserContext from "@contexts/UserContext";

export const AdminRoute = (props) => {
  const { children } = props ?? {}

  const { user } = useContext(UserContext) ?? {};
  const { role } = user ?? {}

  return role === PERMISSIONS.ADMIN ? children : <Navigate to={HOME_PAGE} />;
}
