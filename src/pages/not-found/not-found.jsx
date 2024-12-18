import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { HOME_PAGE } from "@constants";

const useStyles = makeStyles(() => ({
  containerNotFound: {
    fontFamily: "'Papyrus', 'Courier New', monospace",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#87898f",
  },
  notfoundImg: {
    height: "70vh",
  },
  containerContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  notfoundTitle: {
    fontSize: 40,
  },
  linkHomepage: {
    textDecoration: "none",
    color: "rgba(0, 138, 252, 0.822)",
    fontWeight: "bold",
  },
  linkHomepageHover: {
    textDecoration: "underline",
  },
}));

function NotFound() {
  const classes = useStyles();
  const NOTFOUND_IMG = "https://images.ui8.net/uploads/6_1632688928415.png";

  return (
    <div className={classes.containerNotFound}>
      <img className={classes.notfoundImg} src={NOTFOUND_IMG} alt="" />
      <div className={classes.containerContent}>
        <h1 className={classes.notfoundTitle}>Oops</h1>
        <h2 className={classes.notfoundContent}>404, page not found</h2>
        <Link className={classes.linkHomepage} to={HOME_PAGE}>
          &lt; Return to homepage &gt;
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
