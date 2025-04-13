import Notification from "@components/Snackbar/snackbar";
import UserContext from "@contexts/UserContext";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";
import * as React from "react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "../../assets/anh_nen.jpg";
import { HOME_PAGE } from "@constants/common";
import { APPROVAL_LIST, PERMISSIONS ,URL_SERVER_LOCAL} from "../../constants/common";
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>
      {new Date().getFullYear()}
    </Typography>
  );
}

const theme = createTheme();


export default function LoginPage() {
  let API_URL = "";
  if(URL_SERVER_LOCAL.indexOf("5001") > 1){
    API_URL = URL_SERVER_LOCAL + "/api/User"
  }

  
  const navigate = useNavigate();
  const { getUser } = useContext(UserContext);
  const [loginInput, setLoginInput] = useState({
    username: "",
    password: "",
  });
  const [isLoginFailed, setIsLoginFailed] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios
        .post(API_URL+"/checkAccountInfo", loginInput)
        .then((res) => {
          if (res.data.message === "Login Successfully") {
            localStorage.setItem("Name", loginInput.username);
            const userInfo = {
              accountId: loginInput.username,
              role: res.data.role,
            };

            localStorage.setItem("Token", res.data.token)
            getUser(userInfo);
            if (
              userInfo.role === PERMISSIONS.STUDENT ||
              userInfo.role === PERMISSIONS.ADMIN
            )
              navigate(HOME_PAGE);
            else navigate(APPROVAL_LIST);
          } else {
            setIsLoginFailed(res.data.message);
            setTimeout(() => {
              setIsLoginFailed(false);
            }, 1300);
          }
        });
    } catch (e) {
      console.log("Error", e);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {isLoginFailed && <Notification message="Invalid userName or password" />}
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
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
            // backgroundSize: '100%',
            objectFit: "fill",
            //backgroundPosition: "center",
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
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Account ID"
                name="username"
                autoComplete="username"
                autoFocus
                onChange={(e) =>
                  setLoginInput({ ...loginInput, username: e.target.value })
                }
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) =>
                  setLoginInput({ ...loginInput, password: e.target.value })
                }
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
                <Link to="/forgot-password" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
