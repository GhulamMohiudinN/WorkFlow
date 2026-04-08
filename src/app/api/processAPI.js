import api from "./axios";

export const processAPI = {
  createProcess: async (processData) => {
    try {
      const payload = transformFormDataToAPI(processData);
      const response = await api.post("/process/create", payload);
      return {
        success: true,
        data: response.data,
        message: "Process created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to create process",
        status: error.response?.status,
      };
    }
  },

  getProcesses: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      if (filters.search) params.append("search", filters.search);
      if (filters.status) params.append("status", filters.status);
      if (filters.category) params.append("category", filters.category);
      if (filters.visibility) params.append("visibility", filters.visibility);

      const response = await api.get(
        `/process/list${params.toString() ? "?" + params.toString() : ""}`,
      );

      return {
        success: true,
        data: response.data.processes || response.data,
        message: "Processes fetched successfully",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch processes",
        status: error.response?.status,
      };
    }
  },

  getProcess: async (processId) => {
    try {
      if (!processId) {
        return {
          success: false,
          error: "Process ID is required",
          status: 400,
        };
      }

      console.log(`[API] Fetching process with ID: ${processId}`);

      let response;
      let lastError = null;

      // Try multiple endpoint variations
      const endpointVariations = [
        `/process/${processId}`,
        `/process/get/${processId}`,
        `/processes/${processId}`,
        `/processes/get/${processId}`,
      ];

      for (const endpoint of endpointVariations) {
        try {
          console.log(`[API] Trying endpoint: ${endpoint}`);
          response = await api.get(endpoint);
          console.log(`[API] Success with endpoint: ${endpoint}`);
          break;
        } catch (error) {
          lastError = error;
          console.warn(
            `[API] Endpoint ${endpoint} failed:`,
            error.response?.status,
            error.response?.data?.message || error.message,
          );
        }
      }

      if (!response) {
        console.error(`[API] All endpoints failed. Last error:`, lastError);
        throw lastError;
      }

      console.log(`[API] Raw response:`, response.data);

      // Extract process data - handle both direct response and nested response
      const processData =
        response.data?.process || response.data?.data || response.data;

      console.log(`[API] Extracted process data:`, processData);

      if (!processData || !processData._id) {
        return {
          success: false,
          error: "Invalid process data structure returned from server",
          status: 500,
        };
      }

      return {
        success: true,
        data: processData,
        message: "Process fetched successfully",
      };
    } catch (error) {
      console.error(`[API] Error fetching process:`, error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch process",
        status: error.response?.status,
      };
    }
  },

  updateProcess: async (processId, updatedData) => {
    try {
      if (!processId) {
        return { success: false, error: "Process ID is required", status: 400 };
      }

      const payload = transformFormDataToAPI(updatedData);
      let response;

      try {
        response = await api.patch(`/process/update/${processId}`, payload, { timeout: 30000 });
      } catch (firstError) {
        if (
          firstError.response?.status === 404 ||
          firstError.response?.status === 400
        ) {
          response = await api.put(`/process/${processId}`, payload, { timeout: 30000 });
        } else {
          throw firstError;
        }
      }

      return {
        success: true,
        data: response.data,
        message: "Process updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to update process",
        status: error.response?.status,
      };
    }
  },

  deleteProcess: async (processId) => {
    try {
      if (!processId) {
        return { success: false, error: "Process ID is required", status: 400 };
      }

      let response;
      try {
        response = await api.delete(`/process/delete/${processId}`);
      } catch (firstError) {
        if (
          firstError.response?.status === 404 ||
          firstError.response?.status === 400
        ) {
          response = await api.delete(`/process/${processId}`);
        } else {
          throw firstError;
        }
      }

      return {
        success: true,
        data: response.data,
        message: "Process deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to delete process",
        status: error.response?.status,
      };
    }
  },

  /**
   * Duplicate a process
   * @param {string} processId - Process ID to duplicate
   * @returns {Promise}
   */
  duplicateProcess: async (processId) => {
    try {
      const response = await api.post(`/process/${processId}/duplicate`);
      return {
        success: true,
        data: response.data,
        message: "Process duplicated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to duplicate process",
        status: error.response?.status,
      };
    }
  },

  /**
   * Publish a process (change from draft to active)
   * @param {string} processId - Process ID
   * @returns {Promise}
   */
  publishProcess: async (processId) => {
    try {
      const response = await api.post(`/process/${processId}/publish`);
      return {
        success: true,
        data: response.data,
        message: "Process published successfully",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to publish process",
        status: error.response?.status,
      };
    }
  },

  /**
   * Archive a process
   * @param {string} processId - Process ID
   * @returns {Promise}
   */
  archiveProcess: async (processId) => {
    try {
      const response = await api.post(`/process/${processId}/archive`);
      return {
        success: true,
        data: response.data,
        message: "Process archived successfully",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to archive process",
        status: error.response?.status,
      };
    }
  },

  /**
   * Get all processes for workspace
   * @param {Object} filters - Optional filters (search, status)
   * @returns {Promise}
   */
  getWorkspaceProcesses: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.status) params.append("status", filters.status);

      const response = await api.get(
        `/process/workspace/list${params.toString() ? "?" + params.toString() : ""}`,
      );

      return {
        success: true,
        data: response.data.processes || response.data,
        message: "Workspace processes fetched successfully",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch workspace processes",
        status: error.response?.status,
      };
    }
  },

  /**
   * Get assigned processes for current user
   * @param {Object} filters - Optional filters (userId, search, status, etc.)
   * @returns {Promise}
   */
  getAssignedProcesses: async (filters = {}) => {
    try {
      // Senior-level approach: dynamically clean and build query params
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value != null && value !== "")
      );
      const queryString = new URLSearchParams(cleanFilters).toString();

      const response = await api.get(
        `/process/assigned/me${queryString ? "?" + queryString : ""}`
      );

      return {
        success: true,
        data: response.data.processes || response.data,
        message: "Assigned processes fetched successfully",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch assigned processes",
        status: error.response?.status,
      };
    }
  },

  /**
   * Delete a step from a process
   * @param {string} stepId - Step ID
   * @returns {Promise}
   */
  deleteStep: async (stepId) => {
    try {
      const response = await api.delete(`/step/delete/${stepId}`);
      return {
        success: true,
        data: response.data,
        message: "Step deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to delete step",
        status: error.response?.status,
      };
    }
  },

  /**
   * Update a step
   * @param {string} stepId - Step ID
   * @param {Object} stepData - Updated step data
   * @returns {Promise}
   */
  updateStep: async (stepId, stepData) => {
    try {
      const response = await api.patch(`/step/update/${stepId}`, stepData);
      return {
        success: true,
        data: response.data,
        message: "Step updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to update step",
        status: error.response?.status,
      };
    }
  },
};

/**
 * Transform form data to API payload format
 * Maps the form state to the expected API structure
 * @param {Object} formData - Form state data
 * @returns {Object} API payload
 */
function transformFormDataToAPI(formData) {
  return {
    name: formData.name,
    description: formData.description,
    category: formData.category,
    visibility: formData.visibility,
    settings: {
      notifications: {
        email: formData.notifications?.email ?? true,
        slack: formData.notifications?.slack ?? false,
        inApp: formData.notifications?.inApp ?? true,
      },
      automation: {
        autoAssignTasks: formData.automation?.autoAssign ?? false,
        dueDateReminders: formData.automation?.dueDateReminders ?? true,
        escalateOverdueTasks: formData.automation?.escalation ?? false,
      },
    },
    assignedTo: (formData.assignedTo || []).map(a => 
      typeof a === "string" ? a : a._id || a.id
    ),
    steps: (formData.steps || []).map((step) => ({
      _id: step._id || (step.id?.toString().startsWith('step-') ? null : step.id),
      title: step.title,
      description: step.description,
      timeEstimate: step.timeEstimate,
      notes: step.notes || "",
      status: step.status || "draft",
      order: step.order,
      assignee: step.assignee || "",
    })),
  };
}

/**
 * Transform API response data to form data format
 * Reverses the API payload structure back to form state
 * @param {Object} apiData - API response data
 * @returns {Object} Form state data
 */
export function transformAPIToFormData(apiData) {
  return {
    name: apiData.name,
    description: apiData.description,
    category: apiData.category,
    visibility: apiData.visibility,
    assignedTo: apiData.assignedTo || [],
    steps: (apiData.steps || []).map((step, index) => ({
      id: step._id || index + 1,
      title: step.title,
      description: step.description,
      timeEstimate: step.timeEstimate,
      notes: step.notes,
      order: index + 1,
      status: step.status,
      assignee: step.assignee || "",
    })),
    notifications: {
      email: apiData.settings?.notifications?.email ?? true,
      slack: apiData.settings?.notifications?.slack ?? false,
      inApp: apiData.settings?.notifications?.inApp ?? true,
    },
    automation: {
      autoAssign: apiData.settings?.automation?.autoAssignTasks ?? false,
      dueDateReminders: apiData.settings?.automation?.dueDateReminders ?? true,
      escalation: apiData.settings?.automation?.escalateOverdueTasks ?? false,
    },
  };
}
