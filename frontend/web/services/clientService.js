import baseApi from "./baseApi";

export const clientService = {
  // Get clients with pagination and search
  getClients: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await baseApi.get(`/clients?${queryParams}`);
      return { success: true, data: response.data };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch clients";
      return { success: false, error: message };
    }
  },

  // Get single client
  getClient: async (id) => {
    try {
      const response = await baseApi.get(`/clients/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch client";
      return { success: false, error: message };
    }
  },

  // Create new client
  createClient: async (clientData) => {
    try {
      const response = await baseApi.post("/clients", clientData);
      return { success: true, data: response.data };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create client";
      return { success: false, error: message };
    }
  },

  // Update client
  updateClient: async (id, clientData) => {
    try {
      const response = await baseApi.put(`/clients/${id}`, clientData);
      return { success: true, data: response.data };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update client";
      return { success: false, error: message };
    }
  },

  // Add comment to client
  addComment: async (id, comment) => {
    try {
      // Get current client to append comment
      const clientResult = await clientService.getClient(id);
      if (!clientResult.success) {
        return clientResult;
      }

      const updatedComments = [
        ...(clientResult.data.teamComments || []),
        comment,
      ];

      const response = await baseApi.put(`/clients/${id}`, {
        teamComments: updatedComments,
      });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add comment";
      return { success: false, error: message };
    }
  },

  // Delete client
  deleteClient: async (id) => {
    try {
      const response = await baseApi.delete(`/clients/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete client";
      return { success: false, error: message };
    }
  },

  // Send email to client
  sendEmail: async (clientId, emailData) => {
    try {
      const response = await baseApi.post(
        `/clients/${clientId}/email`,
        emailData
      );
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send email";
      return { success: false, error: message };
    }
  },

  // Get all interactions for a client
  getClientInteractions: async (clientId, params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await baseApi.get(
        `/clients/${clientId}/interactions?${queryParams}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch client interactions";
      return { success: false, error: message };
    }
  },

  // Get email interactions for a client
  getEmailInteractions: async (clientId, params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await baseApi.get(
        `/clients/${clientId}/email/interactions?${queryParams}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch email interactions";
      return { success: false, error: message };
    }
  },

  // Get client tags
  getClientTags: async () => {
    try {
      const response = await baseApi.get("/clients/tags");
      return { success: true, data: response.data.tags };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch client tags";
      return { success: false, error: message };
    }
  },
};
