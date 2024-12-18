import React, { useCallback } from "react";
import { useState } from "react";
import { Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/Logo.png";
import { makeStyles } from "@mui/styles";
import { LOGIN_PAGE } from "@constants/common";

const useStyles = makeStyles(() => ({
  headerContainer: {
    backgroundColor: "white",
    height: "4.25rem",
    borderBottom: "0.25rem solid #eceff4",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "1rem",
    zIndex: 9999,
  },
  headerNameContainer: {
    marginLeft: "4.375rem",
    display: "flex",
    alignItems: "center",
  },
  headerAccountContainer: {
    display: "flex",
    float: "right",
    marginRight: "3.125rem",
    cursor: "pointer",
  },
  headerLogo: {
    height: "3.875rem",
    paddingTop: "0.125rem",
  },
  headerTitle: {
    color: "#0c4da2",
    lineHeight: "4.125rem",
    marginLeft: "1.5rem",
    fontSize: "2.5rem",
    display: "inline-block",
  },
  headerAccountId: {
    fontSize: "1.5rem",
    fontWeight: 600,
    lineHeight: "4.125rem",
    color: "black",
  },
  headerDropdownWrapper: {
    paddingTop: "1.625rem",
    marginLeft: "0.5rem",
    color: "#d9d9d9",
  },
  headerDropdownBtn: {},
}));

function Header() {
  const navigate = useNavigate();
  const [userID, setUserID] = useState(localStorage.getItem("Name"));
  const handleSignOut = useCallback(() => {
    localStorage.clear();
    navigate(LOGIN_PAGE);
  }, []);

  const classes = useStyles();

  return (
    <header className={classes.headerContainer}>
      <div className={classes.headerNameContainer}>
        <img src={Logo} alt="Logo" className={classes.headerLogo} />
        <h1 className={classes.headerTitle}>Request's Portal</h1>
      </div>
      <div className={classes.headerAccountContainer}>
        {userID ? (
          <p className={classes.headerAccountId}>{userID}</p>
        ) : (
          <p className={classes.headerAccountId}>Khách</p>
        )}
        <i className={classes.headerDropdownWrapper} />

        <Box sx={{ "& button": { m: 2 } }}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              handleSignOut();
            }}
          >
            Log out
          </Button>
        </Box>
      </div>
    </header>
  );
}

export default Header;
