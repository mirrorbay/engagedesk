import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Send, Check, X } from "lucide-react";
import contactApi from "../services/contactApi";
import SEOHead from "../components/SEOHead.jsx";
import "../styles/global.css";
import styles from "../styles/contact.module.css";

const CONTACT_CONFIG = {
  TOPICS: [
    "General Inquiry",
    "Technical Support",
    "Billing & Subscription",
    "Feature Request",
    "Bug Report",
    "Partnership",
    "Other",
  ],
  MIN_MESSAGE_LENGTH: 10,
  MAX_MESSAGE_LENGTH: 1000,
};

function ContactPage() {
  const navigate = useNavigate();

  // Contact info state
  const [contactInfo, setContactInfo] = useState(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  // Load contact information on component mount
  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        const info = await contactApi.getContactInfo();
        setContactInfo(info);
      } catch (err) {
        console.error("Error loading contact info:", err);
        setError("Failed to load contact information. Please try again later.");
      } finally {
        setIsLoadingInfo(false);
      }
    };

    loadContactInfo();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear general error
    if (error) {
      setError("");
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    if (!formData.topic) {
      errors.topic = "Please select a topic";
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (
      formData.message.trim().length < CONTACT_CONFIG.MIN_MESSAGE_LENGTH
    ) {
      errors.message = `Message must be at least ${CONTACT_CONFIG.MIN_MESSAGE_LENGTH} characters`;
    } else if (
      formData.message.trim().length > CONTACT_CONFIG.MAX_MESSAGE_LENGTH
    ) {
      errors.message = `Message must be less than ${CONTACT_CONFIG.MAX_MESSAGE_LENGTH} characters`;
    }

    return errors;
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate("/home");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset states
    setError("");
    setValidationErrors({});

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      await contactApi.submitContactMessage(formData);
      setShowSuccessModal(true);

      // Reset form
      setFormData({
        name: "",
        email: "",
        topic: "",
        message: "",
      });
    } catch (err) {
      console.error("Error submitting contact message:", err);
      setError(
        err.message || "Failed to send message. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingInfo) {
    return (
      <div className={styles.contactContainer}>
        <div className={styles.loadingContainer}>
          <div className="spinner"></div>
          <p>Loading contact information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contactContainer}>
      <SEOHead
        title="Contact DaVinci Focus | Get Help with ADHD Focus Training"
        description="Contact DaVinci Focus for support with ADHD focus training. Get help with technical issues, billing, or questions about our 10-minute daily math practice program for children with attention challenges."
        keywords="contact DaVinci Focus, ADHD support, focus training help, customer service, technical support, billing help, attention training contact"
        image="/1.png"
      />
      {/* Header Section */}
      <div className={styles.contactHeader}>
        <div className={styles.headerInfo}>
          <h1 className={styles.contactTitle}>Contact Us</h1>
          <div className={styles.headerSubtitle}>
            Get in touch with our team. We're here to help with any questions or
            support you need.
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* Main Content - Single Container */}
      <div className={styles.contactSection}>
        {/* Contact Information Section */}
        <div className={styles.formGroup}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionNumber}>CONTACT INFO</div>
            <div className={styles.sectionTitle}>Get In Touch</div>
            <div className={styles.sectionSubtitle}>
              Reach out to us through any of the following channels. We're here
              to help!
            </div>
          </div>

          {contactInfo && (
            <div className={styles.contactInfoList}>
              <div className={styles.contactInfoItem}>
                <MapPin size={20} className={styles.contactIcon} />
                <span className={styles.contactLabel}>Office:</span>
                <span className={styles.contactValue}>
                  {contactInfo.office.address}
                </span>
              </div>

              <div className={styles.contactInfoItem}>
                <Phone size={20} className={styles.contactIcon} />
                <span className={styles.contactLabel}>Phone:</span>
                <span className={styles.contactValue}>
                  {contactInfo.office.phone}
                </span>
              </div>

              <div className={styles.contactInfoItem}>
                <Mail size={20} className={styles.contactIcon} />
                <span className={styles.contactLabel}>Email:</span>
                <a
                  href={`mailto:${contactInfo.office.email}`}
                  className={styles.contactValue}
                >
                  {contactInfo.office.email}
                </a>
              </div>

              <div className={styles.contactInfoItem}>
                <Clock size={20} className={styles.contactIcon} />
                <span className={styles.contactLabel}>Hours:</span>
                <span className={styles.contactValue}>
                  {contactInfo.office.hours}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Contact Form Section */}
        <div className={styles.formGroup}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionNumber}>SEND MESSAGE</div>
            <div className={styles.sectionTitle}>Leave Us a Message</div>
            <div className={styles.sectionSubtitle}>
              Fill out the form below and we'll get back to you as soon as
              possible.
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.contactForm}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.formLabel}>
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`${styles.formInput} ${
                    validationErrors.name ? styles.inputError : ""
                  }`}
                  placeholder="Enter your full name"
                />
                {validationErrors.name && (
                  <div className={styles.fieldError}>
                    {validationErrors.name}
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.formLabel}>
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`${styles.formInput} ${
                    validationErrors.email ? styles.inputError : ""
                  }`}
                  placeholder="Enter your email address"
                />
                {validationErrors.email && (
                  <div className={styles.fieldError}>
                    {validationErrors.email}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="topic" className={styles.formLabel}>
                Topic *
              </label>
              <select
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                className={`${styles.formSelect} ${
                  validationErrors.topic ? styles.inputError : ""
                }`}
              >
                <option value="">Select a topic</option>
                {CONTACT_CONFIG.TOPICS.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
              {validationErrors.topic && (
                <div className={styles.fieldError}>
                  {validationErrors.topic}
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.formLabel}>
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className={`${styles.formTextarea} ${
                  validationErrors.message ? styles.inputError : ""
                }`}
                placeholder="Tell us how we can help you..."
                rows={6}
              />
              <div className={styles.messageCounter}>
                {formData.message.length}/{CONTACT_CONFIG.MAX_MESSAGE_LENGTH}{" "}
                characters
              </div>
              {validationErrors.message && (
                <div className={styles.fieldError}>
                  {validationErrors.message}
                </div>
              )}
            </div>

            <div className={styles.submitButtonContainer}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send size={18} />
                    SEND MESSAGE
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Confirmation Modal */}
      {showSuccessModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Message Sent!</h2>
              <button
                className={styles.modalCloseButton}
                onClick={handleCloseModal}
              >
                <X size={24} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.successContainer}>
                <div className={styles.successIcon}>
                  <Check size={48} />
                </div>
                <div className={styles.successContent}>
                  <div className={styles.successText}>
                    Your message has been sent successfully!
                  </div>
                  <div className={styles.successSubtext}>
                    We've received your message and will get back to you as soon
                    as possible. Thank you for contacting us!
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.modalOkButton}
                onClick={handleCloseModal}
              >
                <Check size={20} />
                GOT IT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactPage;
