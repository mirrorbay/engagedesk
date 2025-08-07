import React, { useState } from "react";
import { X, User, Building, Mail } from "lucide-react";
import { clientService } from "../../services/clientService";
import { useAuth } from "../../utils/AuthContext";
import styles from "../../styles/client/clientModal.module.css";

const ClientModal = ({ isOpen, onClose, onClientCreated }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear any error messages when user starts typing
    if (message.type === "error") {
      setMessage({ type: "", text: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Validate required fields
      if (
        !formData.email ||
        !formData.firstName ||
        !formData.lastName ||
        !formData.company
      ) {
        setMessage({
          type: "error",
          text: "All fields are required.",
        });
        return;
      }

      // Prepare client data with current user as client captain
      const clientData = {
        ...formData,
        clientCaptains: user ? [user._id] : [],
      };

      const result = await clientService.createClient(clientData);

      if (result.success) {
        setMessage({
          type: "success",
          text: "Client created successfully!",
        });

        // Close modal after a delay and notify parent
        setTimeout(() => {
          onClientCreated(result.data);
          handleClose();
        }, 1500);
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to create client. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error creating client:", error);
      setMessage({
        type: "error",
        text: "Failed to create client. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      company: "",
    });
    setMessage({ type: "", text: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Create New Client</h3>
          <button
            type="button"
            className={styles.closeButton}
            onClick={handleClose}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formSection}>
            <p className={styles.description}>
              Create a new client record with basic information. Additional
              details can be edited after the client is created.
            </p>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                <Mail size={16} />
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                className={styles.input}
                placeholder="Enter email address"
                required
              />
              <p className={styles.helpText}>
                Email cannot be changed once the client is created
              </p>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName" className={styles.label}>
                  <User size={16} />
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleFormChange}
                  className={styles.input}
                  placeholder="Enter first name"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lastName" className={styles.label}>
                  <User size={16} />
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleFormChange}
                  className={styles.input}
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="company" className={styles.label}>
                <Building size={16} />
                Company *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleFormChange}
                className={styles.input}
                placeholder="Enter company name"
                required
              />
            </div>
          </div>

          {message.text && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={loading}
            >
              <User size={16} />
              {loading ? "Creating..." : "Create Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientModal;
