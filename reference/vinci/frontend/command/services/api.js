import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Dashboard API
export const dashboardAPI = {
  getOverview: () => api.get("/api/command/overview"),

  getUserRecords: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
    if (params.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    return api.get(`/api/command/users${queryString ? `?${queryString}` : ""}`);
  },

  getStudySessions: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.userId) queryParams.append("userId", params.userId);

    const queryString = queryParams.toString();
    return api.get(
      `/api/command/sessions${queryString ? `?${queryString}` : ""}`
    );
  },

  getContactMessages: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.status) queryParams.append("status", params.status);
    if (params.topic) queryParams.append("topic", params.topic);

    const queryString = queryParams.toString();
    return api.get(
      `/api/command/contacts${queryString ? `?${queryString}` : ""}`
    );
  },

  updateContactStatus: (id, data) =>
    api.put(`/api/command/contacts/${id}`, data),

  getStripeWebhooks: (userId, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);

    const queryString = queryParams.toString();
    return api.get(
      `/api/command/users/${userId}/webhooks${
        queryString ? `?${queryString}` : ""
      }`
    );
  },

  // Analytics API
  getAnalyticsData: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.start_date) queryParams.append("start_date", params.start_date);
    if (params.end_date) queryParams.append("end_date", params.end_date);
    if (params.page_path) queryParams.append("page_path", params.page_path);
    if (params.skip) queryParams.append("skip", params.skip);
    // Note: limit parameter removed - backend will return all records within date range

    const queryString = queryParams.toString();
    return api.get(
      `/api/command/analytics/data${queryString ? `?${queryString}` : ""}`
    );
  },

  getAnalyticsSummary: (days = 7) => {
    return api.get(`/api/command/analytics/summary?days=${days}`);
  },

  getReferralSourceBreakdown: (days = 7) => {
    return api.get(`/api/command/analytics/referral-sources?days=${days}`);
  },

  getDailyAnalyticsChart: (days = 7) => {
    return api.get(`/api/command/analytics/daily-chart?days=${days}`);
  },

  getLocalhostExclusionConfig: () => {
    return api.get("/api/command/config/localhost-exclusion");
  },

  getNewsletterSubscribers: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
    if (params.search) queryParams.append("search", params.search);
    if (params.status) queryParams.append("status", params.status);

    const queryString = queryParams.toString();
    return api.get(
      `/api/command/newsletter/subscribers${
        queryString ? `?${queryString}` : ""
      }`
    );
  },
};

export default api;
