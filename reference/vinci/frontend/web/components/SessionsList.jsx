import React, { useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Play, Trash2 } from "lucide-react";
import { formatDate, formatDuration } from "../utils/formatters";
import styles from "./SessionsList.module.css";

/**
 * Reusable component for displaying study sessions
 * Used by both Home.jsx and Progress.jsx
 */
function SessionsList({
  sessions = [],
  title = "Study Sessions",
  subtitle,
  showDeleteButton = false,
  showViewAllLink = false,
  maxSessions = null,
  onDeleteClick,
  emptyStateConfig = null,
}) {
  const navigate = useNavigate();

  const handleSessionClick = useCallback(
    (session) => {
      const path = session.is_completed
        ? `/results/${session.session_id}`
        : `/study/${session.session_id}`;
      navigate(path);
    },
    [navigate]
  );

  const handleStartStudy = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleDeleteClick = useCallback(
    (e, session) => {
      e.stopPropagation(); // Prevent session click
      if (onDeleteClick) {
        onDeleteClick(e, session);
      }
    },
    [onDeleteClick]
  );

  // Apply maxSessions limit if specified
  const displaySessions = maxSessions
    ? sessions.slice(0, maxSessions)
    : sessions;

  return (
    <div className={styles.pastStudiesSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionNumber}>
          {showViewAllLink ? "YOUR PROGRESS" : "HISTORY"}
        </div>
        <div className={styles.sectionTitle}>{title}</div>
        {subtitle && (
          <div className={styles.sectionSubtitle}>
            {subtitle}
            {showViewAllLink && (
              <>
                {" "}
                <Link to="/progress" className={styles.viewAllLink}>
                  View all sessions →
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className={styles.noSessions}>
          <div className={styles.noSessionsContent}>
            <Play size={48} />
            <h3>{emptyStateConfig?.title || "Ready to Start Learning?"}</h3>
            <p>
              {emptyStateConfig?.message ||
                "Create your first study session to begin tracking your progress!"}
            </p>
            <button
              className={styles.startStudyButton}
              onClick={handleStartStudy}
            >
              <Play size={18} />
              START STUDYING
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.sessionsGrid}>
          {displaySessions.map((session) => (
            <div
              key={session.session_id}
              className={styles.sessionCard}
              onClick={() => handleSessionClick(session)}
            >
              <div className={styles.sessionHeader}>
                <div className={styles.sessionDate}>
                  {formatDate(session.createdAt)}
                </div>
                <div className={styles.sessionHeaderRight}>
                  <div
                    className={`${styles.sessionStatus} ${
                      session.is_completed
                        ? styles.completed
                        : styles.inProgress
                    }`}
                  >
                    {session.is_completed ? "Completed" : "In Progress"}
                  </div>
                  {showDeleteButton && (
                    <button
                      className={styles.deleteButton}
                      onClick={(e) => handleDeleteClick(e, session)}
                      title="Delete session"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className={styles.sessionStats}>
                <div className={styles.sessionScore}>
                  {session.is_completed
                    ? `${session.scorePercentage}%`
                    : "In Progress"}
                </div>
                <div className={styles.sessionDetails}>
                  {session.totalProblems} problem
                  {session.totalProblems !== 1 ? "s" : ""}
                  <br />
                  {formatDuration(session.target_study_time_seconds)} target
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SessionsList;
