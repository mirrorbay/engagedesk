import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/maintenance.module.css";

const Maintenance = () => {
  return (
    <div className={styles.maintenanceContainer}>
      <div className={styles.maintenanceCard}>
        <div className={styles.errorCode}>404</div>
        <div className={styles.maintenanceHeader}>
          <h1>System Under Maintenance</h1>
          <p>
            We're currently performing scheduled maintenance to improve your
            experience.
          </p>
        </div>

        <div className={styles.maintenanceContent}>
          <div className={styles.messageContainer}>
            <h2>We'll be back soon!</h2>
            <p>
              Our team is working hard to bring you new features and
              improvements. The system will be back online shortly.
            </p>
            <p>Thank you for your patience and understanding.</p>
          </div>
        </div>

        <div className={styles.maintenanceFooter}>
          <p>
            Need immediate assistance? Contact our support team at{" "}
            <a
              href="mailto:support@engagedesk.io"
              className={styles.supportLink}
            >
              support@engagedesk.io
            </a>
          </p>
          <div className={styles.actionButtons}>
            <Link to="/" className={styles.homeButton}>
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
