import api from "./axios";

export const authAPI = {
  // Login user
  login: async (credentials) => {
    const response = await api.post("/users/signin", credentials);
    const data = response.data;

    // Store user data in localStorage
    // If not provided in response, set defaults for demo
    localStorage.setItem(
      "user",
      JSON.stringify(
        data.user || {
          _id: "user-id",
          name: "Demo User",
          email: credentials.email,
        },
      ),
    );
    localStorage.setItem("role", data.role || "admin");
    localStorage.setItem(
      "workspace",
      JSON.stringify(
        data.workspace || {
          companyName: "Demo Company",
          companyEmail: credentials.email,
          adminId: { name: "Demo User" },
          members: [],
        },
      ),
    );
    if (data.accessToken) localStorage.setItem("accessToken", data.accessToken);
    if (data.refreshToken)
      localStorage.setItem("refreshToken", data.refreshToken);
    if (data.userId) localStorage.setItem("userId", data.userId);

    return data;
  },

  // Signup user
  signup: async (userData) => {
    const response = await api.post("/users/signup", userData);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post("/users/logout");
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await api.post("/users/refresh-token", { refreshToken });
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put("/users/profile", userData);
    return response.data;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await api.post(`/users/verify-email/${token}`);
    return response.data;
  },

  // Resend verification email
  resendVerification: async (email) => {
    const response = await api.post("/users/resend-verification", { email });
    return response.data;
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    const response = await api.post("/users/forgot-password", { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password, confirmPassword) => {
    const response = await api.post(`/users/reset-password/${token}`, {
      password,
      confirmPassword,
    });
    return response.data;
  },

  // Accept invitation
  acceptInvitation: async (token) => {
    const response = await api.post(`/users/accept-invitation/${token}`);
    return response.data;
  },
};

export default authAPI;
