import React from "react";
import styles from "../../styles/dashboard.module.css";

function OverviewSection({ overview, loading, onRefresh }) {
  if (loading) {
    return (
      <div className={styles.overviewSection}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          Loading overview...
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className={styles.overviewSection}>
        <div className={styles.overviewTitle}>
          System Overview
          <button className={styles.refreshButton} onClick={onRefresh}>
            Refresh
          </button>
        </div>
        <div className={styles.loading}>No data available</div>
      </div>
    );
  }

  return (
    <div className={styles.overviewSection}>
      <div className={styles.overviewTitle}>
        System Overview
        <button className={styles.refreshButton} onClick={onRefresh}>
          Refresh
        </button>
      </div>

      <div className={styles.overviewStats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{overview.totalUsers}</div>
          <div className={styles.statLabel}>Total Users</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statValue}>{overview.paidUsers}</div>
          <div className={styles.statLabel}>Paid Users</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statValue}>{overview.totalSessions}</div>
          <div className={styles.statLabel}>Total Sessions</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statValue}>{overview.unreadContacts}</div>
          <div className={styles.statLabel}>Unread Messages</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statValue}>{overview.newUsersLast30Days}</div>
          <div className={styles.statLabel}>New Users (30d)</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statValue}>{overview.sessionsLast30Days}</div>
          <div className={styles.statLabel}>Sessions (30d)</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statValue}>${overview.totalRevenue}</div>
          <div className={styles.statLabel}>Total Revenue</div>
        </div>
      </div>
    </div>
  );
}

export default OverviewSection;
