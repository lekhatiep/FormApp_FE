import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Box, Grid } from "@mui/material";
import { Footer } from "./Footer";
import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";
import { APPROVAL_LIST, REQUEST_LIST } from "@constants/common";

export const MainLayout = (props) => {
  const { children } = props ?? {};
  const [isList, setIsList] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (
      location.pathname === REQUEST_LIST ||
      location.pathname === APPROVAL_LIST
    ) {
      setIsList(true);
    } else setIsList(false);
  }, [location]);
  return (
    <Box>
      <Grid container>
        <Grid item xs={12}>
          <Header />
        </Grid>
        <Grid item xs={2}>
          <Sidebar />
        </Grid>
        <Grid item xs={12}>
          {children}
        </Grid>
        {isList && (
          <Grid item xs={12}>
            <Box paddingTop={6} />
          </Grid>
        )}
      </Grid>
      <Footer />
    </Box>
  );
};
