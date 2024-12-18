import axios from "axios";
import jwtDecode from "jwt-decode";
import { LOCAL_BASE_URL } from "@constants/api-path";

const axiosInstance = axios.create({
  baseURL: import.meta.env.PROD
    ? process.env.REACT_APP_SERVER_CONNECTION
    : LOCAL_BASE_URL,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  env: import.meta.env.PROD || import.meta.env.DEV,
  timeout: 300000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      if (!config.headers.Authorization) {
        return config;
      } else {
        const tokenOriginal = config.headers.Authorization.slice(7);
        const tokenDecoded = jwtDecode(tokenOriginal);
        const refreshToken = getLocalStorage("refreshToken");
        const date = new Date();
        if (tokenDecoded.exp < date.getTime() / 1000) {
          const configHeader = {
            headers: {
              refreshToken: `${refreshToken}`,
            },
          };
          const res = await axiosInstance.get(
            `${API_PATH.REFRESH_TOKEN}`,
            configHeader
          );
          const newToken = res.data.token;
          //   setLocalStorage("token", newToken);
          //   deleteLocalStorage("refreshToken");
          config.headers.Authorization = `Bearer ${newToken}`;
        }
        return config;
      }
    } catch (error) {
      console.log("error", error);
    }
  },
  (err) => {
    return Promise.reject(err);
  }
);
export { axiosInstance };
