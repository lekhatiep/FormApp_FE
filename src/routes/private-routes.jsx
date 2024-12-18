import React from "react";
import { Navigate } from "react-router-dom";

const isLogged = localStorage.getItem("Name") ?? '';

export const PrivateRoute = (props) => {
  const { children } = props ?? {}

  return isLogged ? children : <Navigate to={LOGIN_PAGE} />;
}
