import React, { memo } from "react";
import { Send, X, FileText } from "lucide-react";
import styles from "./StudyNavigation.module.css";

// Memoized Page Navigation Component
const PageNavigation = memo(
  ({ totalPages, currentPage, pageStatuses, onPageChange, loading }) => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      const pageStatus = pageStatuses[i];
      const isCurrent = i === currentPage;
      const isVisited = pageStatus?.visited || false;
      const isSubmitted = pageStatus?.submitted || false;
      const canNavigate = isVisited || i <= currentPage;

      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`${styles.pageNavButton} ${
            isCurrent ? styles.currentPage : ""
          } ${isSubmitted ? styles.submittedPage : ""} ${
            !canNavigate ? styles.disabledPage : ""
          }`}
          disabled={!canNavigate || loading}
          title={
            isSubmitted
              ? `Page ${i} - Submitted`
              : isCurrent
              ? `Page ${i} - Current`
              : isVisited
              ? `Page ${i} - Visited`
              : `Page ${i} - Not visited`
          }
        >
          {i}
        </button>
      );
    }

    return (
      <div className={styles.pageNavigation}>
        <div className={styles.pageNavLabel}>Pages:</div>
        <div className={styles.pageNavButtons}>{pages}</div>
      </div>
    );
  }
);

PageNavigation.displayName = "PageNavigation";

// Memoized Modal Component
const IncompleteModal = memo(({ show, onClose, onSubmit, submitting }) => {
  if (!show) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Incomplete Submission</h2>
          <button className={styles.modalCloseButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={`${styles.modalMessage} ${styles.error}`}>
            Some problems remain unanswered. Submit anyway?
          </div>
          <div className={styles.modalSubtext}>
            Review your work before submitting. Answers cannot be changed after
            submission.
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.modalCancelButton} onClick={onClose}>
            <FileText size={20} />
            Review Answers
          </button>
          <button
            className={styles.modalSubmitButton}
            onClick={onSubmit}
            disabled={submitting}
          >
            {submitting ? (
              "Submitting..."
            ) : (
              <>
                <Send size={20} />
                Submit Anyway
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

IncompleteModal.displayName = "IncompleteModal";

const StudyNavigation = ({
  totalPages,
  currentPage,
  pageStatuses,
  isPageSubmitted,
  loading,
  submitting,
  completing,
  showInactivityArrow,
  inactivityTarget,
  showIncompleteModal,
  onPageChange,
  onPreviousPage,
  onNextPage,
  onSubmitClick,
  onSubmitPage,
  onCompleteSession,
  onCloseIncompleteModal,
}) => {
  return (
    <>
      {/* Page Navigation */}
      <PageNavigation
        totalPages={totalPages}
        currentPage={currentPage}
        pageStatuses={pageStatuses}
        onPageChange={onPageChange}
        loading={loading}
      />

      {/* Navigation */}
      <div className={styles.navigationSection}>
        <div className={styles.navigationButtons}>
          {currentPage > 1 && (
            <button
              onClick={onPreviousPage}
              className={styles.navButton}
              disabled={loading}
            >
              ← Previous
            </button>
          )}

          {!isPageSubmitted && (
            <div
              className={`${styles.submitSection} ${
                showInactivityArrow && inactivityTarget === "submit-button"
                  ? styles.buttonWithArrow
                  : ""
              }`}
            >
              {showInactivityArrow && inactivityTarget === "submit-button" && (
                <div className={styles.inactivityIndicator}>
                  <div className={styles.inactivityArrow}>
                    <span className={styles.arrowIcon}>👆</span>
                    <span className={styles.arrowText}>
                      Please click to submit!
                    </span>
                  </div>
                </div>
              )}
              <button
                onClick={onSubmitClick}
                className={styles.submitButton}
                disabled={submitting || loading}
              >
                {submitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send size={18} />
                    Submit Page
                  </>
                )}
              </button>
            </div>
          )}

          {isPageSubmitted && currentPage < totalPages && (
            <div
              className={`${styles.nextButtonContainer} ${
                showInactivityArrow && inactivityTarget === "next-button"
                  ? styles.buttonWithArrow
                  : ""
              }`}
            >
              {showInactivityArrow && inactivityTarget === "next-button" && (
                <div className={styles.inactivityIndicator}>
                  <div className={styles.inactivityArrow}>
                    <span className={styles.arrowIcon}>👆</span>
                    <span className={styles.arrowText}>
                      Please click to continue!
                    </span>
                  </div>
                </div>
              )}
              <button
                onClick={onNextPage}
                className={styles.navButton}
                disabled={loading}
              >
                Next →
              </button>
            </div>
          )}

          {isPageSubmitted && currentPage === totalPages && (
            <button
              onClick={onCompleteSession}
              className={styles.completeButton}
              disabled={completing}
            >
              {completing ? "Completing..." : "Complete Session"}
            </button>
          )}
        </div>
      </div>

      {/* Incomplete Submission Modal */}
      <IncompleteModal
        show={showIncompleteModal}
        onClose={onCloseIncompleteModal}
        onSubmit={onSubmitPage}
        submitting={submitting}
      />
    </>
  );
};

export default StudyNavigation;
