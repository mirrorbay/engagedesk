import React, { useEffect, useState } from "react";
import { Check, X, Loader2, Wifi, WifiOff } from "lucide-react";
import styles from "./AutosaveSpinner.module.css";

const AutosaveSpinner = ({ status }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      // Hide the component after a delay
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        // Remove from DOM after animation completes
        setTimeout(() => setShouldRender(false), 300);
      }, 2000);
      return () => clearTimeout(hideTimer);
    } else {
      // Show the component immediately
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10); // Small delay for animation
    }
  }, [status]);

  const getStatusConfig = () => {
    switch (status) {
      case "saving":
        return {
          icon: <Loader2 size={16} className={styles.spinningIcon} />,
          text: "Saving...",
          className: styles.saving,
          showProgress: true,
        };
      case "saved":
        return {
          icon: <Check size={16} />,
          text: "Saved",
          className: styles.saved,
          showProgress: false,
        };
      case "error":
        return {
          icon: <WifiOff size={16} />,
          text: "Unable to save changes",
          className: styles.error,
          showProgress: false,
        };
      default:
        return null;
    }
  };

  if (!shouldRender) return null;

  const config = getStatusConfig();
  if (!config) return null;

  return (
    <div className={styles.toastContainer}>
      <div
        className={`${styles.autosaveToast} ${config.className} ${
          isVisible ? styles.visible : styles.hidden
        }`}
      >
        <div className={styles.content}>
          <div className={styles.iconContainer}>{config.icon}</div>
          <span className={styles.text}>{config.text}</span>
        </div>
        {config.showProgress && (
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutosaveSpinner;
