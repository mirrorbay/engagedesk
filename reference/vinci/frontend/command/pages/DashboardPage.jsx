import React, { useState, useEffect } from "react";
import { dashboardAPI } from "../services/api.js";
import UsersSection from "./dashboardPageHelpers/UsersSection.jsx";
import SessionsSection from "./dashboardPageHelpers/SessionsSection.jsx";
import ContactsSection from "./dashboardPageHelpers/ContactsSection.jsx";
import AnalyticsSection from "./dashboardPageHelpers/AnalyticsSection.jsx";
import NewsletterSection from "./dashboardPageHelpers/NewsletterSection.jsx";
import "../styles/global.css";
import styles from "../styles/dashboard.module.css";

function DashboardPage() {
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const loadOverview = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getOverview();
      setOverview(response.data.overview);
      setError("");
    } catch (err) {
      console.error("Failed to load overview:", err);
      setError("Failed to load dashboard overview");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  return (
    <div>
      {error && <div className="error-message mb-1">{error}</div>}

      {/* Notification */}
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      {/* Command Header */}
      <div className={styles.commandHeader}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            Loading command data...
          </div>
        ) : overview ? (
          <div className={styles.commandHeaderContent}>
            <h1 className={styles.commandTitle}>
              Command ({overview.totalUsers} users, {overview.totalSessions}{" "}
              sessions)
            </h1>
            <button className={styles.refreshButton} onClick={loadOverview}>
              Refresh
            </button>
          </div>
        ) : (
          <div className={styles.commandHeaderContent}>
            <h1 className={styles.commandTitle}>Command Header</h1>
            <button className={styles.refreshButton} onClick={loadOverview}>
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* Newsletter Subscribers - Full Width */}
      <div className={styles.fullWidthSection}>
        <NewsletterSection
          showNotification={showNotification}
          setError={setError}
        />
      </div>

      {/* User Records - Full Width */}
      <div className={styles.fullWidthSection}>
        <UsersSection showNotification={showNotification} setError={setError} />
      </div>

      {/* Contact Messages - Full Width */}
      <div className={styles.fullWidthSection}>
        <ContactsSection
          showNotification={showNotification}
          setError={setError}
        />
      </div>

      {/* Analytics Section - Full Width */}
      <AnalyticsSection
        showNotification={showNotification}
        setError={setError}
      />
    </div>
  );
}

export default DashboardPage;
