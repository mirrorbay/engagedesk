import React, { useMemo } from "react";
import { X } from "lucide-react";
import styles from "./CelebrationModal.module.css";

// Page completion messages - focused on effort and progress, not accuracy
const CELEBRATION_MESSAGES = [
  "Nice work!",
  "Keep it up!",
  "You're making progress!",
  "Good effort!",
  "Moving forward!",
  "Way to go!",
  "You're on track!",
  "Great progress!",
];

// Simple continue phrases
const CONTINUE_PHRASES = [
  "Continue",
  "Keep going",
  "Next page",
  "Move forward",
];

// Color themes for variety (subtle, non-distracting)
const COLOR_THEMES = [
  { primary: "#22c55e", secondary: "#16a34a", accent: "#fbbf24" }, // Green-gold
  { primary: "#3b82f6", secondary: "#2563eb", accent: "#f59e0b" }, // Blue-amber
  { primary: "#8b5cf6", secondary: "#7c3aed", accent: "#10b981" }, // Purple-emerald
  { primary: "#06b6d4", secondary: "#0891b2", accent: "#f97316" }, // Cyan-orange
  { primary: "#ec4899", secondary: "#db2777", accent: "#84cc16" }, // Pink-lime
];

const CelebrationModal = ({
  show,
  onClose,
  onContinue,
  continuing,
  isLastPage = false,
}) => {
  // Random selections for variety
  const celebrationData = useMemo(() => {
    if (!show)
      return {
        message: CELEBRATION_MESSAGES[0],
        continuePhrase: CONTINUE_PHRASES[0],
        theme: COLOR_THEMES[0],
      };

    const messageIndex = Math.floor(
      Math.random() * CELEBRATION_MESSAGES.length
    );
    const phraseIndex = Math.floor(Math.random() * CONTINUE_PHRASES.length);
    const themeIndex = Math.floor(Math.random() * COLOR_THEMES.length);

    return {
      message: CELEBRATION_MESSAGES[messageIndex],
      continuePhrase: CONTINUE_PHRASES[phraseIndex],
      theme: COLOR_THEMES[themeIndex],
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        style={{
          "--theme-primary": celebrationData.theme.primary,
          "--theme-secondary": celebrationData.theme.secondary,
          "--theme-accent": celebrationData.theme.accent,
        }}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{celebrationData.message}</h2>
          <button className={styles.modalCloseButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalMessage}>Page completed!</div>

          {/* Simple progress indicator for non-last pages */}
          {!isLastPage && (
            <div className={styles.progressHint}>
              <span className={styles.progressText}>
                Check your work - no changes after submit
              </span>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.modalReviewButton} onClick={onClose}>
            Review work
          </button>
          <button
            className={styles.modalContinueButton}
            onClick={onContinue}
            disabled={continuing}
          >
            {continuing
              ? "Submitting..."
              : isLastPage
              ? "Complete session"
              : "Submit & continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CelebrationModal;
