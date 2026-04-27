import axios from "axios";

// Resolve backend URL from env variables
const backendBase =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  "http://localhost:5000";

// Create axios instance
const api = axios.create({
  baseURL: `${backendBase.replace(/\/api\/v1$/, "")}/api/v1`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach auth token + log every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Attach a timestamp so we can compute duration in the response interceptor
    config.metadata = { startTime: Date.now() };
    console.log(
      `[API ▶]  ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
      config.params ? config.params : "",
    );
    return config;
  },
  (error) => {
    console.error("[API ▶ ERR] Request setup error:", error.message);
    return Promise.reject(error);
  },
);

// Response interceptor — log every response + handle token refresh on 401
api.interceptors.response.use(
  (response) => {
    const ms = Date.now() - (response.config.metadata?.startTime ?? Date.now());
    console.log(
      `[API ✔]  ${response.config.method?.toUpperCase()} ${response.config.url}`,
      `→ ${response.status} (${ms}ms)`,
    );
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const ms = Date.now() - (originalRequest?.metadata?.startTime ?? Date.now());
    console.error(
      `[API ✖]  ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`,
      `→ ${error.response?.status ?? "ERR"} (${ms}ms)`,
      error.response?.data?.message || error.message,
    );

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await api.post("/auth/refresh", { refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = response.data;

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("[API] Token refresh failed, redirecting to login");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
