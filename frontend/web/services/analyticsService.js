// Clean up API base URL to avoid double /api
const getApiBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;
};

const API_BASE_URL = getApiBaseUrl();

// Track page visit
export const trackPageVisit = async (pageData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/page-visit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
    const response = await fetch(`${API_BASE_URL}/analytics/click-events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clickData),
    });

    if (!response.ok) {
      console.warn("Failed to track click events:", response.statusText);
    }
  } catch (error) {
    console.warn("Error tracking click events:", error);
  }
};

// Track visit duration
export const trackVisitDuration = async (durationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/visit-duration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(durationData),
    });

    if (!response.ok) {
      console.warn("Failed to track visit duration:", response.statusText);
    }
  } catch (error) {
    console.warn("Error tracking visit duration:", error);
  }
};

// Track scroll events
export const trackScrollEvents = async (scrollData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/scroll-events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scrollData),
    });

    if (!response.ok) {
      console.warn("Failed to track scroll events:", response.statusText);
    }
  } catch (error) {
    console.warn("Error tracking scroll events:", error);
  }
};

// Get analytics data
export const getAnalyticsData = async (params = {}) => {
  try {
    // Filter out undefined values and convert boolean to string for URL params
    const cleanParams = Object.fromEntries(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [
          key,
          typeof value === "boolean" ? value.toString() : value,
        ])
    );

    const queryString = new URLSearchParams(cleanParams).toString();
    const response = await fetch(
      `${API_BASE_URL}/analytics/data?${queryString}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Get analytics summary
export const getAnalyticsSummary = async (days = 7) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/analytics/summary?days=${days}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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

// Get referral source breakdown
export const getReferralSourceBreakdown = async (days = 7) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/analytics/referral-sources?days=${days}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch referral source breakdown");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching referral source breakdown:", error);
    throw error;
  }
};

// Get daily analytics chart
export const getDailyAnalyticsChart = async (days = 7) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/analytics/daily-chart?days=${days}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch daily analytics chart");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching daily analytics chart:", error);
    throw error;
  }
};
