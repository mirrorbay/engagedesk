import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        const result = await authService.verifyToken();
        if (result.success) {
          setUser(result.data.user);
          setToken(storedToken);
        } else {
          console.error("Token verification failed:", result.error);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const result = await authService.login(email, password);

    if (result.success) {
      const { token: newToken, user: userData } = result.data;
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(userData);

      // The redirect will be handled by PublicRoute component
      return { success: true, user: userData };
    }

    return result;
  };

  const register = async (userData) => {
    const result = await authService.register(userData);

    if (result.success) {
      const { token: newToken, user: newUser } = result.data;
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(newUser);
      return { success: true, user: newUser };
    }

    return result;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const result = await authService.updateProfile(profileData);

    if (result.success) {
      // Update the user state with the new data
      setUser(result.data.user);
      return { success: true, user: result.data.user };
    }

    return result;
  };

  const refreshUser = async () => {
    const result = await authService.getCurrentUser();
    if (result.success) {
      setUser(result.data.user);
      return { success: true, user: result.data.user };
    }
    return result;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
