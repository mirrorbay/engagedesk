// API service for authentication
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

class AuthApiService {
  constructor() {
    this.token = localStorage.getItem("auth_token");
  }

  // Set token in localStorage and instance
  setToken(token) {
    console.log(
      "[login debug] Frontend: AuthApi setToken called, token length:",
      token?.length
    );
    this.token = token;
    localStorage.setItem("auth_token", token);
    // Dispatch custom event to notify components of auth change
    window.dispatchEvent(new CustomEvent("authChange"));
    console.log(
      "[login debug] Frontend: AuthApi token stored and authChange event dispatched"
    );
  }

  // Remove token from localStorage and instance
  removeToken() {
    console.log("[login debug] Frontend: AuthApi removeToken called");
    this.token = null;
    localStorage.removeItem("auth_token");
    // Dispatch custom event to notify components of auth change
    window.dispatchEvent(new CustomEvent("authChange"));
    console.log(
      "[login debug] Frontend: AuthApi token removed and authChange event dispatched"
    );
  }

  // Get authorization headers
  getAuthHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  async request(endpoint, options = {}) {
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
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Auth API request failed:", error);
      throw error;
    }
  }

  // Check authentication status
  async checkAuthStatus() {
    try {
      console.log(
        "[login debug] Frontend: checkAuthStatus called, token present:",
        !!this.token
      );
      const result = await this.request("/auth/status");
      console.log("[login debug] Frontend: checkAuthStatus result:", result);
      return result;
    } catch (error) {
      console.error(
        "[login debug] Frontend: Error checking auth status:",
        error
      );
      return { isAuthenticated: false, user: null };
    }
  }

  // Get current user
  async getCurrentUser() {
    return this.request("/auth/user");
  }

  // Logout
  async logout() {
    this.removeToken();
    return { success: true, message: "Logged out successfully" };
  }

  // Initiate Google OAuth login
  loginWithGoogle() {
    window.location.href = `${API_BASE_URL}/auth/google`;
  }

  // Handle OAuth callback with token
  handleAuthCallback(token) {
    if (token) {
      this.setToken(token);
      return true;
    }
    return false;
  }

  // Development login (bypasses Google OAuth)
  async devLogin(email, name) {
    return this.request("/auth/dev-login", {
      method: "POST",
      body: { email, name },
    });
  }

  // Update user/parent information
  async updateUserInfo(userInfo) {
    return this.request("/auth/user-info", {
      method: "POST",
      body: userInfo,
    });
  }

  // Update student information
  async updateStudentInfo(studentInfo) {
    return this.request("/auth/student-info", {
      method: "POST",
      body: studentInfo,
    });
  }
}

export default new AuthApiService();
