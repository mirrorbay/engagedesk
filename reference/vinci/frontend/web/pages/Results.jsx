import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Check,
  X,
  Smile,
  SmilePlus,
  Laugh,
  PartyPopper,
  Trophy,
  Star,
  Sparkles,
  Heart,
  BookOpen,
  Home,
  TrendingUp,
  UserPlus,
  Save,
  AlertTriangle,
} from "lucide-react";
import deliveryApi from "../services/deliveryApi";
import {
  formatNumber,
  formatDateTime,
  formatAnswer,
  formatTime,
  calculateActualStudyTime,
} from "../utils/formatters";
import { useAuth } from "../hooks/useAuthContext.jsx";
import { ResultsPageSkeleton } from "../components/LoadingSkeleton";
import FractionDisplay from "../components/FractionDisplay";
import "../styles/global.css";
import styles from "../styles/results.module.css";

function ResultsPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  // Use centralized auth hook
  const { isAuthenticated, loginWithGoogle, user } = useAuth();

  const [sessionDetails, setSessionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const sessionResponse = await deliveryApi.getSessionDetails(sessionId);
      setSessionDetails(sessionResponse);

      // Dispatch session info for breadcrumb (same as Study.jsx)
      if (sessionResponse) {
        // Create session info object similar to what Study.jsx dispatches
        const sessionInfo = {
          sessionId: sessionResponse.session_id,
          gradeLevel: sessionResponse.grade_level || "Grade Level",
          studyTimeMinutes: Math.round(
            sessionResponse.target_study_time_seconds / 60
          ),
          conceptNames: sessionResponse.conceptNames || [],
        };

        window.dispatchEvent(
          new CustomEvent("studySessionInfoUpdate", {
            detail: sessionInfo,
          })
        );
      }
    } catch (err) {
      setError("Failed to load session results. Please try again.");
      console.error("Error loading session details:", err);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      loadInitialData();
    }

    // Show login prompt if user is not authenticated
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
    } else {
      setShowLoginPrompt(false);
      // Check if user just logged in by checking URL params
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("justLoggedIn") === "true") {
        setJustLoggedIn(true);
        // Clean up URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        // Claim the session for the authenticated user
        if (sessionId) {
          claimSessionForUser(sessionId);
        }
      }
    }
  }, [sessionId, loadInitialData, isAuthenticated]);

  const claimSessionForUser = async (sessionId) => {
    try {
      await deliveryApi.claimSession(sessionId);
      console.log(`Session ${sessionId} successfully claimed for user`);
    } catch (error) {
      console.error("Failed to claim session:", error);
      // Don't show error to user as this is not critical for the UX
    }
  };

  // Map celebration intensity to appropriate icon component - more child-friendly
  const getCelebrationIcon = (intensity) => {
    const iconMap = {
      0: BookOpen, // Encouragement for low scores
      1: Smile,
      2: SmilePlus,
      3: Laugh,
      4: Star,
      5: Sparkles,
      6: Heart,
      7: Trophy,
      8: PartyPopper,
    };
    return iconMap[intensity] || Smile;
  };

  // Format question with proper fraction display (similar to Study.jsx)
  const formatQuestionWithFractions = (questionText) => {
    const parts = questionText.split(/(\s+[+\-]\s+|\s+=\s+)/);
    return parts.map((part, index) => {
      const trimmedPart = part.trim();
      if (trimmedPart.includes("/") && !trimmedPart.includes(" ")) {
        return <FractionDisplay key={index} fraction={trimmedPart} />;
      }
      return (
        <span key={index}>{part.replace(/\*/g, "x").replace(/×/g, "x")}</span>
      );
    });
  };

  // Format answer for display, handling fractions properly
  const formatAnswerDisplay = (answer) => {
    if (!answer || answer.toString().trim() === "") {
      return "No answer";
    }

    // Check if answer is a fraction
    if (answer.includes("/")) {
      return <FractionDisplay fraction={answer} />;
    }

    return formatAnswer(answer);
  };

  const renderProblemResult = (problem) => {
    const isCorrect = problem.is_correct;
    const isFractionProblem = problem.subcategory === "fraction";

    // Format question with proper fraction display for fraction problems
    const formattedQuestion = isFractionProblem
      ? formatQuestionWithFractions(problem.question)
      : problem.question.replace(/\*/g, "x").replace(/×/g, "x");

    return (
      <div
        key={`${problem.page_number}-${problem.sequence_number}`}
        className={`${styles.problemResult} ${
          isCorrect ? styles.correctProblem : styles.incorrectProblem
        }`}
      >
        {/* Minimalist status indicator */}
        <div className={styles.statusIndicator}>
          <div
            className={`${styles.statusBadge} ${
              isCorrect ? styles.correctStatus : styles.incorrectStatus
            }`}
          >
            {isCorrect ? (
              <Check className={styles.statusIcon} />
            ) : (
              <X className={styles.statusIcon} />
            )}
          </div>
        </div>

        {/* Problem expression similar to Study.jsx */}
        <div className={styles.problemExpression}>
          <span className={styles.expression}>{formattedQuestion}</span>
          <span className={styles.equals}>=</span>
          <span
            className={`${styles.answerDisplay} ${
              isCorrect ? styles.correctAnswer : styles.incorrectAnswer
            }`}
          >
            {formatAnswerDisplay(problem.student_answer)}
          </span>
        </div>

        {/* Show correct answer if wrong */}
        {!isCorrect && (
          <div className={styles.correctAnswerSection}>
            <span className="green-badge">
              Correct: {formatAnswerDisplay(problem.correct_answer)}
            </span>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <ResultsPageSkeleton />;
  }

  if (error || !sessionDetails) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>
          {error || "Session results not found"}
        </div>
        <button onClick={() => navigate("/")} className={styles.homeButton}>
          Go Home
        </button>
      </div>
    );
  }

  // Use celebration data from backend, with frontend visual mapping
  const celebrationData = sessionDetails.celebration;

  // Add confetti effect for high scores - now includes more levels
  const shouldShowConfetti = celebrationData && celebrationData.intensity >= 5;

  const handleLoginClick = () => {
    // Store current session ID and redirect info for after login
    const currentUrl = window.location.pathname + window.location.search;
    const redirectUrl = `${currentUrl}${
      currentUrl.includes("?") ? "&" : "?"
    }justLoggedIn=true`;

    // Navigate to login page with redirect parameter
    navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
  };

  const handleSkipLogin = () => {
    setShowLoginPrompt(false);
  };

  return (
    <div className={styles.resultsContainer}>
      {/* Header with Overall Score - similar to Study.jsx studyHeader */}
      <div className={styles.resultsHeader}>
        <div className={styles.sessionInfo}>
          <h1 className={styles.resultsTitle}>Study Session Results</h1>
          <div className={styles.sessionDetails}>
            {formatDateTime(
              sessionDetails.session_start,
              sessionDetails.session_end
            )}
          </div>
        </div>

        <div className={styles.overallScoreContainer}>
          <div className={styles.scoreLabel}>Overall Score</div>
          <div className={styles.scoreValue}>
            {sessionDetails.scorePercentage}%
          </div>
          <div className={styles.additionalStats}>
            <div className={styles.additionalStatValue}>
              {formatNumber(sessionDetails.totalProblems)} problems
            </div>
            <div className={styles.additionalStatValue}>
              {formatTime(
                calculateActualStudyTime(
                  sessionDetails.session_start,
                  sessionDetails.session_end
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Login Prompt - appears above results if not authenticated */}
      {showLoginPrompt && (
        <div className={styles.loginAlert}>
          <div className={styles.loginAlertContent}>
            <AlertTriangle size={20} className={styles.loginAlertIcon} />
            <div className={styles.loginAlertText}>
              <strong>Save your results!</strong> Sign in to track progress and
              save session data.
            </div>
            <div className={styles.loginAlertActions}>
              <button
                onClick={handleLoginClick}
                className={styles.loginAlertButton}
              >
                Sign In
              </button>
              <button
                onClick={handleSkipLogin}
                className={styles.skipAlertButton}
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success message for users who just logged in */}
      {isAuthenticated && justLoggedIn && (
        <div className={styles.successAlert}>
          <div className={styles.successAlertContent}>
            <Check size={20} className={styles.successAlertIcon} />
            <div className={styles.successAlertText}>
              <strong>Welcome back, {user?.first_name || "there"}!</strong>{" "}
              Results saved to your account.
            </div>
          </div>
        </div>
      )}

      {/* Celebration Section for scores 60% and above */}
      {celebrationData && (
        <div
          className={`${styles.celebrationSection} ${
            styles[`celebrationIntensity${celebrationData.intensity}`]
          }`}
        >
          {/* Extra sparkles for high achievements */}
          {shouldShowConfetti && (
            <div className={styles.confettiContainer}>
              <div className={styles.confetti}>🎉</div>
              <div className={styles.confetti}>🌟</div>
              <div className={styles.confetti}>✨</div>
              <div className={styles.confetti}>🎊</div>
              <div className={styles.confetti}>⭐</div>
            </div>
          )}

          <div className={styles.celebrationIcon}>
            {React.createElement(
              getCelebrationIcon(celebrationData.intensity),
              {
                size: 48,
                className: `${styles.happyIcon} ${
                  styles[`intensity${celebrationData.intensity}`]
                } ${
                  styles[`celebrationIconIntensity${celebrationData.intensity}`]
                }`,
              }
            )}
          </div>
          <div className={styles.celebrationMessage}>
            <div className={styles.primaryMessage}>
              {celebrationData.message}
            </div>
            <div className={styles.subMessage}>
              {celebrationData.subMessage}
            </div>
          </div>
        </div>
      )}

      {/* Problem Details Section */}
      <div className={styles.problemsSection}>
        <h2 className={styles.sectionTitle}>Problem Details</h2>
        <div className={styles.problemsGrid}>
          {sessionDetails.problems.map((problem) =>
            renderProblemResult(problem)
          )}
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actionsSection}>
        {isAuthenticated && (
          <button
            onClick={() => navigate("/progress")}
            className={styles.progressButton}
          >
            <TrendingUp size={18} />
            View Progress
          </button>
        )}
        <button onClick={() => navigate("/")} className={styles.homeButton}>
          <Home size={18} />
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default ResultsPage;
