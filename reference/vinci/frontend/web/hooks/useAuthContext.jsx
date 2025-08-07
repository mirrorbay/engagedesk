import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  initRedditPixelWithUser,
  trackRedditConversion,
  redditEvents,
} from "../utils/redditPixel";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Create the context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem("auth_token");
  };

  // Set token in localStorage
  const setToken = (token) => {
    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
  };

  // Make authenticated API request (memoized)
  const apiRequest = useCallback(async (endpoint, options = {}) => {
    const token = getToken();
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
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
      console.error("API request failed:", error);
      throw error;
    }
  }, []);

  // Check authentication status with backend (memoized to prevent infinite loops)
  const checkAuthStatus = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      return { isAuthenticated: false, user: null };
    }

    try {
      const result = await apiRequest("/auth/status");

      if (result.isAuthenticated && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        return { isAuthenticated: true, user: result.user };
      } else {
        // Token is invalid, remove it
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        return { isAuthenticated: false, user: null };
      }
    } catch (error) {
      console.error("Auth check failed:", error);

      // If it's a 401/403 error, the token is likely expired or invalid
      if (error.message.includes("401") || error.message.includes("403")) {
        console.log(
          "Token appears to be expired or invalid, clearing auth state"
        );
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        return { isAuthenticated: false, user: null };
      }

      // For network errors or other issues, don't clear the token immediately
      // This prevents logout on temporary network issues
      console.log(
        "Network or server error during auth check, maintaining current state"
      );
      return { isAuthenticated: isAuthenticated, user: user };
    }
  }, [apiRequest, isAuthenticated, user]);

  // Login with token (from OAuth callback)
  const login = async (token) => {
    if (!token) {
      throw new Error("No token provided");
    }

    setToken(token);

    // Verify the token and get user data
    const authResult = await checkAuthStatus();

    if (!authResult.isAuthenticated) {
      throw new Error("Invalid token");
    }

    return authResult.user;
  };

  // Logout
  const logout = async () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Initialize authentication state on app start
  const initialize = useCallback(async () => {
    if (isInitialized) return; // Prevent multiple initializations

    setIsLoading(true);

    try {
      await checkAuthStatus();
    } catch (error) {
      console.error("Auth initialization failed:", error);
      // Ensure clean state on initialization failure
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, [isInitialized, checkAuthStatus]);

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Initialize Reddit pixel with user data when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      initRedditPixelWithUser(user);

      // Track signup conversion for new users
      if (user.isNewUser || user.createdAt) {
        const userCreatedDate = new Date(user.createdAt);
        const now = new Date();
        const timeDiff = now - userCreatedDate;
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

        // If user was created within the last day, consider it a new signup
        if (daysDiff < 1) {
          trackRedditConversion(redditEvents.SIGNUP, {
            userId: user._id || user.id,
            customData: {
              email: user.email,
              signup_method: "google_oauth",
            },
          });
        }
      }
    }
  }, [isAuthenticated, user]);

  // Google OAuth login
  const loginWithGoogle = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  // Development login
  const devLogin = async (email, name) => {
    const result = await apiRequest("/auth/dev-login", {
      method: "POST",
      body: { email, name },
    });

    if (result.success && result.token) {
      return await login(result.token);
    } else {
      throw new Error("Development login failed");
    }
  };

  // Update user info
  const updateUserInfo = useCallback(
    async (userInfo) => {
      const result = await apiRequest("/auth/user-info", {
        method: "POST",
        body: userInfo,
      });

      if (result.success) {
        // Refresh user data
        await checkAuthStatus();
      }

      return result;
    },
    [apiRequest, checkAuthStatus]
  );

  // Update student info
  const updateStudentInfo = useCallback(
    async (studentInfo) => {
      const result = await apiRequest("/auth/student-info", {
        method: "POST",
        body: studentInfo,
      });

      if (result.success) {
        // Refresh user data
        await checkAuthStatus();
      }

      return result;
    },
    [apiRequest, checkAuthStatus]
  );

  // Require authentication - redirect to login if not authenticated
  const requireAuth = useCallback(
    async (options = {}) => {
      const { redirectPath = "/login", onSuccess } = options;

      // Wait for initialization to complete
      if (!isInitialized) {
        return false;
      }

      // Check if user is authenticated
      if (!isAuthenticated) {
        navigate(redirectPath);
        return false;
      }

      // If authenticated and onSuccess callback provided, call it
      if (onSuccess && typeof onSuccess === "function") {
        try {
          await onSuccess(user);
        } catch (error) {
          console.error("Error in requireAuth onSuccess callback:", error);
        }
      }

      return true;
    },
    [isAuthenticated, isInitialized, user, navigate]
  );

  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    isInitialized,

    // Actions
    login,
    logout,
    loginWithGoogle,
    devLogin,
    checkAuthStatus,
    updateUserInfo,
    updateStudentInfo,
    requireAuth,

    // Utilities
    getToken,
    apiRequest,
    trackRedditConversion, // Make Reddit conversion tracking easily accessible
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
