import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Save,
  User,
  Mail,
  Building,
  Briefcase,
  Tag,
  Camera,
  Upload,
  Phone,
  Users,
  Plus,
  X,
  Lock,
} from "lucide-react";
import { useAuth } from "../utils/AuthContext";
import { useAutoSave } from "../utils/useAutoSave";
import { useAutoSaveContext } from "../utils/AutoSaveContext";
import { formatPhoneNumber, extractPhoneDigits } from "../utils/formatter";
import { authService } from "../services/authService";
import styles from "../styles/settings.module.css";

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const { updateAutoSaveState, clearAutoSaveState } = useAutoSaveContext();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    title: "",
    email: "",
    gender: "",
    position: "",
    department: "",
    phones: [],
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
      email: "",
    },
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });

  // Helper function to prepare profile data
  const prepareProfileData = useCallback(
    (includeImage = false) => {
      const data = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        nickname: formData.nickname,
        title: formData.title,
        gender: formData.gender,
        position: formData.position,
        department: formData.department,
        phones: formData.phones,
        emergencyContact: formData.emergencyContact,
      };

      if (includeImage && profileImage) {
        data.profileImage = profileImage;
      }

      return data;
    },
    [formData, profileImage]
  );

  // Helper function to reset password modal
  const resetPasswordModal = useCallback(() => {
    setShowPasswordModal(false);
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordMessage({ type: "", text: "" });
  }, []);

  // Auto-save function for profile data (excluding profile image)
  // Uses authService directly to avoid updating user state and triggering form reinitialization
  const autoSaveProfile = useCallback(
    async (data) => {
      console.log("[Settings] Auto-save triggered with data:", data);

      // Don't auto-save if there's no user or if we're currently loading
      if (!user || isLoading) {
        console.log("[Settings] Auto-save skipped - no user or loading");
        return;
      }

      // Call authService directly instead of updateProfile to avoid user state update
      const result = await authService.updateProfile(prepareProfileData());
      console.log("[Settings] Auto-save result:", result);
      return result;
    },
    [user, isLoading, prepareProfileData]
  );

  // Track if initial data has been loaded to prevent autosave on initial population
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);

  // Auto-save hook configuration
  const autoSave = useAutoSave(formData, autoSaveProfile, {
    delay: 2000, // 2 second delay
    enabled: !!user && isInitialDataLoaded, // Enable only when user is loaded AND initial data is populated
    excludeFields: ["email"], // Don't trigger auto-save on email changes (it's disabled anyway)
    onSaveStart: () => {
      setMessage({ type: "", text: "" }); // Clear any existing messages
    },
    onSaveSuccess: (result) => {
      console.log("[Settings] Auto-save successful");
    },
    onSaveError: (error) => {
      console.error("[Settings] Auto-save failed:", error);
      setMessage({
        type: "error",
        text: "Auto-save failed. Your changes may not be saved.",
      });
    },
    shouldSave: (data) => {
      // Only auto-save if we have meaningful data
      return !!(data.firstName || data.lastName || data.position);
    },
  });

  // Update the global auto-save state when local auto-save state changes
  useEffect(() => {
    console.log("[Settings] useEffect triggered - updating autoSave state:", {
      isSaving: autoSave.isSaving,
      lastSaved: autoSave.lastSaved,
      hasUnsavedChanges: autoSave.hasUnsavedChanges,
      error: autoSave.error,
    });
    updateAutoSaveState(autoSave);
  }, [
    autoSave.isSaving,
    autoSave.lastSaved,
    autoSave.hasUnsavedChanges,
    autoSave.error,
  ]);

  // Clear auto-save state when component unmounts
  useEffect(() => {
    return () => {
      clearAutoSaveState();
    };
  }, []);

  // Initialize form data with user data
  useEffect(() => {
    if (user && !isInitialDataLoaded) {
      console.log("[Settings] Initializing form data with user:", user);
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        nickname: user.nickname || "",
        title: user.title || "",
        email: user.email || "",
        gender: user.gender || "",
        position: user.position || "",
        department: user.department || "",
        phones: user.phones || [],
        emergencyContact: {
          name: user.emergencyContact?.name || "",
          relationship: user.emergencyContact?.relationship || "",
          phone: user.emergencyContact?.phone || "",
          email: user.emergencyContact?.email || "",
        },
      });

      // Mark initial data as loaded after a brief delay to ensure form data is set
      setTimeout(() => {
        setIsInitialDataLoaded(true);
        console.log("[Settings] Initial data loaded, autosave enabled");
      }, 100);
    }
  }, [user, isInitialDataLoaded]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle emergency contact input changes
  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [name]: name === "phone" ? formatPhoneNumber(value) : value,
      },
    }));
  };

  // Handle phone number changes
  const handlePhoneChange = (index, field, value) => {
    setFormData((prev) => {
      const newPhones = [...prev.phones];
      if (field === "number") {
        // Format the phone number for display
        const formattedValue = formatPhoneNumber(value);
        newPhones[index] = { ...newPhones[index], number: formattedValue };
      } else if (field === "label") {
        newPhones[index] = { ...newPhones[index], label: value };
      }
      return {
        ...prev,
        phones: newPhones,
      };
    });
  };

  // Add new phone number
  const addPhone = () => {
    setFormData((prev) => ({
      ...prev,
      phones: [...prev.phones, { number: "", label: "mobile" }],
    }));
  };

  // Remove phone number
  const removePhone = (index) => {
    setFormData((prev) => ({
      ...prev,
      phones: prev.phones.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setMessage({
          type: "error",
          text: "Please select a valid image file.",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: "Image size must be less than 5MB.",
        });
        return;
      }

      setProfileImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      setMessage({ type: "", text: "" });

      // Auto-save the profile image
      if (user && !isLoading) {
        setIsLoading(true);
        try {
          // Prepare profile data with the new image
          const profileData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            nickname: formData.nickname,
            title: formData.title,
            gender: formData.gender,
            position: formData.position,
            department: formData.department,
            phones: formData.phones.map((phone) => ({
              ...phone,
              number: extractPhoneDigits(phone.number), // Store digits only
            })),
            emergencyContact: {
              ...formData.emergencyContact,
              phone: extractPhoneDigits(formData.emergencyContact.phone), // Store digits only
            },
            profileImage: file,
          };

          const result = await updateProfile(profileData);

          if (result.success) {
            setMessage({
              type: "success",
              text: "Profile picture uploaded and saved successfully!",
            });
            // Clear the profile image state since it's now saved
            setProfileImage(null);
            setProfileImagePreview(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          } else {
            setMessage({
              type: "error",
              text:
                result.error ||
                "Failed to save profile picture. Please try again.",
            });
          }
        } catch (error) {
          console.error("Error auto-saving profile image:", error);
          setMessage({
            type: "error",
            text: "Failed to save profile picture. Please try again.",
          });
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const removeProfileImage = async () => {
    // If there's a preview image (newly selected), just clear it
    if (profileImagePreview) {
      setProfileImage(null);
      setProfileImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // If there's an existing profile image, remove it from the server
    if (user?.icon) {
      setIsLoading(true);
      setMessage({ type: "", text: "" });

      try {
        // Call updateProfile with empty profileImage to remove it
        const result = await updateProfile({
          firstName: formData.firstName,
          lastName: formData.lastName,
          nickname: formData.nickname,
          title: formData.title,
          gender: formData.gender,
          position: formData.position,
          department: formData.department,
          phones: formData.phones,
          emergencyContact: formData.emergencyContact,
          profileImage: null, // This will signal to remove the image
        });

        if (result.success) {
          setMessage({
            type: "success",
            text: "Profile image removed successfully!",
          });
        } else {
          setMessage({
            type: "error",
            text:
              result.error ||
              "Failed to remove profile image. Please try again.",
          });
        }
      } catch (error) {
        console.error("Error removing profile image:", error);
        setMessage({
          type: "error",
          text: "Failed to remove profile image. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.nickname) return user.nickname.charAt(0).toUpperCase();
    if (user?.firstName) return user.firstName.charAt(0).toUpperCase();
    if (user?.lastName) return user.lastName.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  // Handle password change input
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password change submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: "", text: "" });

    // Validate passwords
    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordMessage({
        type: "error",
        text: "All password fields are required.",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "New passwords do not match.",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "New password must be at least 6 characters long.",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Call API to change password (you'll need to implement this in your auth service)
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPasswordMessage({
          type: "success",
          text: "Password changed successfully!",
        });
        // Clear form and close modal after a delay
        setTimeout(resetPasswordModal, 2000);
      } else {
        setPasswordMessage({
          type: "error",
          text: result.error || "Failed to change password. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordMessage({
        type: "error",
        text: "Failed to change password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Prepare profile data
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        nickname: formData.nickname,
        title: formData.title,
        gender: formData.gender,
        position: formData.position,
        department: formData.department,
        phones: formData.phones,
        emergencyContact: formData.emergencyContact,
      };

      // Add profile image if selected
      if (profileImage) {
        profileData.profileImage = profileImage;
      }

      // Call the updateProfile function from AuthContext
      const result = await updateProfile(profileData);

      if (result.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        // Clear the profile image state since it's now saved
        setProfileImage(null);
        setProfileImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to update profile. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsHeader}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Manage your profile information</p>
      </div>

      <div className={styles.settingsContent}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Personal Information</h2>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName" className={styles.label}>
                  <User size={16} />
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter your first name"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lastName" className={styles.label}>
                  <User size={16} />
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="nickname" className={styles.label}>
                <Tag size={16} />
                Nickname
              </label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter your preferred nickname"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.label}>
                  <User size={16} />
                  Title
                </label>
                <select
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={styles.input}
                >
                  <option value="">Select title (optional)</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                  <option value="Dr">Dr</option>
                  <option value="Prof">Prof</option>
                </select>
                <p className={styles.helpText}>
                  Professional or personal title
                </p>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="gender" className={styles.label}>
                  <User size={16} />
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={styles.input}
                >
                  <option value="">Select gender (optional)</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
                <p className={styles.helpText}>
                  This field is optional and for demographic purposes only
                </p>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="position" className={styles.label}>
                  <Briefcase size={16} />
                  Position
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter your job title"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="department" className={styles.label}>
                  <Building size={16} />
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter your department"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Camera size={16} />
                Profile Picture
              </label>
              <div className={styles.profilePictureSection}>
                <div className={styles.profilePicturePreview}>
                  {profileImagePreview || user?.icon ? (
                    <img
                      src={profileImagePreview || user?.icon}
                      alt="Profile"
                      className={styles.profilePictureImage}
                    />
                  ) : (
                    <div className={styles.profilePicturePlaceholder}>
                      {getUserInitials()}
                    </div>
                  )}
                </div>
                <div className={styles.profilePictureActions}>
                  <button
                    type="button"
                    onClick={handleImageClick}
                    className={styles.uploadButton}
                  >
                    <Upload size={16} />
                    {user?.icon || profileImagePreview
                      ? "Change Picture"
                      : "Upload Picture"}
                  </button>
                  {(user?.icon || profileImagePreview) && (
                    <button
                      type="button"
                      onClick={removeProfileImage}
                      className={styles.removeButton}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={styles.hiddenInput}
                />
              </div>
              <p className={styles.helpText}>
                Upload a profile picture (max 5MB). Supported formats: JPG, PNG,
                GIF
              </p>
            </div>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Contact Information</h2>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                <Mail size={16} />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter your email address"
                disabled
              />
              <p className={styles.helpText}>Email address cannot be changed</p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Phone size={16} />
                Phone Numbers
              </label>
              {formData.phones.map((phone, index) => (
                <div key={index} className={styles.phoneRow}>
                  <input
                    type="tel"
                    value={phone.number || ""}
                    onChange={(e) =>
                      handlePhoneChange(index, "number", e.target.value)
                    }
                    className={styles.input}
                    placeholder="(555) 123-4567"
                  />
                  <select
                    value={phone.label || "mobile"}
                    onChange={(e) =>
                      handlePhoneChange(index, "label", e.target.value)
                    }
                    className={styles.input}
                  >
                    <option value="mobile">Mobile</option>
                    <option value="work">Work</option>
                    <option value="home">Home</option>
                    <option value="other">Other</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removePhone(index)}
                    className={styles.removeButton}
                    title="Remove phone number"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addPhone}
                className={styles.uploadButton}
              >
                <Plus size={16} />
                Add Phone Number
              </button>
              <p className={styles.helpText}>
                Add your phone numbers with type labels
              </p>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="emergencyContactName" className={styles.label}>
                  <User size={16} />
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  id="emergencyContactName"
                  name="name"
                  value={formData.emergencyContact.name}
                  onChange={handleEmergencyContactChange}
                  className={styles.input}
                  placeholder="Emergency contact name"
                />
              </div>

              <div className={styles.formGroup}>
                <label
                  htmlFor="emergencyContactRelationship"
                  className={styles.label}
                >
                  <Users size={16} />
                  Emergency Contact Relationship
                </label>
                <select
                  id="emergencyContactRelationship"
                  name="relationship"
                  value={formData.emergencyContact.relationship}
                  onChange={handleEmergencyContactChange}
                  className={styles.input}
                >
                  <option value="">Select relationship</option>
                  <option value="spouse">Spouse</option>
                  <option value="parent">Parent</option>
                  <option value="child">Child</option>
                  <option value="sibling">Sibling</option>
                  <option value="friend">Friend</option>
                  <option value="colleague">Colleague</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="emergencyContactPhone" className={styles.label}>
                  <Phone size={16} />
                  Emergency Contact Phone
                </label>
                <input
                  type="tel"
                  id="emergencyContactPhone"
                  name="phone"
                  value={formData.emergencyContact.phone}
                  onChange={handleEmergencyContactChange}
                  className={styles.input}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="emergencyContactEmail" className={styles.label}>
                  <Mail size={16} />
                  Emergency Contact Email
                </label>
                <input
                  type="email"
                  id="emergencyContactEmail"
                  name="email"
                  value={formData.emergencyContact.email}
                  onChange={handleEmergencyContactChange}
                  className={styles.input}
                  placeholder="Emergency contact email"
                />
              </div>
            </div>
          </div>

          {message.text && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={isLoading}
            >
              <Save size={16} />
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              className={styles.changePasswordButton}
              onClick={() => setShowPasswordModal(true)}
              disabled={isLoading}
            >
              <Lock size={16} />
              Change Password
            </button>
          </div>
        </form>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h3>Change Password</h3>
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={resetPasswordModal}
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={handlePasswordSubmit}
                className={styles.modalForm}
              >
                <div className={styles.formGroup}>
                  <label htmlFor="oldPassword" className={styles.label}>
                    <Lock size={16} />
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="oldPassword"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    className={styles.input}
                    placeholder="Enter your current password"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="newPassword" className={styles.label}>
                    <Lock size={16} />
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={styles.input}
                    placeholder="Enter your new password"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword" className={styles.label}>
                    <Lock size={16} />
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={styles.input}
                    placeholder="Confirm your new password"
                    required
                  />
                </div>

                {passwordMessage.text && (
                  <div
                    className={`${styles.message} ${
                      styles[passwordMessage.type]
                    }`}
                  >
                    {passwordMessage.text}
                  </div>
                )}

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={resetPasswordModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={isLoading}
                  >
                    <Save size={16} />
                    {isLoading ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
