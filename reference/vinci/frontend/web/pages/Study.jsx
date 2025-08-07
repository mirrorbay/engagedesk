import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import deliveryApi from "../services/deliveryApi";
import { formatStudyTime } from "../utils/formatters";
import { StudyPageSkeleton } from "../components/LoadingSkeleton";
import StudyProblems from "../components/StudyProblems";
import StudyNavigation from "../components/StudyNavigation";
import CelebrationModal from "../components/CelebrationModal";
import "../styles/global.css";
import styles from "../styles/study.module.css";

const STUDY_CONFIG = {
  CLOCK_UPDATE_INTERVAL: 1000,
  AUTO_SAVE_DELAY: 500,
  INACTIVITY_TIMEOUT: 30000,
  AUTO_FOCUS_DELAY: 100,
};

// State management class for reliable state handling
class StudyStateManager {
  constructor() {
    this.state = {
      // Session metadata
      sessionId: null,
      sessionInfo: null,
      startTime: null,

      // Page navigation state
      currentPage: 1,
      totalPages: 1,
      isLastPage: false,

      // Current page state
      problems: [],
      isPageSubmitted: false,

      // Page tracking
      pageStatuses: {},

      // Answer state
      answers: {
        regular: {},
        fraction: {},
      },

      // UI state
      loading: true,
      error: "",
      submitting: false,
      completing: false,
      focusedProblem: null,
      showIncompleteModal: false,
      showCelebrationModal: false,
      showInactivityArrow: false,
      inactivityTarget: null,

      // Timer state
      currentTime: new Date(),
      elapsedTime: 0,
    };

    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  setState(updates) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...updates };

    // Notify all listeners
    this.listeners.forEach((listener) => {
      try {
        listener(this.state, prevState);
      } catch (error) {
        console.error("State listener error:", error);
      }
    });
  }

  getState() {
    return { ...this.state };
  }

  // Reliable page submission with proper state capture
  async submitPage(deliveryApi) {
    if (this.state.submitting) {
      throw new Error("Submission already in progress");
    }

    // Capture current state values immediately
    const currentPage = this.state.currentPage;
    const totalPages = this.state.totalPages;
    const sessionId = this.state.sessionId;

    if (!sessionId || !currentPage) {
      throw new Error("Missing required submission data");
    }

    this.setState({ submitting: true, error: "" });

    try {
      // Submit to backend
      const response = await deliveryApi.submitPage({
        sessionId,
        pageNumber: currentPage,
      });

      // Update page status
      const updatedPageStatuses = {
        ...this.state.pageStatuses,
        [currentPage]: {
          ...this.state.pageStatuses[currentPage],
          submitted: true,
        },
      };

      // Check if this is the last page
      const isLastPage = currentPage >= totalPages;

      if (isLastPage) {
        // Mark as submitted and prepare for completion
        this.setState({
          isPageSubmitted: true,
          pageStatuses: updatedPageStatuses,
          submitting: false,
        });

        return { isLastPage: true, nextPage: null };
      } else {
        // Move to next page
        const nextPage = currentPage + 1;

        this.setState({
          currentPage: nextPage,
          isPageSubmitted: false, // Reset for new page
          problems: [], // Clear problems for new page
          answers: { regular: {}, fraction: {} }, // Clear answers for new page
          pageStatuses: updatedPageStatuses,
          submitting: false,
          // Reset modal states for new page
          showIncompleteModal: false,
          showCelebrationModal: false,
        });

        return { isLastPage: false, nextPage };
      }
    } catch (error) {
      this.setState({
        submitting: false,
        error: error.message || "Failed to submit page. Please try again.",
      });
      throw error;
    }
  }

  // Load page problems with proper state management
  async loadPageProblems(deliveryApi) {
    const { sessionId, currentPage } = this.state;

    if (!sessionId) {
      throw new Error("No session ID available");
    }

    this.setState({ loading: true, error: "" });

    try {
      const response = await deliveryApi.getSessionProblems(
        sessionId,
        currentPage
      );

      // Initialize answers from existing data
      const regularAnswers = {};
      const fractionAnswers = {};

      response.problems.forEach((problem) => {
        if (problem.input_answer && problem.input_answer.length > 0) {
          const lastAnswer =
            problem.input_answer[problem.input_answer.length - 1].value;

          if (problem.subcategory === "fraction" && lastAnswer.includes("/")) {
            const [numerator, denominator] = lastAnswer.split("/");
            fractionAnswers[problem.sequence_number] = {
              numerator: numerator || "",
              denominator: denominator || "",
            };
          } else {
            regularAnswers[problem.sequence_number] = lastAnswer;
          }
        }
      });

      // Update page status
      const updatedPageStatuses = {
        ...this.state.pageStatuses,
        [currentPage]: {
          visited: true,
          submitted: response.isPageSubmitted,
          hasAnswers: response.problems.some(
            (p) => p.input_answer && p.input_answer.length > 0
          ),
        },
      };

      this.setState({
        problems: response.problems,
        totalPages: response.totalPages,
        isLastPage: response.isLastPage,
        isPageSubmitted: response.isPageSubmitted,
        sessionInfo: response.sessionInfo,
        startTime: this.state.startTime || new Date(),
        pageStatuses: updatedPageStatuses,
        answers: { regular: regularAnswers, fraction: fractionAnswers },
        loading: false,
      });

      return response;
    } catch (error) {
      this.setState({
        loading: false,
        error: error.message || "Failed to load problems. Please try again.",
      });
      throw error;
    }
  }
}

function StudyPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  // Create state manager instance
  const stateManager = useMemo(() => new StudyStateManager(), []);

  // Local state for React re-renders
  const [state, setState] = useState(stateManager.getState());

  // Refs for cleanup and queuing
  const autoSaveTimeouts = useRef({});
  const autoSaveQueue = useRef([]);
  const isProcessingQueue = useRef(false);

  // Subscribe to state manager updates
  useEffect(() => {
    const unsubscribe = stateManager.subscribe((newState) => {
      setState(newState);
    });

    return unsubscribe;
  }, [stateManager]);

  // Initialize session
  useEffect(() => {
    if (sessionId && !state.sessionId) {
      stateManager.setState({ sessionId });
    }
  }, [sessionId, state.sessionId, stateManager]);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = state.startTime
        ? Math.floor((now.getTime() - state.startTime.getTime()) / 1000)
        : 0;

      stateManager.setState({
        currentTime: now,
        elapsedTime: elapsed,
      });
    }, STUDY_CONFIG.CLOCK_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [state.startTime, stateManager]);

  // Load problems when page changes
  useEffect(() => {
    if (state.sessionId && state.currentPage) {
      stateManager.loadPageProblems(deliveryApi).catch(console.error);
    }
  }, [state.sessionId, state.currentPage]);

  // Auto-focus effect
  useEffect(() => {
    if (!state.loading && state.problems.length > 0 && !state.isPageSubmitted) {
      const timer = setTimeout(() => {
        const firstProblem = state.problems[0];
        if (firstProblem) {
          const isFraction = firstProblem.subcategory === "fraction";
          const selector = isFraction
            ? `input[data-sequence="${firstProblem.sequence_number}"][data-part="numerator"]`
            : `input[data-sequence="${firstProblem.sequence_number}"]`;

          const input = document.querySelector(selector);
          if (input) input.focus();
        }
      }, STUDY_CONFIG.AUTO_FOCUS_DELAY);

      return () => clearTimeout(timer);
    }
  }, [state.loading, state.problems, state.isPageSubmitted]);

  // Process auto-save queue
  const processAutoSaveQueue = useCallback(async () => {
    if (isProcessingQueue.current || autoSaveQueue.current.length === 0) {
      return;
    }

    isProcessingQueue.current = true;

    while (autoSaveQueue.current.length > 0) {
      const { sequenceNumber, answer, pageNumber } =
        autoSaveQueue.current.shift();

      if (state.isPageSubmitted) {
        continue;
      }

      try {
        await deliveryApi.submitAnswer({
          sessionId: state.sessionId,
          pageNumber,
          sequenceNumber,
          answer,
        });
      } catch (err) {
        console.error("Auto-save error:", err);
      }
    }

    isProcessingQueue.current = false;
  }, [state.sessionId, state.isPageSubmitted]);

  // Queue auto-save request
  const queueAutoSave = useCallback(
    (sequenceNumber, answer) => {
      if (state.isPageSubmitted) return;

      // Remove any existing queued request for this problem
      autoSaveQueue.current = autoSaveQueue.current.filter(
        (item) => item.sequenceNumber !== sequenceNumber
      );

      // Add new request to queue
      autoSaveQueue.current.push({
        sequenceNumber,
        answer,
        pageNumber: state.currentPage,
      });

      // Process queue
      processAutoSaveQueue();
    },
    [state.isPageSubmitted, state.currentPage, processAutoSaveQueue]
  );

  // Schedule auto-save
  const scheduleAutoSave = useCallback(
    (sequenceNumber, value) => {
      if (autoSaveTimeouts.current[sequenceNumber]) {
        clearTimeout(autoSaveTimeouts.current[sequenceNumber]);
      }

      autoSaveTimeouts.current[sequenceNumber] = setTimeout(() => {
        if (value && value.trim() !== "") {
          queueAutoSave(sequenceNumber, value.trim());
        }
      }, STUDY_CONFIG.AUTO_SAVE_DELAY);
    },
    [queueAutoSave]
  );

  // Check if problem is answered
  const isProblemAnswered = useCallback(
    (problem) => {
      if (problem.subcategory === "fraction") {
        const fractionAnswer = state.answers.fraction[problem.sequence_number];
        return (
          fractionAnswer &&
          fractionAnswer.numerator &&
          fractionAnswer.numerator.trim() !== "" &&
          fractionAnswer.denominator &&
          fractionAnswer.denominator.trim() !== ""
        );
      } else {
        return (
          state.answers.regular[problem.sequence_number] &&
          state.answers.regular[problem.sequence_number].trim() !== ""
        );
      }
    },
    [state.answers]
  );

  // Get unanswered problems
  const getUnansweredProblems = useCallback(() => {
    return state.problems.filter((p) => !isProblemAnswered(p));
  }, [state.problems, isProblemAnswered]);

  // Handle regular answer change
  const handleAnswerChange = useCallback(
    (sequenceNumber, value) => {
      if (state.isPageSubmitted) return;

      const updatedAnswers = {
        ...state.answers,
        regular: { ...state.answers.regular, [sequenceNumber]: value },
      };

      stateManager.setState({ answers: updatedAnswers });
      scheduleAutoSave(sequenceNumber, value);
    },
    [state.isPageSubmitted, state.answers, stateManager, scheduleAutoSave]
  );

  // Handle fraction answer change
  const handleFractionAnswerChange = useCallback(
    (sequenceNumber, fractionValue) => {
      if (state.isPageSubmitted) return;

      const updatedAnswers = {
        ...state.answers,
        fraction: {
          ...state.answers.fraction,
          [sequenceNumber]: fractionValue,
        },
      };

      stateManager.setState({ answers: updatedAnswers });

      const { numerator, denominator } = fractionValue;
      if (numerator && denominator) {
        scheduleAutoSave(sequenceNumber, `${numerator}/${denominator}`);
      }
    },
    [state.isPageSubmitted, state.answers, stateManager, scheduleAutoSave]
  );

  // Handle submit page - now using reliable state manager
  const handleSubmitPage = useCallback(async () => {
    try {
      const result = await stateManager.submitPage(deliveryApi);

      if (result.isLastPage) {
        navigate(`/results/${state.sessionId}`);
      } else {
        // Page state will be updated by the state manager
      }
    } catch (error) {
      console.error(`[SUBMIT] Failed to submit page:`, error);
      // Error state is handled by the state manager
    }
  }, [stateManager, navigate, state.sessionId]);

  // Handle celebration continue
  const handleCelebrationContinue = useCallback(() => {
    stateManager.setState({ showCelebrationModal: false });
    handleSubmitPage();
  }, [stateManager, handleSubmitPage]);

  // Handle submit click
  const handleSubmitClick = useCallback(() => {
    const unanswered = getUnansweredProblems();
    if (unanswered.length > 0) {
      stateManager.setState({ showIncompleteModal: true });
    } else {
      stateManager.setState({ showCelebrationModal: true });
    }
  }, [getUnansweredProblems, stateManager]);

  // Handle key down - Enter key navigation and submission
  const handleKeyDown = useCallback(
    (e, sequenceNumber, fractionPart = null) => {
      if (e.key !== "Enter" || state.isPageSubmitted) return;

      e.preventDefault();

      const currentProblem = state.problems.find(
        (p) => p.sequence_number === sequenceNumber
      );
      const isFraction = currentProblem?.subcategory === "fraction";

      // For fraction problems, handle numerator/denominator navigation
      if (isFraction && fractionPart === "numerator") {
        // Move from numerator to denominator
        const denominatorSelector = `input[data-sequence="${sequenceNumber}"][data-part="denominator"]`;
        const denominatorInput = document.querySelector(denominatorSelector);
        if (denominatorInput) {
          denominatorInput.focus();
          return;
        }
      }

      // Auto-save current answer before moving
      if (isFraction) {
        const fractionAnswer = state.answers.fraction[sequenceNumber];
        if (
          fractionAnswer &&
          fractionAnswer.numerator &&
          fractionAnswer.denominator
        ) {
          queueAutoSave(
            sequenceNumber,
            `${fractionAnswer.numerator}/${fractionAnswer.denominator}`
          );
        }
      } else {
        const answer = state.answers.regular[sequenceNumber];
        if (answer && answer.trim() !== "") {
          queueAutoSave(sequenceNumber, answer.trim());
        }
      }

      // Check if all problems are answered after this input
      const allAnswered = state.problems.every((problem) => {
        if (problem.sequence_number === sequenceNumber) {
          // For the current problem, check if it will be answered
          if (isFraction) {
            const fractionAnswer = state.answers.fraction[sequenceNumber];
            return (
              fractionAnswer &&
              fractionAnswer.numerator &&
              fractionAnswer.numerator.trim() !== "" &&
              fractionAnswer.denominator &&
              fractionAnswer.denominator.trim() !== ""
            );
          } else {
            return (
              state.answers.regular[sequenceNumber] &&
              state.answers.regular[sequenceNumber].trim() !== ""
            );
          }
        } else {
          // For other problems, check if they're already answered
          return isProblemAnswered(problem);
        }
      });

      if (allAnswered) {
        // All problems answered, trigger submit
        handleSubmitClick();
        return;
      }

      // Find next problem to focus
      const currentIndex = state.problems.findIndex(
        (p) => p.sequence_number === sequenceNumber
      );
      const nextProblem = state.problems[currentIndex + 1];

      if (nextProblem) {
        const nextIsFraction = nextProblem.subcategory === "fraction";
        const selector = nextIsFraction
          ? `input[data-sequence="${nextProblem.sequence_number}"][data-part="numerator"]`
          : `input[data-sequence="${nextProblem.sequence_number}"]`;

        const nextInput = document.querySelector(selector);
        if (nextInput) nextInput.focus();
      }
    },
    [
      state.isPageSubmitted,
      state.problems,
      state.answers,
      isProblemAnswered,
      queueAutoSave,
      handleSubmitClick,
    ]
  );

  // Navigation handlers
  const handleNextPage = useCallback(() => {
    if (state.currentPage < state.totalPages) {
      stateManager.setState({ currentPage: state.currentPage + 1 });
    }
  }, [state.currentPage, state.totalPages, stateManager]);

  const handlePreviousPage = useCallback(() => {
    if (state.currentPage > 1) {
      stateManager.setState({ currentPage: state.currentPage - 1 });
    }
  }, [state.currentPage, stateManager]);

  const handleDirectPageNavigation = useCallback(
    (pageNumber) => {
      if (
        pageNumber !== state.currentPage &&
        pageNumber >= 1 &&
        pageNumber <= state.totalPages
      ) {
        stateManager.setState({ currentPage: pageNumber });
      }
    },
    [state.currentPage, state.totalPages, stateManager]
  );

  const handleCompleteSession = useCallback(async () => {
    try {
      stateManager.setState({ completing: true });
      await deliveryApi.completeSession({ sessionId: state.sessionId });
      navigate(`/results/${state.sessionId}`);
    } catch (err) {
      stateManager.setState({
        completing: false,
        error: "Failed to complete session. Please try again.",
      });
      console.error("Error completing session:", err);
    }
  }, [stateManager, state.sessionId, navigate]);

  // Other handlers
  const handleProblemClick = useCallback(
    (sequenceNumber, targetPart = null) => {
      if (state.isPageSubmitted) return;

      const problem = state.problems.find(
        (p) => p.sequence_number === sequenceNumber
      );
      const isFraction = problem?.subcategory === "fraction";

      let selector;
      if (targetPart) {
        selector = `input[data-sequence="${sequenceNumber}"][data-part="${targetPart}"]`;
      } else if (isFraction) {
        selector = `input[data-sequence="${sequenceNumber}"][data-part="numerator"]`;
      } else {
        selector = `input[data-sequence="${sequenceNumber}"]`;
      }

      const input = document.querySelector(selector);
      if (input) input.focus();
    },
    [state.isPageSubmitted, state.problems]
  );

  const handleProblemFocus = useCallback(
    (sequenceNumber) => {
      stateManager.setState({ focusedProblem: sequenceNumber });
    },
    [stateManager]
  );

  const handleProblemBlur = useCallback(() => {
    stateManager.setState({ focusedProblem: null });
  }, [stateManager]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      Object.values(autoSaveTimeouts.current).forEach((timeoutId) => {
        if (timeoutId) clearTimeout(timeoutId);
      });
    };
  }, []);

  if (state.loading) {
    return <StudyPageSkeleton />;
  }

  if (!state.sessionInfo) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>Session not found</div>
        <button onClick={() => navigate("/")} className={styles.homeButton}>
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className={styles.studyContainer}>
      <div className={styles.studyHeader}>
        <div className={styles.sessionInfo}>
          <h1 className={styles.studyTitle}>Study Session</h1>
          <div className={styles.sessionDetails}>
            Page {state.currentPage} of {state.totalPages}
            {state.isPageSubmitted && (
              <span className="green-badge">SUBMITTED</span>
            )}
          </div>
        </div>

        <div className={styles.clockContainer}>
          <div className={styles.clockLabel}>Time</div>
          <div className={styles.clockTime}>
            {formatStudyTime(state.elapsedTime)}
          </div>
        </div>
      </div>

      {state.isPageSubmitted && (
        <div className={styles.submittedAlert}>
          Answer has been submitted and cannot be revised
        </div>
      )}

      {state.error && <div className={styles.errorMessage}>{state.error}</div>}

      <StudyProblems
        currentPageProblems={state.problems}
        answers={state.answers.regular}
        fractionAnswers={state.answers.fraction}
        isPageSubmitted={state.isPageSubmitted}
        focusedProblem={state.focusedProblem}
        showInactivityArrow={state.showInactivityArrow}
        inactivityTarget={state.inactivityTarget}
        onAnswerChange={handleAnswerChange}
        onFractionAnswerChange={handleFractionAnswerChange}
        onKeyDown={handleKeyDown}
        onProblemFocus={handleProblemFocus}
        onProblemBlur={handleProblemBlur}
        onProblemClick={handleProblemClick}
      />

      <StudyNavigation
        totalPages={state.totalPages}
        currentPage={state.currentPage}
        pageStatuses={state.pageStatuses}
        isPageSubmitted={state.isPageSubmitted}
        loading={state.loading}
        submitting={state.submitting}
        completing={state.completing}
        showInactivityArrow={state.showInactivityArrow}
        inactivityTarget={state.inactivityTarget}
        showIncompleteModal={state.showIncompleteModal}
        onPageChange={handleDirectPageNavigation}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        onSubmitClick={handleSubmitClick}
        onSubmitPage={handleSubmitPage}
        onCompleteSession={handleCompleteSession}
        onCloseIncompleteModal={() =>
          stateManager.setState({ showIncompleteModal: false })
        }
      />

      <CelebrationModal
        show={state.showCelebrationModal}
        onClose={() => stateManager.setState({ showCelebrationModal: false })}
        onContinue={handleCelebrationContinue}
        continuing={state.submitting}
        isLastPage={state.isLastPage}
      />
    </div>
  );
}

export default StudyPage;
