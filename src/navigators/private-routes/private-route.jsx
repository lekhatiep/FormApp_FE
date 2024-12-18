import React from "react";
import { Navigate } from "react-router-dom";
import { LOGIN_PAGE } from "@constants";

export const PrivateRoute = ({ children }) => {
  const isLogged = localStorage.getItem("token"); // check logging state with localStorage
  return isLogged ? children : <Navigate to={LOGIN_PAGE} />;
};
