// API service for web delivery system with enhanced error handling and validation
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

class DeliveryApiService {
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

  // Enhanced request method with better error handling
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
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = {
            error: `HTTP ${response.status}: ${response.statusText}`,
          };
        }

        const error = new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
        error.status = response.status;
        error.data = errorData;

        console.error(
          `[API ERROR] ${config.method || "GET"} ${endpoint}:`,
          error.message,
          errorData
        );
        throw error;
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(
        `[API FAILED] ${config.method || "GET"} ${endpoint}:`,
        error
      );
      throw error;
    }
  }

  // Validate required fields for requests
  validateRequired(data, requiredFields, operationName) {
    const missing = requiredFields.filter((field) => {
      const value = data[field];
      return value === undefined || value === null || value === "";
    });

    if (missing.length > 0) {
      const error = new Error(
        `${operationName}: Missing required fields: ${missing.join(", ")}`
      );
      error.missingFields = missing;
      throw error;
    }
  }

  // Get all concepts for topic selection
  async getConcepts(gradeLevel = null) {
    const endpoint = gradeLevel
      ? `/web/concepts?gradeLevel=${encodeURIComponent(gradeLevel)}`
      : "/web/concepts";
    return this.request(endpoint);
  }

  // Get past sessions for the authenticated user
  async getStudentSessions() {
    return this.request(`/web/sessions`);
  }

  // Create a new study session with validation
  async createSession(sessionData) {
    this.validateRequired(
      sessionData,
      ["conceptIds", "studyTimeMinutes", "gradeLevel"],
      "Create Session"
    );

    // Additional validation
    if (
      !Array.isArray(sessionData.conceptIds) ||
      sessionData.conceptIds.length === 0
    ) {
      throw new Error("Create Session: conceptIds must be a non-empty array");
    }

    if (
      typeof sessionData.studyTimeMinutes !== "number" ||
      sessionData.studyTimeMinutes <= 0
    ) {
      throw new Error(
        "Create Session: studyTimeMinutes must be a positive number"
      );
    }

    return this.request("/web/sessions", {
      method: "POST",
      body: sessionData,
    });
  }

  // Get session problems with pagination and validation
  async getSessionProblems(sessionId, page = 1) {
    this.validateRequired({ sessionId }, ["sessionId"], "Get Session Problems");

    if (typeof page !== "number" || page < 1) {
      throw new Error("Get Session Problems: page must be a positive number");
    }

    return this.request(`/web/sessions/${sessionId}/problems?page=${page}`);
  }

  // Submit answer for a problem with validation
  async submitAnswer(answerData) {
    this.validateRequired(
      answerData,
      ["sessionId", "pageNumber", "sequenceNumber", "answer"],
      "Submit Answer"
    );

    // Additional validation
    if (
      typeof answerData.pageNumber !== "number" ||
      answerData.pageNumber < 1
    ) {
      throw new Error("Submit Answer: pageNumber must be a positive number");
    }

    if (
      typeof answerData.sequenceNumber !== "number" ||
      answerData.sequenceNumber < 1
    ) {
      throw new Error(
        "Submit Answer: sequenceNumber must be a positive number"
      );
    }

    return this.request("/web/sessions/submit-answer", {
      method: "POST",
      body: answerData,
    });
  }

  // Submit a page (lock it from further edits) with validation
  async submitPage(pageData) {
    this.validateRequired(pageData, ["sessionId", "pageNumber"], "Submit Page");

    // Additional validation
    if (typeof pageData.pageNumber !== "number" || pageData.pageNumber < 1) {
      throw new Error("Submit Page: pageNumber must be a positive number");
    }

    return this.request("/web/sessions/submit-page", {
      method: "POST",
      body: pageData,
    });
  }

  // Complete a session with validation
  async completeSession(sessionData) {
    this.validateRequired(sessionData, ["sessionId"], "Complete Session");

    return this.request("/web/sessions/complete", {
      method: "POST",
      body: sessionData,
    });
  }

  // Get session details with validation
  async getSessionDetails(sessionId) {
    this.validateRequired({ sessionId }, ["sessionId"], "Get Session Details");

    return this.request(`/web/sessions/${sessionId}/details`);
  }

  // Claim an anonymous session for authenticated user with validation
  async claimSession(sessionId) {
    this.validateRequired({ sessionId }, ["sessionId"], "Claim Session");

    return this.request(`/web/sessions/${sessionId}/claim`, {
      method: "POST",
    });
  }
}

export default new DeliveryApiService();
