// src/utils/axiosConfig.js

import axios from "axios";
import jwtDecode from "jwt-decode";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // use your base URL
  withCredentials: false, // set to true only if using cookies
});

// 🔐 Request Interceptor: Add token & check expiry
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const { exp } = jwtDecode(token);
      if (Date.now() >= exp * 1000) {
        localStorage.removeItem("jwtToken");
        alert("Your token has expired. Please login again.");
        window.location.href = "/signin"; // or use navigate()
        throw new axios.Cancel("Token expired");
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ❌ Response Interceptor: Handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      alert("Your session has expired. Please sign in again.");
      localStorage.removeItem("jwtToken");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default API;
