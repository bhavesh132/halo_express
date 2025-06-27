import axios from "axios";
import getHaloToken from "./auth.js";

const haloAxios = axios.create({
  baseURL: "https://itbd.halopsa.com/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

let accessToken = null;
let tokenExpiryTime = 0;

// Request interceptor to add token
haloAxios.interceptors.request.use(
  async (config) => {
    if (!accessToken || Date.now() >= tokenExpiryTime) {
      const tokenData = await getHaloToken(process.env.HALO_AUTH_URL);
      accessToken = tokenData.access_token;
      tokenExpiryTime = Date.now() + tokenData.expires_in * 1000 - 5000; // 5s buffer
    }

    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default haloAxios;
