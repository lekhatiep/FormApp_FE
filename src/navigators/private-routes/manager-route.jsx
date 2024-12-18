import { UserContext } from "@contexts/UserContext";
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { HOME_PAGE } from "@constants";

export const ManagerRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  return user.role === "manager" ? children : <Navigate to={HOME_PAGE} />;
};
