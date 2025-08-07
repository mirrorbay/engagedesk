// API service for performance charts
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

class ChartApiService {
  constructor() {
    this.token = localStorage.getItem("auth_token");
  }

  // Get authorization headers
  getAuthHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  // Update token when it changes
  updateToken() {
    this.token = localStorage.getItem("auth_token");
  }

  async request(endpoint, options = {}) {
    // Ensure we have the latest token
    this.updateToken();

    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Chart API request failed:", error);
      throw error;
    }
  }

  // Get performance trends over time
  async getPerformanceTrends(days = 30) {
    return this.request(`/web/charts/trends?days=${days}`);
  }
}

export default new ChartApiService();
