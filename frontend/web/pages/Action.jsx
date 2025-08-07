import React from "react";
import styles from "../styles/action.module.css";

function ActionPage() {
  return (
    <div className={styles.actionPage}>
      <div className={styles.header}>
        <h1 className="text-3xl font-bold mb-md">Action Dashboard</h1>
        <p className="text-lg text-secondary mb-lg">
          Manage your daily actions and calendar events
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.calendarSection}>
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold">Calendar</h2>
            </div>
            <div className="card-body">
              <div className={styles.calendarPlaceholder}>
                Calendar component will be implemented here
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actionsSection}>
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold">Actions</h2>
            </div>
            <div className="card-body">
              <div className={styles.actionsPlaceholder}>
                Actions list will be implemented here
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActionPage;
