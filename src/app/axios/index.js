"use client";
import axios from "axios";
import AUTH from "./auth";

const API = axios.create({
  baseURL: "http://localhost:5000/v1",
  withCredentials: true,
});


// Skip refresh for login + signup + refresh routes
const AUTH_ROUTES = ["/auth/login", "/auth/register", "/auth/refresh-tokens"];
const isAuthRoute = (url) => AUTH_ROUTES.some((r) => url.includes(r));

// Attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // network error
    if (!error.response) return Promise.reject(error);

    // don't refresh for login/signup
    if (isAuthRoute(original.url)) return Promise.reject(error);

    // If expired token → try refresh
    if (error.response.status === 401 && !original._retry) {
      original._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/login";
        return;
      }

      try {
        // get new access + refresh token
        const { data } = await AUTH.refreshToken({ refreshToken });

        // store them
        localStorage.setItem("accessToken", data.access.token);
        localStorage.setItem("refreshToken", data.refresh.token);

        // retry original request
        original.headers.Authorization = `Bearer ${data.access.token}`;
        return API(original);
      } catch (err) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
