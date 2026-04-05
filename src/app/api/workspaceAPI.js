import api from "./axios";

const workspaceAPI = {
  getWorkspaceOverview: async () => {
    try {
      const response = await api.get("/workspace/overview");
      return response.data;
    } catch (error) {
      console.error("Error fetching workspace overview:", error);
      throw error;
    }
  },

  getActivityLogs: async (page = 1, limit = 20) => {
    try {
      const response = await api.get(`/activity-log/list?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      throw error;
    }
  },
  deleteWorkspace: async () => {
    try {
      const response = await api.delete("/workspace/deleteWorkspace");
      return response.data;
    } catch (error) {
      console.error("Error deleting workspace:", error);
      throw error;
    }
  },
};

export default workspaceAPI;
