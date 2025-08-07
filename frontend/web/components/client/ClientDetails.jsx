import React, { useState, useEffect, useCallback } from "react";
import {
  Save,
  Edit3,
  X,
  Plus,
  User,
  Mail,
  Building,
  MapPin,
  Phone,
  Info,
} from "lucide-react";
import { useAuth } from "../../utils/AuthContext";
import { useAutoSave } from "../../utils/useAutoSave";
import { useAutoSaveContext } from "../../utils/AutoSaveContext";
import { clientService } from "../../services/clientService";
import { formatPhoneNumber, extractPhoneDigits } from "../../utils/formatter";
import CommentSection from "./CommentSection";
import InteractionRecords from "./InteractionRecords";
import styles from "../../styles/client/clientDetails.module.css";

// US States and territories
const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "DC", label: "District of Columbia" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "OTHER", label: "Other (Overseas)" },
];

const ClientDetails = ({
  client,
  onClientUpdate,
  onClientSelect,
  loading = false,
}) => {
  const { user } = useAuth();
  const { updateAutoSaveState, clearAutoSaveState } = useAutoSaveContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    title: "",
    email: "",
    company: "",
    position: "",
    department: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    phones: [],
    interests: [],
    preferenceTags: [],
  });

  // Fetch available tags on component mount
  useEffect(() => {
    const fetchTags = async () => {
      const result = await clientService.getClientTags();
      if (result.success) {
        setAvailableTags(result.data);
      }
    };
    fetchTags();
  }, []);

  // Helper function to prepare client data for auto-save
  const prepareClientData = useCallback(() => {
    return {
      ...formData,
      phones: formData.phones.map((phone) => ({
        type: extractPhoneDigits(phone.type),
        label: phone.label,
      })),
    };
  }, [formData]);

  // Auto-save function for client data
  const autoSaveClient = useCallback(
    async (data) => {
      console.log("[ClientDetails] Auto-save triggered with data:", data);

      // Don't auto-save if there's no client or if we're currently loading
      if (!client || isLoading || !isEditing) {
        console.log(
          "[ClientDetails] Auto-save skipped - no client, loading, or not editing"
        );
        return;
      }

      const result = await clientService.updateClient(
        client._id,
        prepareClientData()
      );
      console.log("[ClientDetails] Auto-save result:", result);

      if (result.success) {
        onClientUpdate(result.data);
      }

      return result;
    },
    [client, isLoading, isEditing, prepareClientData, onClientUpdate]
  );

  // Auto-save hook configuration
  const autoSave = useAutoSave(formData, autoSaveClient, {
    delay: 2000, // 2 second delay
    enabled: !!client && isInitialDataLoaded && isEditing, // Enable only when client is loaded, initial data is populated, and editing
    excludeFields: ["email"], // Don't trigger auto-save on email changes (it's not editable anyway)
    onSaveStart: () => {
      setMessage({ type: "", text: "" }); // Clear any existing messages
    },
    onSaveSuccess: (result) => {
      console.log("[ClientDetails] Auto-save successful");
    },
    onSaveError: (error) => {
      console.error("[ClientDetails] Auto-save failed:", error);
      setMessage({
        type: "error",
        text: "Auto-save failed. Your changes may not be saved.",
      });
    },
    shouldSave: (data) => {
      // Only auto-save if we have meaningful data
      return !!(data.firstName || data.lastName || data.company);
    },
  });

  // Update the global auto-save state when local auto-save state changes
  useEffect(() => {
    console.log(
      "[ClientDetails] useEffect triggered - updating autoSave state:",
      {
        isSaving: autoSave.isSaving,
        lastSaved: autoSave.lastSaved,
        hasUnsavedChanges: autoSave.hasUnsavedChanges,
        error: autoSave.error,
      }
    );
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

  // Initialize form data when client changes
  useEffect(() => {
    if (client && !isInitialDataLoaded) {
      console.log(
        "[ClientDetails] Initializing form data with client:",
        client
      );
      setFormData({
        firstName: client.firstName || "",
        lastName: client.lastName || "",
        nickname: client.nickname || "",
        title: client.title || "",
        email: client.email || "",
        company: client.company || "",
        position: client.position || "",
        department: client.department || "",
        address: {
          street: client.address?.street || "",
          city: client.address?.city || "",
          state: client.address?.state || "",
          zipCode: client.address?.zipCode || "",
        },
        phones: client.phones || [],
        interests: client.interests || [],
        preferenceTags: client.preferenceTags || [],
      });

      // Mark initial data as loaded after a brief delay to ensure form data is set
      setTimeout(() => {
        setIsInitialDataLoaded(true);
        console.log("[ClientDetails] Initial data loaded, autosave enabled");
      }, 100);
    }
  }, [client, isInitialDataLoaded]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handlePhoneChange = (index, field, value) => {
    setFormData((prev) => {
      const newPhones = [...prev.phones];
      if (field === "type") {
        const formattedValue = formatPhoneNumber(value);
        newPhones[index] = { ...newPhones[index], type: formattedValue };
      } else if (field === "label") {
        newPhones[index] = { ...newPhones[index], label: value };
      }
      return {
        ...prev,
        phones: newPhones,
      };
    });
  };

  const addPhone = () => {
    setFormData((prev) => ({
      ...prev,
      phones: [...prev.phones, { type: "", label: "mobile" }],
    }));
  };

  const removePhone = (index) => {
    setFormData((prev) => ({
      ...prev,
      phones: prev.phones.filter((_, i) => i !== index),
    }));
  };

  const handleTagToggle = (tag) => {
    setFormData((prev) => ({
      ...prev,
      preferenceTags: prev.preferenceTags.includes(tag)
        ? prev.preferenceTags.filter((t) => t !== tag)
        : [...prev.preferenceTags, tag],
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Prepare data for API
      const updateData = {
        ...formData,
        phones: formData.phones.map((phone) => ({
          type: extractPhoneDigits(phone.type),
          label: phone.label,
        })),
      };

      const result = await clientService.updateClient(client._id, updateData);

      if (result.success) {
        setMessage({ type: "success", text: "Client updated successfully!" });
        setIsEditing(false);
        onClientUpdate(result.data);
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to update client",
        });
      }
    } catch (error) {
      console.error("Error updating client:", error);
      setMessage({
        type: "error",
        text: "Failed to update client. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original client data
    if (client) {
      setFormData({
        firstName: client.firstName || "",
        lastName: client.lastName || "",
        nickname: client.nickname || "",
        title: client.title || "",
        email: client.email || "",
        company: client.company || "",
        position: client.position || "",
        department: client.department || "",
        address: {
          street: client.address?.street || "",
          city: client.address?.city || "",
          state: client.address?.state || "",
          zipCode: client.address?.zipCode || "",
        },
        phones: client.phones || [],
        interests: client.interests || [],
        preferenceTags: client.preferenceTags || [],
      });
    }
    setIsEditing(false);
    setMessage({ type: "", text: "" });
  };

  if (!client) {
    return (
      <div className={styles.clientDetailsContainer}>
        <div className={styles.placeholder}>
          {loading
            ? "Loading client details..."
            : "Select a client to view and edit details"}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.clientDetailsContainer}>
        <div className={styles.placeholder}>Loading client details...</div>
      </div>
    );
  }

  return (
    <div className={styles.clientDetailsContainer}>
      <div className={styles.clientDetailsHeader}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>Client Details</h2>
          <p className={styles.subtitle}>
            View and manage client information and team comments
          </p>
        </div>
      </div>

      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <div className={styles.clientDetailsContent}>
        {/* Interaction Records Section */}
        <InteractionRecords
          client={client}
          onEmailClient={(client) =>
            onClientSelect && onClientSelect(client, "email")
          }
        />

        {/* Client Info Section Header */}
        <div className={styles.header}>
          <h3 className={styles.title}>
            <Info size={18} />
            Client Info
          </h3>
          <div className={styles.headerActions}>
            {!isEditing ? (
              <button
                className={styles.editButton}
                onClick={() => setIsEditing(true)}
              >
                <Edit3 size={16} />
                Edit
              </button>
            ) : (
              <div className={styles.editActions}>
                <button
                  className={styles.cancelButton}
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  className={styles.saveButton}
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  <Save size={16} />
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.detailsGrid}>
          {/* Personal Information Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <User size={18} />
              Personal Information
            </h3>
            <div className={styles.sectionContent}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Enter first name"
                    />
                  ) : (
                    <div className={styles.value}>
                      {formData.firstName || "—"}
                    </div>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Enter last name"
                    />
                  ) : (
                    <div className={styles.value}>
                      {formData.lastName || "—"}
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Nick Name (Preferred name)
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Enter preferred name"
                    />
                  ) : (
                    <div className={styles.value}>
                      {formData.nickname || "—"}
                    </div>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Title</label>
                  {isEditing ? (
                    <select
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={styles.input}
                    >
                      <option value="">Select title</option>
                      <option value="Mr">Mr</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Ms">Ms</option>
                      <option value="Dr">Dr</option>
                      <option value="Prof">Prof</option>
                    </select>
                  ) : (
                    <div className={styles.value}>{formData.title || "—"}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <Mail size={18} />
              Contact Information
            </h3>
            <div className={styles.sectionContent}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <div className={styles.value}>
                  <a
                    href={`mailto:${formData.email}`}
                    className={styles.emailLink}
                  >
                    {formData.email}
                  </a>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className={styles.phoneSection}>
                <label className={styles.label}>Phone Numbers</label>
                {isEditing ? (
                  <>
                    {formData.phones.map((phone, index) => (
                      <div key={index} className={styles.phoneRow}>
                        <input
                          type="tel"
                          value={phone.type || ""}
                          onChange={(e) =>
                            handlePhoneChange(index, "type", e.target.value)
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
                      className={styles.addButton}
                    >
                      <Plus size={16} />
                      Add Phone Number
                    </button>
                  </>
                ) : (
                  <div className={styles.phoneList}>
                    {formData.phones.length > 0 ? (
                      formData.phones.map((phone, index) => (
                        <div key={index} className={styles.phoneItem}>
                          <span className={styles.phoneLabel}>
                            {phone.label || "mobile"}:
                          </span>
                          <a
                            href={`tel:${phone.type}`}
                            className={styles.phoneLink}
                          >
                            {phone.type}
                          </a>
                        </div>
                      ))
                    ) : (
                      <div className={styles.value}>—</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Company Information Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <Building size={18} />
              Company Information
            </h3>
            <div className={styles.sectionContent}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Company</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Enter company name"
                    />
                  ) : (
                    <div className={styles.value}>
                      {formData.company || "—"}
                    </div>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Department</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Enter department"
                    />
                  ) : (
                    <div className={styles.value}>
                      {formData.department || "—"}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Position</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter position"
                  />
                ) : (
                  <div className={styles.value}>{formData.position || "—"}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Preference Tags</label>
                {isEditing ? (
                  <div className={styles.tagSelector}>
                    {availableTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        className={`${styles.tagButton} ${
                          formData.preferenceTags.includes(tag)
                            ? styles.tagSelected
                            : ""
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className={styles.tagList}>
                    {formData.preferenceTags.length > 0 ? (
                      formData.preferenceTags.map((tag, index) => (
                        <span key={index} className={styles.tag}>
                          {tag}
                        </span>
                      ))
                    ) : (
                      <div className={styles.value}>—</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <MapPin size={18} />
              Address
            </h3>
            <div className={styles.sectionContent}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Street Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="street"
                    value={formData.address.street}
                    onChange={handleAddressChange}
                    className={styles.input}
                    placeholder="Enter street address"
                  />
                ) : (
                  <div className={styles.value}>
                    {formData.address.street || "—"}
                  </div>
                )}
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={formData.address.city}
                      onChange={handleAddressChange}
                      className={styles.input}
                      placeholder="Enter city"
                    />
                  ) : (
                    <div className={styles.value}>
                      {formData.address.city || "—"}
                    </div>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>State</label>
                  {isEditing ? (
                    <select
                      name="state"
                      value={formData.address.state}
                      onChange={handleAddressChange}
                      className={styles.input}
                    >
                      <option value="">Select state</option>
                      {US_STATES.map((state) => (
                        <option key={state.value} value={state.value}>
                          {state.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className={styles.value}>
                      {US_STATES.find((s) => s.value === formData.address.state)
                        ?.label ||
                        formData.address.state ||
                        "—"}
                    </div>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>ZIP Code</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.address.zipCode}
                      onChange={handleAddressChange}
                      className={styles.input}
                      placeholder="Enter ZIP code"
                    />
                  ) : (
                    <div className={styles.value}>
                      {formData.address.zipCode || "—"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <CommentSection
          client={client}
          onClientUpdate={onClientUpdate}
          isLoading={isLoading}
          setMessage={setMessage}
        />
      </div>
    </div>
  );
};

export default ClientDetails;
