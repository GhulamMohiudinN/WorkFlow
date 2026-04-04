import api from "./axios";

export const userAPI = {
  /**
   * GET /users/workspace-users
   * Query params: page, limit, role, search
   */
  getWorkspaceUsers: async ({ page = 1, limit = 10, role = "", search = "" } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (role && role !== "all") params.append("role", role);
    if (search) params.append("search", search);
    const response = await api.get(`/users/workspace-users?${params.toString()}`);
    return response.data;
  },

  /**
   * PATCH /users/update-user
   * Self-update: name is required; role is included if provided
   * Body: { name, role }
   */
  updateUser: async (payload) => {
    const body = {};
    if (payload.name  !== undefined) body.name  = payload.name;
    if (payload.role  !== undefined) body.role  = payload.role;
    const response = await api.patch("/users/update-user", body);
    return response.data;
  },

  /**
   * DELETE /users/delete-user/:userId
   * Superadmin only.
   */
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/delete-user/${userId}`);
    return response.data;
  },
};

export default userAPI;
