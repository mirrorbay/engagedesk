import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Play,
  X,
  Edit3,
  Monitor,
  Coffee,
  Check,
  User,
  Calendar,
} from "lucide-react";
import deliveryApi from "../services/deliveryApi";
import { useAuth } from "../hooks/useAuthContext.jsx";
import { HomePageSkeleton } from "../components/LoadingSkeleton";
import SessionsList from "../components/SessionsList";
import SEOHead from "../components/SEOHead.jsx";
import "../styles/global.css";
import styles from "../styles/home.module.css";

// Configuration constants at the top
const HOME_CONFIG = {
  MIN_STUDY_TIME: 6,
  MAX_STUDY_TIME: 20,
  DEFAULT_STUDY_TIME: 12,
  INACTIVITY_TIMEOUT: 15000, // 15 seconds
  AUTH_PIN: "12358",
};

function HomePage() {
  const navigate = useNavigate();

  // Use centralized hooks
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();

  // Core state
  const [concepts, setConcepts] = useState([]);
  const [selectedConcepts, setSelectedConcepts] = useState([]);
  const [studyTime, setStudyTime] = useState(HOME_CONFIG.DEFAULT_STUDY_TIME);
  const [sessions, setSessions] = useState([]);

  // Grade level state
  const [selectedGradeLevel, setSelectedGradeLevel] = useState("3rd Grade");
  const [selectedSemester, setSelectedSemester] = useState(() => {
    // Auto-detect current semester based on month
    const currentMonth = new Date().getMonth() + 1;
    return currentMonth >= 8 ? "Fall" : "Spring";
  });

  // UI state
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [showPreStartModal, setShowPreStartModal] = useState(false);

  // Feature state
  const [recommendedConcept, setRecommendedConcept] = useState(null);
  const [showInactivityArrow, setShowInactivityArrow] = useState(false);
  const [inactivityTarget, setInactivityTarget] = useState(null);

  // Refs for inactivity tracking
  const inactivityTimeoutRef = useRef(null);

  // Memoized concept lookup map for O(1) access
  const conceptMap = useMemo(() => {
    return concepts.reduce((map, concept) => {
      map[concept.id] = concept;
      return map;
    }, {});
  }, [concepts]);

  // Memoized grouped concepts to avoid recalculating on every render
  const groupedConcepts = useMemo(() => {
    return concepts.reduce((groups, concept) => {
      const category = concept.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(concept);
      return groups;
    }, {});
  }, [concepts]);

  // Load concepts for a specific grade level
  const loadConceptsForGrade = useCallback(async (gradeLevel) => {
    try {
      // Pass grade level to get filtered concepts
      const conceptsData = await deliveryApi.getConcepts(gradeLevel);
      setConcepts(conceptsData);

      // Clear previous selections and set up new default selections
      const nonFractionConcepts = conceptsData.filter(
        (concept) => concept.id !== "fraction"
      );

      if (nonFractionConcepts.length > 0) {
        const shuffled = [...nonFractionConcepts].sort(
          () => 0.5 - Math.random()
        );
        const randomSelected = shuffled.slice(
          0,
          Math.min(2, nonFractionConcepts.length)
        );
        const selectedIds = randomSelected.map((concept) => concept.id);

        setSelectedConcepts(selectedIds);

        // Set recommended concept
        if (selectedIds.length > 0) {
          const randomIndex = Math.floor(Math.random() * selectedIds.length);
          setRecommendedConcept(selectedIds[randomIndex]);
        }
      } else {
        // If no concepts available for this grade, clear selections
        setSelectedConcepts([]);
        setRecommendedConcept(null);
      }

      return conceptsData;
    } catch (err) {
      setError("Failed to load concepts for selected grade. Please try again.");
      console.error("Error loading concepts for grade:", err);
      throw err;
    }
  }, []);

  // Optimized data loading
  const loadInitialData = useCallback(async () => {
    try {
      // Load concepts for the initial grade level
      await loadConceptsForGrade(selectedGradeLevel);

      // UI is ready - stop showing skeleton
      setIsInitializing(false);

      // Load sessions in background (non-blocking)
      deliveryApi
        .getStudentSessions()
        .then(setSessions)
        .catch((err) => {
          console.error("Error loading sessions:", err);
          // Don't show error for sessions - just show empty state
        });
    } catch (err) {
      setError("Failed to load initial data. Please try again.");
      console.error("Error loading initial data:", err);
      setIsInitializing(false);
    }
  }, [selectedGradeLevel, loadConceptsForGrade]);

  // Load initial data without authentication requirement
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Initialize grade level from user data if authenticated
  useEffect(() => {
    if (isAuthenticated && user?.student_info?.grade) {
      setSelectedGradeLevel(user.student_info.grade.level || "3rd Grade");
      setSelectedSemester(
        user.student_info.grade.semester ||
          (() => {
            const currentMonth = new Date().getMonth() + 1;
            return currentMonth >= 8 ? "Fall" : "Spring";
          })()
      );
    }
  }, [isAuthenticated, user]);

  // Optimized inactivity tracking
  useEffect(() => {
    if (isInitializing) return;

    const resetInactivityTimer = () => {
      setShowInactivityArrow(false);

      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }

      inactivityTimeoutRef.current = setTimeout(() => {
        const target =
          selectedConcepts.length === 0 ? "concept-selection" : "start-button";
        setInactivityTarget(target);
        setShowInactivityArrow(true);
      }, HOME_CONFIG.INACTIVITY_TIMEOUT);
    };

    // Only track meaningful interactions
    const events = ["mousedown", "keydown", "click", "touchstart"];
    const eventOptions = { passive: true, capture: true };

    events.forEach((event) => {
      document.addEventListener(event, resetInactivityTimer, eventOptions);
    });

    resetInactivityTimer();

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, resetInactivityTimer, eventOptions);
      });
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, [selectedConcepts, isInitializing]);

  // Event handlers
  const handleConceptToggle = useCallback((conceptId) => {
    setSelectedConcepts((prev) => {
      if (prev.includes(conceptId)) {
        return prev.filter((id) => id !== conceptId);
      } else {
        return [...prev, conceptId];
      }
    });
  }, []);

  const handleStartClick = useCallback(() => {
    if (selectedConcepts.length === 0) {
      setError("Please select at least one concept to study.");
      return;
    }
    setError("");
    setShowPreStartModal(true);
  }, [selectedConcepts.length]);

  const handleStartSession = useCallback(async () => {
    try {
      setCreating(true);
      setShowPreStartModal(false);

      const sessionData = {
        conceptIds: selectedConcepts,
        studyTimeMinutes: studyTime,
        gradeLevel: selectedGradeLevel,
        semester: selectedSemester,
      };

      const response = await deliveryApi.createSession(sessionData);
      navigate(`/study/${response.sessionId}`);
    } catch (err) {
      console.error("Error creating session:", err);
      setError(
        err.message || "Failed to create study session. Please try again."
      );
    } finally {
      setCreating(false);
    }
  }, [
    selectedConcepts,
    studyTime,
    selectedGradeLevel,
    selectedSemester,
    navigate,
  ]);

  const handleCloseModal = useCallback(() => {
    setShowPreStartModal(false);
  }, []);

  const handleSessionClick = useCallback(
    (session) => {
      const path = session.is_completed
        ? `/results/${session.session_id}`
        : `/study/${session.session_id}`;
      navigate(path);
    },
    [navigate]
  );

  const handleTimeChange = useCallback((e) => {
    setStudyTime(parseInt(e.target.value));
  }, []);

  const handleGradeLevelChange = useCallback(
    async (e) => {
      const newGradeLevel = e.target.value;
      setSelectedGradeLevel(newGradeLevel);

      // Clear any existing error
      setError("");

      try {
        // Reload concepts for the new grade level
        await loadConceptsForGrade(newGradeLevel);
      } catch (err) {
        // Error is already handled in loadConceptsForGrade
        console.error("Failed to load concepts for new grade level:", err);
      }
    },
    [loadConceptsForGrade]
  );

  const handleSemesterChange = useCallback((e) => {
    setSelectedSemester(e.target.value);
  }, []);

  // Render logic
  if (isInitializing) {
    return <HomePageSkeleton />;
  }

  return (
    <div className={styles.homeContainer}>
      <SEOHead
        title="ADHD Math Practice for School Success | DaVinci Focus - Free Daily Training"
        description="Help children with ADHD succeed in school through daily math practice. Free 10-minute sessions build focus skills and improve grades. Choose grade level, topics, and practice time. Evidence-based, parent-supervised learning."
        keywords="ADHD math practice, school success, free ADHD help, math practice online, attention skills, focus building, ADHD children, parent supervised learning, academic improvement"
        image="/1.png"
      />
      {/* Intro Section */}
      <div className={styles.introSection}>
        <div className={styles.introContent}>
          {isAuthenticated && user ? (
            <div>
              <p className={styles.introSubtitle}>
                Hi {user.name || user.email?.split("@")[0] || "there"}, welcome
                back. DaVinci Focus develops concentration through structured
                math practice.
              </p>
              <div className={styles.startBelowFree}>
                Please start below, or{" "}
                <Link to="/progress" className={styles.loginLink}>
                  view your progress
                </Link>{" "}
                and{" "}
                <Link to="/user-info" className={styles.loginLink}>
                  update profile
                </Link>
                .
              </div>
            </div>
          ) : (
            <>
              <h1 className={styles.introTitle}>
                Build focus skills for school success
              </h1>
              <p className={styles.introSubtitle}>
                Simple 10-minute daily math practice. Parent-supervised or
                self-monitored. Developed following American Academy of
                Pediatrics guidelines for students with attention challenges
                (including ADHD).
              </p>
              <p className={styles.introSubtitle}>
                Ages 5-15. Easy, effective, and free to use. No BS.
              </p>
              <div className={styles.introStats}>
                <div className={styles.statBox}>
                  <span className={styles.statNumber}>87%</span>
                  <span className={styles.statText}>
                    better focus in 2 weeks
                  </span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statNumber}>25%</span>
                  <span className={styles.statText}>
                    higher test scores in 30 days
                  </span>
                </div>
              </div>
              <div className={styles.startBelowFree}>
                Start below - completely free. You can also{" "}
                <Link to="/login" className={styles.loginLink}>
                  sign in
                </Link>{" "}
                with 1 click to save your study records (optional).
              </div>
            </>
          )}
        </div>
      </div>

      {/* Header Section */}
      <div className={styles.homeHeader}>
        <div className={styles.sessionInfo}>
          <h1 className={styles.homeTitle}>Start Learning</h1>
          <div className={styles.headerSubtitle}>
            Choose grade level, topics, and how long to practice.
          </div>
        </div>

        <div
          className={`${styles.startButtonContainer} ${
            showInactivityArrow && inactivityTarget === "start-button"
              ? styles.buttonWithArrow
              : ""
          }`}
        >
          {showInactivityArrow && inactivityTarget === "start-button" && (
            <div className={styles.inactivityIndicator}>
              <div className={styles.inactivityArrow}>
                <span className={styles.arrowIcon}>👆</span>
                <span className={styles.arrowText}>Start here</span>
              </div>
            </div>
          )}
          <div className={styles.startLabel}>Ready to Start?</div>
          <button
            className={styles.startButton}
            onClick={handleStartClick}
            disabled={selectedConcepts.length === 0 || creating}
          >
            {creating ? (
              "Creating..."
            ) : (
              <>
                <Play size={18} />
                START
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* Setup Section */}
      <div className={styles.setupSection}>
        {/* Step 1: Grade Level Selection */}
        <div className={styles.formGroup}>
          <div className={styles.stepHeader}>
            <div className={styles.stepNumber}>STEP 1</div>
            <div className={styles.stepTitle}>Choose Grade Level</div>
            <div className={styles.stepSubtitle}>
              Pick the student's current grade for the right difficulty level.
            </div>
          </div>
          <div className={styles.fieldGroup}>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label htmlFor="grade-level" className={styles.label}>
                  <User size={16} />
                  Grade Level
                </label>
                <select
                  id="grade-level"
                  value={selectedGradeLevel}
                  onChange={handleGradeLevelChange}
                  className={styles.select}
                >
                  <option value="Kindergarten">Kindergarten</option>
                  <option value="1st Grade">1st Grade</option>
                  <option value="2nd Grade">2nd Grade</option>
                  <option value="3rd Grade">3rd Grade</option>
                  <option value="4th Grade">4th Grade</option>
                  <option value="5th Grade">5th Grade</option>
                  <option value="6th Grade">6th Grade</option>
                  <option value="7th Grade">7th Grade</option>
                  <option value="8th Grade">8th Grade</option>
                  <option value="9th Grade">9th Grade</option>
                  <option value="10th Grade">10th Grade</option>
                  <option value="11th Grade">11th Grade</option>
                  <option value="12th Grade">12th Grade</option>
                </select>
                <div className={styles.fieldHint}>
                  Current grade determines problem difficulty.
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="grade-semester" className={styles.label}>
                  <Calendar size={16} />
                  Semester
                </label>
                <select
                  id="grade-semester"
                  value={selectedSemester}
                  onChange={handleSemesterChange}
                  className={styles.select}
                >
                  <option value="Fall">Fall</option>
                  <option value="Spring">Spring</option>
                </select>
                <div className={styles.fieldHint}>School semester.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Topic Selection */}
        <div className={styles.formGroup}>
          <div className={styles.stepHeader}>
            <div className={styles.stepNumber}>STEP 2</div>
            <div className={styles.stepTitle}>Pick Topics</div>
            <div className={styles.stepSubtitle}>
              Choose what math skills to practice. We'll create custom problems
              for your session.
            </div>
          </div>
          <div
            className={`${styles.conceptSelection} ${
              showInactivityArrow && inactivityTarget === "concept-selection"
                ? styles.conceptSelectionWithArrow
                : ""
            }`}
          >
            {showInactivityArrow &&
              inactivityTarget === "concept-selection" && (
                <div className={styles.inactivityIndicator}>
                  <div className={styles.inactivityArrow}>
                    <span className={styles.arrowIcon}>👆</span>
                    <span className={styles.arrowText}>
                      Pick topics to get started!
                    </span>
                  </div>
                </div>
              )}
            {Object.entries(groupedConcepts).map(
              ([category, categoryConceptsArray]) => (
                <div key={category} className={styles.conceptCategory}>
                  <div className={styles.conceptGrid}>
                    {categoryConceptsArray.map((concept) => (
                      <div
                        key={concept.id}
                        className={`${styles.conceptItem} ${
                          selectedConcepts.includes(concept.id)
                            ? styles.selected
                            : ""
                        } ${
                          recommendedConcept === concept.id
                            ? styles.recommended
                            : ""
                        }`}
                        onClick={(e) => {
                          // Prevent double-triggering when clicking the checkbox directly
                          if (e.target.type !== "checkbox") {
                            handleConceptToggle(concept.id);
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedConcepts.includes(concept.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleConceptToggle(concept.id);
                          }}
                        />
                        <span>{concept.displayName}</span>
                        {recommendedConcept === concept.id && (
                          <div className="green-badge">RECOMMENDED</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Step 3: Study Time */}
        <div className={styles.formGroup}>
          <div className={styles.stepHeader}>
            <div className={styles.stepNumber}>STEP 3</div>
            <div className={styles.stepTitle}>Set Practice Time</div>
            <div className={styles.stepSubtitle}>
              How long to practice? We recommend 10-15 minutes for best focus.
            </div>
          </div>
          <div className={styles.timeSliderContainer}>
            <div className={styles.timeDisplay}>
              <div className={styles.timeValue}>{studyTime}</div>
              <div className={styles.timeLabel}>Minutes</div>
            </div>

            <div className={styles.timeSliderWrapper}>
              <div className={styles.timeSliderTicks}>
                {Array.from({ length: 15 }, (_, i) => {
                  const value = HOME_CONFIG.MIN_STUDY_TIME + i;
                  const isMajor = value % 5 === 0;
                  return (
                    <div
                      key={i}
                      className={`${styles.timeSliderTick} ${
                        isMajor ? styles.major : ""
                      }`}
                    />
                  );
                })}
              </div>

              <div
                className={styles.timeSliderProgress}
                style={{
                  width: `${
                    ((studyTime - HOME_CONFIG.MIN_STUDY_TIME) /
                      (HOME_CONFIG.MAX_STUDY_TIME -
                        HOME_CONFIG.MIN_STUDY_TIME)) *
                    100
                  }%`,
                }}
              />

              <input
                type="range"
                min={HOME_CONFIG.MIN_STUDY_TIME}
                max={HOME_CONFIG.MAX_STUDY_TIME}
                value={studyTime}
                onChange={handleTimeChange}
                className={styles.timeSlider}
              />
            </div>

            <div className={styles.timeRange}>
              <span className={styles.timeRangeValue}>
                {HOME_CONFIG.MIN_STUDY_TIME} min
              </span>
              <span className={styles.timeRangeValue}>
                {HOME_CONFIG.MAX_STUDY_TIME} min
              </span>
            </div>

            <div
              className={`${styles.timeRecommendation} ${
                studyTime >= 10 && studyTime <= 15 ? styles.optimal : ""
              }`}
            >
              {studyTime >= 10 && studyTime <= 15 ? (
                <div className={styles.optimalMessage}>
                  <Check size={24} className={styles.optimalIcon} />
                  Perfect time for staying focused
                </div>
              ) : studyTime < 10 ? (
                "Try a bit longer for better results"
              ) : (
                "Shorter sessions help maintain focus"
              )}
            </div>
          </div>
        </div>

        {/* Start Button below Step 2 */}
        <div
          className={`${styles.startButtonContainer} ${
            showInactivityArrow && inactivityTarget === "start-button"
              ? styles.buttonWithArrow
              : ""
          }`}
        >
          {showInactivityArrow && inactivityTarget === "start-button" && (
            <div className={styles.inactivityIndicator}>
              <div className={styles.inactivityArrow}>
                <span className={styles.arrowIcon}>👆</span>
                <span className={styles.arrowText}>Start here</span>
              </div>
            </div>
          )}
          <div className={styles.startLabel}>Ready to Start?</div>
          <button
            className={styles.startButton}
            onClick={handleStartClick}
            disabled={selectedConcepts.length === 0 || creating}
          >
            {creating ? (
              "Creating..."
            ) : (
              <>
                <Play size={18} />
                START
              </>
            )}
          </button>
        </div>
      </div>

      {/* Past Study Records Section - Only show for authenticated users */}
      {isAuthenticated && sessions && sessions.length > 0 && (
        <SessionsList
          sessions={sessions}
          title="Recent Study Sessions"
          subtitle="Click any session to view detailed results or continue studying."
          showViewAllLink={true}
          maxSessions={6}
        />
      )}

      {/* Pre-Start Checklist Modal */}
      {showPreStartModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Quick Setup</h2>
              <button
                className={styles.modalCloseButton}
                onClick={handleCloseModal}
              >
                <X size={24} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.checklistContainer}>
                <div className={styles.checklistItem}>
                  <div className={styles.checklistIcon}>
                    <Edit3 size={20} />
                  </div>
                  <div className={styles.checklistContent}>
                    <div className={styles.checklistText}>
                      Get pen and paper
                    </div>
                    <div className={styles.checklistSubtext}>
                      You'll need these for solving problems
                    </div>
                  </div>
                </div>

                <div className={styles.checklistItem}>
                  <div className={styles.checklistIcon}>
                    <Monitor size={20} />
                  </div>
                  <div className={styles.checklistContent}>
                    <div className={styles.checklistText}>
                      Remove distractions
                    </div>
                    <div className={styles.checklistSubtext}>
                      Close other tabs, find a quiet spot
                    </div>
                  </div>
                </div>

                <div className={styles.checklistItem}>
                  <div className={styles.checklistIcon}>
                    <Coffee size={20} />
                  </div>
                  <div className={styles.checklistContent}>
                    <div className={styles.checklistText}>
                      Take care of needs first
                    </div>
                    <div className={styles.checklistSubtext}>
                      Bathroom, water - whatever you need
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.modalStartButton}
                onClick={handleStartSession}
                disabled={creating}
              >
                {creating ? (
                  "Setting up..."
                ) : (
                  <>
                    <Play size={20} />
                    LET'S GO!
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
