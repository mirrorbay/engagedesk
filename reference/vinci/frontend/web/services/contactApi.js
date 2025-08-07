const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const contactApi = {
  // Get contact information
  getContactInfo: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/web/contact/info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching contact info:", error);
      throw error;
    }
  },

  // Submit contact message
  submitContactMessage: async (messageData) => {
    try {
      const token = localStorage.getItem("auth_token");
      const headers = {
        "Content-Type": "application/json",
      };

      // Add authorization header if token exists (optional auth)
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/web/contact/message`, {
        method: "POST",
        headers,
        body: JSON.stringify(messageData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("Error submitting contact message:", error);
      throw error;
    }
  },

  // Get contact messages (admin only - for future use)
  getContactMessages: async (params = {}) => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const queryParams = new URLSearchParams();
      if (params.status) queryParams.append("status", params.status);
      if (params.topic) queryParams.append("topic", params.topic);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.page) queryParams.append("page", params.page);

      const url = `${API_BASE_URL}/web/contact/messages${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      throw error;
    }
  },
};

export default contactApi;
