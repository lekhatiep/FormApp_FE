import { UserContext } from "@contexts/UserContext";
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { HOME_PAGE } from "@constants";

export const StaffRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  return user.role !== "student" ? children : <Navigate to={HOME_PAGE} />;
};
