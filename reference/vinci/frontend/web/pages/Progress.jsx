import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Trophy, Star } from "lucide-react";
import progressApi from "../services/progressApi";
import { formatDate } from "../utils/formatters";
import { useAuth } from "../hooks/useAuthContext.jsx";
import { HomePageSkeleton } from "../components/LoadingSkeleton";
import PerformanceCharts from "../components/charts/PerformanceCharts";
import SessionsList from "../components/SessionsList";
import "../styles/global.css";
import styles from "../styles/progress.module.css";

function ProgressPage() {
  const navigate = useNavigate();

  // Use centralized auth hook
  const { isAuthenticated, user, requireAuth } = useAuth();

  // Core state
  const [progressData, setProgressData] = useState(null);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load progress data
  const loadProgressData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Only load progress data - no need for concepts
      const progressResponse = await progressApi.getProgressData();

      setProgressData(progressResponse);
      setError("");
    } catch (err) {
      console.error("Error loading progress data:", err);
      setError("Failed to load progress data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Authentication check
  useEffect(() => {
    const initializePage = async () => {
      const isAuthSuccess = await requireAuth({
        requireStudentInfo: true,
        onSuccess: async (user) => {
          await loadProgressData();
        },
      });

      if (!isAuthSuccess) {
        return; // User was redirected to login or user-info
      }
    };

    initializePage();
  }, [requireAuth, loadProgressData]);

  // Event handlers
  const handleStartStudy = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleSessionClick = useCallback(
    (session) => {
      const path = session.is_completed
        ? `/results/${session.session_id}`
        : `/study/${session.session_id}`;
      navigate(path);
    },
    [navigate]
  );

  // Delete handlers
  const handleDeleteClick = useCallback((e, session) => {
    e.stopPropagation(); // Prevent session click
    setDeleteConfirmation(session);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteConfirmation) return;

    try {
      setIsDeleting(true);
      await progressApi.deleteSession(deleteConfirmation.session_id);

      // Reload progress data to reflect the deletion
      await loadProgressData();

      setDeleteConfirmation(null);
    } catch (err) {
      console.error("Error deleting session:", err);
      setError("Failed to delete session. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }, [deleteConfirmation, loadProgressData]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteConfirmation(null);
  }, []);

  // Render logic
  if (!isAuthenticated && !isLoading) {
    return (
      <div className={styles.progressContainer}>
        <div className={styles.errorContainer}>
          <h1 style={{ fontSize: "4rem", margin: "2rem 0", color: "#666" }}>
            404
          </h1>
          <h2 style={{ fontSize: "1.5rem", margin: "1rem 0", color: "#666" }}>
            Page Not Found
          </h2>
          <p style={{ fontSize: "1rem", color: "#888" }}>
            The page you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <HomePageSkeleton />;
  }

  if (error) {
    return (
      <div className={styles.progressContainer}>
        <div className={styles.errorMessage}>{error}</div>
        <button onClick={loadProgressData} className={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  const {
    analytics,
    benchmarks,
    commentary,
    achievements,
    studyTrends,
    sessions,
  } = progressData;

  return (
    <div className={styles.progressContainer}>
      {/* Header Section with Achievement Badge */}
      <div className={styles.progressHeader}>
        <div className={styles.headerInfo}>
          <h1 className={styles.progressTitle}>Progress Report</h1>
          <div className={styles.headerSubtitle}>
            Track your progress, analyze performance trends, and celebrate
            achievements.
          </div>
        </div>
        <div className={styles.achievementBadgeContainer}>
          {achievements && achievements.length > 0 ? (
            <div className={styles.topAchievementBadge}>
              <div className={styles.badgeIcon}>
                <Trophy size={24} />
              </div>
              <div className={styles.badgeContent}>
                <div className={styles.badgeTitle}>{achievements[0].title}</div>
                <div className={styles.badgeDescription}>
                  {achievements[0].description}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.noAchievementBadge}>
              <div className={styles.badgeIcon}>
                <Star size={24} />
              </div>
              <div className={styles.badgeContent}>
                <div className={styles.badgeTitle}>Ready to Achieve</div>
                <div className={styles.badgeDescription}>
                  Complete sessions to earn badges
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Combined Overview and Study Trend Section */}
      <div className={styles.overviewSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionNumber}>OVERVIEW & ANALYTICS</div>
          <div className={styles.sectionTitle}>
            Performance Summary & Trends
          </div>
        </div>

        {/* Overview Group */}
        <div className={styles.formGroup}>
          {/* Dynamic Progress Analysis */}
          <div className={styles.commentaryPoints}>
            {/* Display concept mastery message */}
            {commentary?.conceptMastery && (
              <div className={styles.commentaryPoint}>
                {commentary.conceptMastery}
              </div>
            )}

            {/* Display first strength if available */}
            {commentary?.strengths && commentary.strengths.length > 0 && (
              <div className={styles.commentaryPoint}>
                {commentary.strengths[0]}
              </div>
            )}

            {/* Display first growth opportunity if available */}
            {commentary?.growthOpportunities &&
              commentary.growthOpportunities.length > 0 && (
                <div className={styles.commentaryPoint}>
                  {commentary.growthOpportunities[0]}
                </div>
              )}
          </div>

          {/* Performance Summary */}
          <div className={styles.performanceSummary}>
            {/* Overall Accuracy */}
            <div className={styles.accuracyCard}>
              <div className={styles.accuracyCircle}>
                <div className={styles.accuracyValue}>
                  {analytics?.overallAccuracy || 0}%
                </div>
                <div className={styles.accuracyLabel}>Overall Accuracy</div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className={styles.keyMetrics}>
              <div className={styles.metricItem}>
                <div className={styles.metricValue}>
                  {analytics?.weeklyStudyTime || 0} minutes
                </div>
                <div className={styles.metricLabel}>in past 7 days</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricValue}>
                  {analytics?.totalProblems || 0} problems
                </div>
                <div className={styles.metricLabel}>solved</div>
              </div>
            </div>
          </div>

          {/* Strengths & Achievements + Growth Opportunities */}
          <div className={styles.insightsGrid}>
            <div className={styles.insightCard}>
              <div className={styles.insightHeader}>
                <h4>Strengths & Achievements</h4>
                <Star size={20} />
              </div>
              <div className={styles.insightList}>
                {commentary?.strengths?.length > 0 &&
                  commentary.strengths.map((strength, index) => (
                    <div key={index} className={styles.insightItem}>
                      <span>{strength}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className={styles.insightCard}>
              <div className={styles.insightHeader}>
                <h4>Growth Opportunities</h4>
                <TrendingUp size={20} />
              </div>
              <div className={styles.insightList}>
                {commentary?.growthOpportunities?.length > 0 &&
                  commentary.growthOpportunities.map((opportunity, index) => (
                    <div key={index} className={styles.insightItem}>
                      <span>{opportunity}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Study Trend Group - New Performance Charts */}
        <div className={styles.formGroup}>
          <div className={styles.stepHeader}>
            <div className={styles.stepNumber}>DAILY PERFORMANCE</div>
            <div className={styles.stepTitle}>
              Performance Charts vs Benchmark
            </div>
          </div>

          {/* New Performance Charts Component */}
          <PerformanceCharts />
        </div>
      </div>

      {/* Past Studies Section */}
      <SessionsList
        sessions={sessions || []}
        title="Your Study Sessions"
        showDeleteButton={true}
        onDeleteClick={handleDeleteClick}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Delete Session</h3>
            </div>
            <div className={styles.modalBody}>
              <p>
                Are you sure you want to delete this study session from{" "}
                <strong>{formatDate(deleteConfirmation.createdAt)}</strong>?
              </p>
              <p>
                This will permanently remove the session and all its data. This
                action cannot be undone.
              </p>
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={handleDeleteCancel}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className={styles.deleteConfirmButton}
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Session"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgressPage;
