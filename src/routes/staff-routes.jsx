import { HOME_PAGE } from "@constants";
import UserContext from "@contexts/UserContext";
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

export const StaffRoute = ({ children }) => {
  const { user } = useContext(UserContext) ?? "";
  const roleCurrent = localStorage.getItem("Name");
  console.log("user",user);
  console.log("roleCurrent",roleCurrent)

  return user.role !== "student"  && roleCurrent !== "student" ? children : <Navigate to={HOME_PAGE} />;
}
