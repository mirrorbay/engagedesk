const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const newsletterApi = {
  // Subscribe to newsletter
  subscribe: async (email) => {
    try {
      const token = localStorage.getItem("auth_token");
      const headers = {
        "Content-Type": "application/json",
      };

      // Add authorization header if token exists (optional auth)
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/web/newsletter/subscribe`, {
        method: "POST",
        headers,
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      throw error;
    }
  },

  // Check subscription status
  checkStatus: async (email) => {
    try {
      const queryParams = new URLSearchParams({ email });
      const response = await fetch(
        `${API_BASE_URL}/web/newsletter/status?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error checking subscription status:", error);
      throw error;
    }
  },
};

export default newsletterApi;
