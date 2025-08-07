import React, { useState, useEffect } from "react";
import { X, Mail } from "lucide-react";
import styles from "./NewsletterBanner.module.css";
import newsletterApi from "../services/newsletterApi";
import { useAuth } from "../hooks/useAuthContext.jsx";

const NewsletterBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Check if banner should be shown
    const checkBannerVisibility = async () => {
      // Check session storage first
      const bannerDismissed = sessionStorage.getItem(
        "newsletter_banner_dismissed"
      );
      const userSubscribed = sessionStorage.getItem("newsletter_subscribed");

      if (bannerDismissed === "true" || userSubscribed === "true") {
        return;
      }

      // If user is authenticated, check if they're already subscribed
      if (isAuthenticated && user && user.email) {
        try {
          const status = await newsletterApi.checkStatus(user.email);
          if (status.subscribed) {
            sessionStorage.setItem("newsletter_subscribed", "true");
            return;
          }
        } catch (error) {
          console.error("Error checking subscription status:", error);
        }
      }

      // Show banner after a short delay
      setTimeout(() => {
        setIsVisible(true);
      }, 2000);
    };

    checkBannerVisibility();
  }, [isAuthenticated, user]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("newsletter_banner_dismissed", "true");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address");
      setMessageType("error");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await newsletterApi.subscribe(email.trim());
      setMessage(response.message);
      setMessageType("success");
      sessionStorage.setItem("newsletter_subscribed", "true");

      // Hide banner after successful subscription
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    } catch (error) {
      setMessage(error.message || "Failed to subscribe. Please try again.");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pre-fill email if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user && user.email && !email) {
      setEmail(user.email);
    }
  }, [isAuthenticated, user, email]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.banner}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.iconSection}>
            <Mail className={styles.icon} size={24} />
          </div>

          <div className={styles.textSection}>
            <h3 className={styles.title}>ADHD School Success Newsletter</h3>
            <p className={styles.description}>
              Weekly wins: proven strategies for K-12 ADHD success.
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={styles.emailInput}
                disabled={isSubmitting}
                required
              />
              <button
                type="submit"
                className={styles.subscribeButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
            </div>

            {message && (
              <div className={`${styles.message} ${styles[messageType]}`}>
                {message}
              </div>
            )}
          </form>
        </div>

        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close newsletter banner"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default NewsletterBanner;
