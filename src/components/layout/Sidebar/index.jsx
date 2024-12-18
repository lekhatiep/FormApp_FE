import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import UserContext from "@contexts/UserContext";
import {
  HOME_PAGE,
  APPROVAL_LIST,
  FORM_CREATION,
  PERMISSIONS,
  REQUEST_LIST,
} from "@constants/common";

const useStyles = makeStyles(() => ({
  sidebarContainer: {
    position: "fixed",
    height: "100%",
    width: "13rem",
    backgroundColor: "#E8E8E8",
    zIndex: 999,
    paddingLeft: "1rem",
  },
  sidebarList: {
    width: "12.5rem",
    height: "22.25rem",
    margin: "2rem auto auto",
    marginTop: "6.25rem",
    listStyleType: "none",
    "& li": {
      marginTop: "0.5rem",
    },
  },
  sidebarItem: {
    listStyleType: "none",
    paddingBottom: "2.5rem",
  },
}));

function Sidebar() {
  const { user } = useContext(UserContext) ?? {};
  const { role } = user ?? {};
  const classes = useStyles();

  return (
    <div className={classes.sidebarContainer}>
      <ul className={classes.sidebarList}>
        {(role === PERMISSIONS.STUDENT || role === PERMISSIONS.ADMIN) && (
          <li>
            <Link to={HOME_PAGE} className={classes.sidebarItem}>
              Service
            </Link>
          </li>
        )}
        {(user.role === PERMISSIONS.STUDENT ||
          user.role == PERMISSIONS.ADMIN) && (
          <li>
            <Link to={REQUEST_LIST} className={classes.sidebarItem}>
              {user.role === PERMISSIONS.STUDENT
                ? "My Requests"
                : "Student Requests"}
            </Link>
          </li>
        )}
        {role !== PERMISSIONS.STUDENT && role !== PERMISSIONS.ADMIN && (
          <li>
            <Link to={APPROVAL_LIST} className={classes.sidebarItem}>
              Approvals
            </Link>
          </li>
        )}
        {role === PERMISSIONS.ADMIN && (
          <li>
            <Link to={FORM_CREATION} className={classes.sidebarItem}>
              Form Creation
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
