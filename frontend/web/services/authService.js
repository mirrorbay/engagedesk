import baseApi from "./baseApi";

export const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await baseApi.post("/auth/login", {
        email,
        password,
      });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      return { success: false, error: message };
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await baseApi.post("/auth/register", userData);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      return { success: false, error: message };
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await baseApi.post("/auth/verify");
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: "Token verification failed" };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await baseApi.get("/auth/me");
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: "Failed to get user data" };
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      console.log("[AuthService] Updating profile with data:", profileData);

      const formData = new FormData();

      // Add text fields
      if (profileData.firstName !== undefined)
        formData.append("firstName", profileData.firstName);
      if (profileData.lastName !== undefined)
        formData.append("lastName", profileData.lastName);
      if (profileData.nickname !== undefined)
        formData.append("nickname", profileData.nickname);
      if (profileData.title !== undefined)
        formData.append("title", profileData.title);
      if (profileData.gender !== undefined)
        formData.append("gender", profileData.gender);
      if (profileData.company !== undefined)
        formData.append("company", profileData.company);
      if (profileData.position !== undefined)
        formData.append("position", profileData.position);
      if (profileData.department !== undefined)
        formData.append("department", profileData.department);

      // Handle phone numbers
      if (profileData.phones !== undefined) {
        formData.append("phones", JSON.stringify(profileData.phones));
      }

      // Handle emergency contact
      if (profileData.emergencyContact !== undefined) {
        formData.append(
          "emergencyContact",
          JSON.stringify(profileData.emergencyContact)
        );
      }

      // Handle profile image
      if (profileData.profileImage === null) {
        // Signal to remove existing profile image
        formData.append("profileImage", "null");
      } else if (profileData.profileImage) {
        // Add new profile image file
        formData.append("profileImage", profileData.profileImage);
      }

      const response = await baseApi.put("/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("[AuthService] Profile update successful:", response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("[AuthService] Profile update failed:", error);
      const message = error.response?.data?.message || "Profile update failed";
      return { success: false, error: message };
    }
  },
};
