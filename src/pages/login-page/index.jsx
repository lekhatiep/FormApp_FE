import background from "@assets/anh_nen.jpg";
import { END_POINT, LOCAL_BASE_URL } from "@constants/api-path";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@contexts/UserContext";
import { HOME_PAGE } from "@constants/common";
export const LoginPage = () => {
  const { setUserContext } = React.useContext(UserContext) ?? {};
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });

  //-----------------------------------------------
  const handleLogin = React.useCallback(
    async (event) => {
      event.preventDefault();
      try {
        axios
          .post(`${LOCAL_BASE_URL}${END_POINT.LOGIN}`, userData)
          .then((res) => {
            const { token } = res?.data ?? {};

            if (!token) {
              return;
            }

            localStorage.setItem("token", token);
            setUserContext(token);
            navigate(HOME_PAGE);
          });
      } catch (e) {
        alert("Login Failed!");
        console.log("[handleLogin] | Get Error: ", e);
      }
    },
    [userData]
  );

  //-----------------------------------------------
  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${background})`,
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          objectFit: "contain",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate onSubmit={handleLogin}>
            <TextField
              inputProps={{ maxLength: 100 }}
              margin="normal"
              required
              fullWidth
              id="username"
              label="Your Username"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={(e) => {
                setUserData((prev) => {
                  return { ...prev, username: e.target.value };
                });
              }}
            />
            <TextField
              inputProps={{ maxLength: 45 }}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="password"
              onChange={(e) => {
                setUserData((prev) => {
                  return { ...prev, password: e.target.value };
                });
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
