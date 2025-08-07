import React, { useState, useEffect } from "react";
import { X, Mail } from "lucide-react";
import { clientService } from "../../services/clientService";
import { useAuth } from "../../utils/AuthContext";
import RichTextEditor from "../shared/RichTextEditor";
import styles from "../../styles/client/emailModal.module.css";

const EmailModal = ({ client, onClose, onSent }) => {
  const [formData, setFormData] = useState({
    subject: "",
    content: "",
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Set default subject
    setFormData((prev) => ({
      ...prev,
      subject: `Follow up with ${client.firstName} ${client.lastName}`,
    }));
  }, [client]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const validateUserInfo = () => {
    if (!user) {
      return "User not authenticated";
    }

    if (!user.email) {
      return "User email is required but not found";
    }

    // Check if user has a name (firstName + lastName) or fallback to email
    const hasName = user.firstName && user.lastName;
    if (!hasName && !user.email) {
      return "User must have either a name or email address";
    }

    return null;
  };

  const getUserFromName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.email;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject.trim()) {
      setError("Subject is required");
      return;
    }

    if (!formData.content.trim()) {
      setError("Email content is required");
      return;
    }

    // Validate user information
    const userValidationError = validateUserInfo();
    if (userValidationError) {
      setError(userValidationError);
      return;
    }

    setSending(true);
    setError(null);

    try {
      const emailData = {
        userId: user._id,
        subject: formData.subject,
        htmlContent: formData.content, // All emails are HTML now
        fromName: getUserFromName(),
        fromEmail: user.email,
      };

      const result = await clientService.sendEmail(client._id, emailData);

      if (result.success) {
        setSuccess(true);

        // Call onSent callback with result
        if (onSent) {
          onSent(result.data);
        }

        // Auto-close after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const getClientInitials = () => {
    return `${client.firstName?.[0] || ""}${
      client.lastName?.[0] || ""
    }`.toUpperCase();
  };

  // Don't close modal when clicking outside
  const handleOverlayClick = (e) => {
    // Removed the auto-close functionality
    // Modal can only be closed via close button or cancel button
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Compose Email</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.clientInfo}>
            <div className={styles.clientAvatar}>{getClientInitials()}</div>
            <div className={styles.clientDetails}>
              <div className={styles.toLabel}>To:</div>
              <h3>
                {client.title && `${client.title} `}
                {client.firstName} {client.lastName}
                {client.nickname && ` "${client.nickname}"`}
              </h3>
              <p>{client.email}</p>
              {client.company && <p>{client.company}</p>}
            </div>
          </div>

          {error && (
            <div className={styles.error}>
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className={styles.success}>
              <span>✅</span>
              <p>Email sent successfully! Closing window...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                From: {getUserFromName()} ({user?.email})
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Subject *</label>
              <input
                type="text"
                className={styles.input}
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="Email subject"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Content *</label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => handleInputChange("content", value)}
                placeholder="Enter your email content here..."
              />
            </div>
          </form>
        </div>

        <div className={styles.modalFooter}>
          <div className={styles.sending}>
            {sending && (
              <>
                <div className={styles.sendingSpinner}></div>
                <span>Sending email...</span>
              </>
            )}
          </div>

          <div className={styles.footerActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={sending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.sendButton}
              onClick={handleSubmit}
              disabled={sending || success}
            >
              <Mail size={16} />
              Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
