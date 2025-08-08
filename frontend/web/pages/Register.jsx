import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import styles from "../styles/login.module.css";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    nickname: "",
    phoneNumber: "",
    clientManagementPreference: "",
    clientManagementOther: "",
  });
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  // Extract email from URL parameters and populate the form
  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    if (emailFromUrl) {
      setFormData((prevData) => ({
        ...prevData,
        email: decodeURIComponent(emailFromUrl),
      }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Handle showing/hiding the "other" input field
    if (name === "clientManagementPreference") {
      setShowOtherInput(value === "other");
      if (value !== "other") {
        setFormData((prev) => ({ ...prev, clientManagementOther: "" }));
      }
    }

    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { email, password, confirmPassword, clientManagementPreference } =
      formData;

    if (!email || !password) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (!clientManagementPreference) {
      setError(
        "Please select what's most important to you in a client management tool"
      );
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const result = await register(formData);

    if (result.success) {
      // Redirect to maintenance page after successful registration
      navigate("/maintenance");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1>Create Account</h1>
          <p>Join EngageDesk to manage your client relationships</p>
        </div>

        <div className={styles.formNote}>
          All fields are optional except those with{" "}
          <span className={styles.required}>*</span>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="nickname">Nickname (Preferred Name)</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="How would you like to be addressed?"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">
              Email Address <span className={styles.required}>*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="clientManagementPreference">
              What's most important to you in a client management tool?{" "}
              <span className={styles.required}>*</span>
            </label>
            <select
              id="clientManagementPreference"
              name="clientManagementPreference"
              value={formData.clientManagementPreference}
              onChange={handleChange}
              required
            >
              <option value="">Select your top priority...</option>
              <option value="client-follow-up-assistance">
                Client Follow-up Assistance
              </option>
              <option value="automated-email-tracking">
                Automated Email Tracking
              </option>
              <option value="easy-intuitive-interface">
                Easy & Intuitive Interface
              </option>
              <option value="cost-effectiveness">Cost Effectiveness</option>
              <option value="smart-pipeline-management">
                Smart Pipeline Management
              </option>
              <option value="calendar-scheduling-integration">
                Calendar & Scheduling Integration
              </option>
              <option value="client-file-organization">
                Client File Organization
              </option>
              <option value="real-time-engagement-insights">
                Real-time Engagement Insights
              </option>
              <option value="other">Other (please specify)</option>
            </select>
          </div>

          {showOtherInput && (
            <div className={styles.formGroup}>
              <label htmlFor="clientManagementOther">
                Please specify what's most important to you:
              </label>
              <input
                type="text"
                id="clientManagementOther"
                name="clientManagementOther"
                value={formData.clientManagementOther}
                onChange={handleChange}
                placeholder="Describe your top priority..."
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="password">
              Password <span className={styles.required}>*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password (min 6 characters)"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">
              Confirm Password <span className={styles.required}>*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className={styles.authFooter}>
          <p>
            Already have an account?{" "}
            <Link to="/login" className={styles.linkButton}>
              Sign in
            </Link>
          </p>
          <p>
            <Link to="/" className={styles.linkButton}>
              Back to Homepage
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
