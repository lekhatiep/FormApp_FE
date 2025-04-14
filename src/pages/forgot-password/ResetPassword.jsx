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
import { Navigate, useNavigate } from "react-router-dom";
import background from "../../assets/anh_nen.jpg";
import { HOME_PAGE } from "@constants/common";
import {
  APPROVAL_LIST,
  FORGOT_PASSWORD,
  PERMISSIONS,
  URL_SERVER_LOCAL,
} from "../../constants/common";
import { makeStyles } from "@mui/styles";
import { Snackbar, Alert } from "@mui/material";
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
const useStyles = makeStyles(() => ({
  forgotPassword: {
    cursor: "pointer",
  },
}));

export default function ResetPasswordPage() {
  let API_URL = "";
  if (URL_SERVER_LOCAL.indexOf("5001") > 1 || URL_SERVER_LOCAL.indexOf("api")) {
    API_URL = URL_SERVER_LOCAL + "/api/User";
  }
  const classes = useStyles();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateEmail(email)) {
      setError("Please input valid Email");
      return;
    }

    try {
      await axios
        .post(API_URL + "/SendNewPassword?email=" + email)
        .then((res) => {
          if (res.status === 200) {
            setOpen(true);
            
          }
        });
    } catch (e) {
      console.log("Error", e);
    }
    setEmail("")
  };

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!validateEmail(value)) {
      setError("Invalid Email");
    } else {
      setError("");
    }
  };
  function handleClick() {
    // Logic to execute before redirecting
    navigate("/");
  }
  return (
    <ThemeProvider theme={theme}>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} 
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Send Successfully, Please check your email !
        </Alert>
      </Snackbar>
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
              SEND NEW PASSWORD
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
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={handleChange}
                error={!!error}
                helperText={error}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                SEND
              </Button>
              <Link onClick={handleClick} className={classes.forgotPassword}>
                  Login Page?
                </Link>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
