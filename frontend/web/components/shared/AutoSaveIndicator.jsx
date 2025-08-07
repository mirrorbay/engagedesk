import React from "react";
import { Save, Check } from "lucide-react";
import styles from "../../styles/shared/autoSaveIndicator.module.css";

/**
 * Auto-save status indicator component
 * @param {Object} autoSave - Auto-save state from useAutoSave hook
 * @param {string} className - Additional CSS classes
 * @param {boolean} showText - Whether to show text alongside icons (default: true)
 * @param {string} position - Position of the indicator ('top-right', 'bottom-right', etc.)
 */
const AutoSaveIndicator = ({
  autoSave,
  className = "",
  showText = true,
  position = "top-right",
}) => {
  // Don't render if no auto-save state
  if (!autoSave) return null;

  const { isSaving, lastSaved, hasUnsavedChanges, error } = autoSave;

  const getStatusInfo = () => {
    // Show saving state
    if (isSaving) {
      return {
        icon: Save,
        text: "Saving...",
        className: styles.saving,
        title: "Auto-saving changes",
      };
    }

    // Show saved state (only if lastSaved is set and we actually performed a save)
    if (lastSaved && !hasUnsavedChanges) {
      return {
        icon: Check,
        text: "Saved   ",
        className: styles.saved,
        title: `Last saved: ${lastSaved.toLocaleTimeString()}`,
      };
    }

    return null;
  };

  const statusInfo = getStatusInfo();

  if (!statusInfo) return null;

  const { icon: Icon, text, className: statusClassName, title } = statusInfo;

  return (
    <div
      className={`${styles.autoSaveIndicator} ${styles[position]} ${statusClassName} ${className}`}
      title={title}
    >
      <Icon
        size={16}
        className={`${styles.icon} ${isSaving ? styles.spinning : ""}`}
      />
      {showText && <span className={styles.text}>{text}</span>}
    </div>
  );
};

export default AutoSaveIndicator;
