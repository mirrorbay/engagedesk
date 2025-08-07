const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Track page visit
export const trackPageVisit = async (pageData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/web/analytics/page-visit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(pageData),
    });

    if (!response.ok) {
      console.warn("Failed to track page visit:", response.statusText);
    }
  } catch (error) {
    console.warn("Error tracking page visit:", error);
  }
};

// Track click events
export const trackClickEvents = async (clickData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/web/analytics/click-events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(clickData),
    });

    if (!response.ok) {
      console.warn("Failed to track click events:", response.statusText);
    }
  } catch (error) {
    console.warn("Error tracking click events:", error);
  }
};

// Get analytics data (admin only)
export const getAnalyticsData = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(
      `${API_BASE_URL}/web/analytics/data?${queryString}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch analytics data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw error;
  }
};

// Get analytics summary (admin only)
export const getAnalyticsSummary = async (days = 7) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/web/analytics/summary?days=${days}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch analytics summary");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    throw error;
  }
};
