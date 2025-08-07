import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, Calendar, Globe, Mail, Save } from "lucide-react";
import { useAuth } from "../hooks/useAuthContext.jsx";
import styles from "../styles/user-info.module.css";

// Country options for dropdown - US first, then alphabetical
const OTHER_COUNTRIES = [
  "Australia",
  "Austria",
  "Bahrain",
  "Bangladesh",
  "Belarus",
  "Belgium",
  "Bolivia",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Cambodia",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Croatia",
  "Czech Republic",
  "Denmark",
  "Ecuador",
  "Egypt",
  "Estonia",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Germany",
  "Ghana",
  "Greece",
  "Hong Kong",
  "Hungary",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Jordan",
  "Kenya",
  "Kuwait",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lithuania",
  "Malaysia",
  "Mexico",
  "Morocco",
  "Myanmar",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Norway",
  "Oman",
  "Other",
  "Pakistan",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Saudi Arabia",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "Sweden",
  "Switzerland",
  "Taiwan",
  "Thailand",
  "Turkey",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "Uruguay",
  "Venezuela",
  "Vietnam",
];

const COUNTRIES = ["United States", ...OTHER_COUNTRIES];

// Grade level options for dropdown
const GRADE_LEVELS = [
  "Kindergarten",
  "1st Grade",
  "2nd Grade",
  "3rd Grade",
  "4th Grade",
  "5th Grade",
  "6th Grade",
  "7th Grade",
  "8th Grade",
  "9th Grade",
  "10th Grade",
  "11th Grade",
  "12th Grade",
];

// Semester options
const SEMESTERS = ["Fall", "Spring"];

// Gender options
const GENDER_OPTIONS = ["Male", "Female", "Non-binary", "Prefer not to say"];

// Special consideration suggestions based on the value proposition
const SPECIAL_CONSIDERATION_SUGGESTIONS = [
  "Has ADHD/attention difficulties",
  "Gets frustrated with math easily",
  "Needs shorter practice sessions",
  "Benefits from extra encouragement",
  "Has math anxiety",
  "Learns better with visual aids",
];

// Helper function to get current semester based on month
const getCurrentSemester = () => {
  const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-11
  return currentMonth >= 8 ? "Fall" : "Spring";
};

function UserInfoPage() {
  const navigate = useNavigate();

  // Use centralized hooks
  const {
    user,
    isAuthenticated,
    isLoading,
    updateUserInfo,
    updateStudentInfo,
  } = useAuth();

  // Combined form state for all user information
  const [formData, setFormData] = useState({
    // Parent/User info
    first_name: "",
    last_name: "",
    email: "",
    // Student info
    student_first_name: "",
    student_last_name: "",
    date_of_birth: "",
    country: "",
    gender: "",
    special_consideration: "",
    grade_level: "3rd Grade",
    grade_semester: getCurrentSemester(),
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Auto-save state
  const [autoSaveStatus, setAutoSaveStatus] = useState("idle"); // idle, saving, saved, error
  const [lastSavedData, setLastSavedData] = useState({});
  const autoSaveTimeoutRef = useRef(null);
  const isInitialLoadRef = useRef(true);

  // Helper function to create form data object from user data
  const createFormDataFromUser = (
    userData,
    ensureValidGrade,
    ensureValidSemester
  ) => ({
    first_name: userData.first_name || "",
    last_name: userData.last_name || "",
    email: userData.email || "",
    student_first_name: userData.student_info?.first_name || "",
    student_last_name: userData.student_info?.last_name || "",
    date_of_birth: userData.student_info?.date_of_birth
      ? new Date(userData.student_info.date_of_birth)
          .toISOString()
          .split("T")[0]
      : "",
    country: userData.student_info?.country || "",
    gender: userData.student_info?.gender || "",
    special_consideration: userData.student_info?.special_consideration || "",
    grade_level: ensureValidGrade(userData.student_info?.grade?.level),
    grade_semester: ensureValidSemester(userData.student_info?.grade?.semester),
  });

  // Helper function to dispatch auto-save status events
  const dispatchAutoSaveEvent = (status) => {
    window.dispatchEvent(
      new CustomEvent("autosaveStatusChange", {
        detail: { status },
      })
    );
  };

  // Check authentication and load existing data
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!isLoading && isAuthenticated && user) {
      // Ensure required fields have valid defaults if missing
      const ensureValidGrade = (level) => {
        return GRADE_LEVELS.includes(level) ? level : "3rd Grade";
      };

      const ensureValidSemester = (semester) => {
        return SEMESTERS.includes(semester) ? semester : getCurrentSemester();
      };

      // Create form data using helper function
      const initialFormData = createFormDataFromUser(
        user,
        ensureValidGrade,
        ensureValidSemester
      );

      setFormData(initialFormData);
      setLastSavedData(initialFormData);

      // Mark initial load as complete
      setTimeout(() => {
        isInitialLoadRef.current = false;
      }, 100);
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  // Auto-save function
  const performAutoSave = useCallback(
    async (dataToSave) => {
      if (isInitialLoadRef.current) return;

      try {
        setAutoSaveStatus("saving");
        dispatchAutoSaveEvent("saving");

        // Determine what data has changed
        const parentFields = ["first_name", "last_name"];
        const studentFields = [
          "student_first_name",
          "student_last_name",
          "date_of_birth",
          "country",
          "gender",
          "special_consideration",
          "grade_level",
          "grade_semester",
        ];

        const parentDataChanged = parentFields.some(
          (field) => dataToSave[field] !== lastSavedData[field]
        );

        const studentDataChanged = studentFields.some(
          (field) => dataToSave[field] !== lastSavedData[field]
        );

        // Save parent information if changed (excluding email)
        if (parentDataChanged) {
          await updateUserInfo({
            first_name: dataToSave.first_name,
            last_name: dataToSave.last_name,
          });
        }

        // Save student information if changed
        if (studentDataChanged) {
          await updateStudentInfo({
            first_name: dataToSave.student_first_name,
            last_name: dataToSave.student_last_name,
            date_of_birth: dataToSave.date_of_birth,
            country: dataToSave.country,
            gender: dataToSave.gender,
            special_consideration: dataToSave.special_consideration,
            grade: {
              level: dataToSave.grade_level,
              semester: dataToSave.grade_semester,
            },
          });
        }

        // Update last saved data
        setLastSavedData(dataToSave);
        setAutoSaveStatus("saved");
        dispatchAutoSaveEvent("saved");

        // No need to dispatch events - the centralized auth context handles this

        // Reset to idle after showing saved status
        setTimeout(() => {
          setAutoSaveStatus("idle");
          dispatchAutoSaveEvent("idle");
        }, 2000);
      } catch (error) {
        console.error("Auto-save error:", error);
        setAutoSaveStatus("error");
        dispatchAutoSaveEvent("error");

        // Reset to idle after showing error status
        setTimeout(() => {
          setAutoSaveStatus("idle");
          dispatchAutoSaveEvent("idle");
        }, 3000);
      }
    },
    [lastSavedData]
  );

  // Auto-save effect - triggers when form data changes
  useEffect(() => {
    if (isInitialLoadRef.current) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for auto-save (debounced)
    autoSaveTimeoutRef.current = setTimeout(() => {
      performAutoSave(formData);
    }, 1500); // 1.5 second delay after user stops typing

    // Cleanup timeout on unmount
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formData, performAutoSave]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  // Handle gender button selection
  const handleGenderSelect = (gender) => {
    setFormData((prev) => ({
      ...prev,
      gender: gender,
    }));

    // Clear error when user makes selection
    if (error) {
      setError("");
    }
  };

  // Handle special consideration suggestion click
  const handleSuggestionClick = (suggestion) => {
    const currentText = formData.special_consideration;
    const newText = currentText
      ? `${currentText}\n\n${suggestion}`
      : suggestion;

    setFormData((prev) => ({
      ...prev,
      special_consideration: newText,
    }));

    // Clear error when user makes selection
    if (error) {
      setError("");
    }
  };

  // Handle form submission and continue
  const handleSaveAndContinue = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Submit parent information (excluding email)
      await updateUserInfo({
        first_name: formData.first_name,
        last_name: formData.last_name,
      });

      // Submit student information
      await updateStudentInfo({
        first_name: formData.student_first_name,
        last_name: formData.student_last_name,
        date_of_birth: formData.date_of_birth,
        country: formData.country,
        gender: formData.gender,
        special_consideration: formData.special_consideration,
        grade: {
          level: formData.grade_level,
          semester: formData.grade_semester,
        },
      });

      // Always redirect to home page after saving
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to save information");
    } finally {
      setLoading(false);
    }
  };

  // Format date display
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingMessage}>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingMessage}>Checking authentication...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.sessionInfo}>
          <h1 className={styles.title}>Grade & Personal</h1>
          <div className={styles.headerSubtitle}>All fields are optional.</div>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* Success Message */}
      {success && <div className={styles.successMessage}>{success}</div>}

      {/* Setup Section */}
      <div className={styles.setupSection}>
        <form onSubmit={handleSaveAndContinue} className={styles.form}>
          {/* Grade & Semester Section - FIRST */}
          <div className={styles.formGroup}>
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>Grade & Semester</div>
              <div className={styles.stepTitle}>Academic Level</div>
              <div className={styles.stepSubtitle}>
                This helps us provide appropriate content difficulty and pacing
                for your child's current academic level.
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label htmlFor="grade_level" className={styles.label}>
                    <User size={16} />
                    Grade Level
                  </label>
                  <select
                    id="grade_level"
                    name="grade_level"
                    value={formData.grade_level}
                    onChange={handleInputChange}
                    className={styles.select}
                  >
                    {GRADE_LEVELS.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                  <div className={styles.fieldHint}>
                    Select the student's current grade level for appropriate
                    content difficulty.
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="grade_semester" className={styles.label}>
                    <Calendar size={16} />
                    Semester
                  </label>
                  <select
                    id="grade_semester"
                    name="grade_semester"
                    value={formData.grade_semester}
                    onChange={handleInputChange}
                    className={styles.select}
                  >
                    {SEMESTERS.map((semester) => (
                      <option key={semester} value={semester}>
                        {semester}
                      </option>
                    ))}
                  </select>
                  <div className={styles.fieldHint}>
                    Current academic semester (automatically detected:{" "}
                    {getCurrentSemester()}).
                  </div>
                </div>
              </div>
            </div>

            {/* Save & Continue Button after Grade Selector */}
            <div className={styles.saveAndContinueContainer}>
              <button
                type="submit"
                className={styles.saveAndContinueButton}
                disabled={loading}
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save size={18} />
                    Save & Continue
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Parent/Guardian Information Section */}
          <div className={styles.formGroup}>
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>
                Parent & Guardian Information
              </div>
              <div className={styles.stepTitle}>Account Details</div>
              <div className={styles.stepSubtitle}>
                We want to empower your supervision and administration of your
                child's learning journey.
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label htmlFor="first_name" className={styles.label}>
                    <User size={16} />
                    Parent's First Name
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter parent's first name"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="last_name" className={styles.label}>
                    <User size={16} />
                    Parent's Last Name
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter parent's last name"
                  />
                </div>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                <Mail size={16} />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${styles.input} ${styles.inputDisabled}`}
                placeholder="Enter your email address"
                disabled
                readOnly
              />
              <div className={styles.fieldHint}>
                <strong>Email cannot be changed.</strong> If you need to change
                your email address, please{" "}
                <a href="/contact" className={styles.contactLink}>
                  contact us
                </a>{" "}
                or register for a new account. This email will be used for
                account notifications and progress updates.
              </div>
            </div>

            {/* Save & Continue Button after Parent Information */}
            <div className={styles.saveAndContinueContainer}>
              <button
                type="submit"
                className={styles.saveAndContinueButton}
                disabled={loading}
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save size={18} />
                    Save & Continue
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Student Information Section */}
          <div className={styles.formGroup}>
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>Student Information</div>
              <div className={styles.stepTitle}>Learning Profile</div>
              <div className={styles.stepSubtitle}>
                This information helps us provide age-appropriate content and
                personalized learning experiences.
              </div>
            </div>

            {/* Student Name Fields */}
            <div className={styles.fieldGroup}>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label htmlFor="student_first_name" className={styles.label}>
                    <User size={16} />
                    Student's First Name
                  </label>
                  <input
                    type="text"
                    id="student_first_name"
                    name="student_first_name"
                    value={formData.student_first_name}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter student's first name"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="student_last_name" className={styles.label}>
                    <User size={16} />
                    Student's Last Name
                  </label>
                  <input
                    type="text"
                    id="student_last_name"
                    name="student_last_name"
                    value={formData.student_last_name}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter student's last name"
                  />
                </div>
              </div>
            </div>

            {/* Date of Birth and Location Fields */}
            <div className={styles.fieldGroup}>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label htmlFor="date_of_birth" className={styles.label}>
                    <Calendar size={16} />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="date_of_birth"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                  <div className={styles.fieldHint}>
                    This helps us provide age-appropriate content and difficulty
                    levels.
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="country" className={styles.label}>
                    <Globe size={16} />
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={styles.select}
                  >
                    <option value="">Select a country</option>
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Gender Selection - Clickable Buttons */}
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label className={styles.label}>
                  <User size={16} />
                  Gender
                </label>
                <div className={styles.genderButtons}>
                  {GENDER_OPTIONS.map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => handleGenderSelect(gender)}
                      className={`${styles.genderButton} ${
                        formData.gender === gender
                          ? styles.genderButtonActive
                          : ""
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Special Consideration - Textarea with Suggestions */}
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label htmlFor="special_consideration" className={styles.label}>
                  <User size={16} />
                  Special Considerations
                </label>
                <textarea
                  id="special_consideration"
                  name="special_consideration"
                  value={formData.special_consideration}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  placeholder="Tell us about any special considerations for your child's learning..."
                  rows={4}
                />
                <div className={styles.fieldHint}>
                  Our parenting specialist will fully consider your input and
                  reach out to provide a thoughtfully effective experience for
                  your child.
                </div>

                {/* Suggestion Buttons */}
                <div className={styles.suggestionButtons}>
                  <div className={styles.suggestionLabel}>
                    Common considerations from our community:
                  </div>
                  {SPECIAL_CONSIDERATION_SUGGESTIONS.map(
                    (suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={styles.suggestionButton}
                      >
                        {suggestion}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Save & Continue Button - styled like Home.jsx start button */}
          <div className={styles.saveAndContinueContainer}>
            <div className={styles.saveAndContinueLabel}>
              Ready to Continue?
            </div>
            <button
              type="submit"
              className={styles.saveAndContinueButton}
              disabled={loading}
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <Save size={18} />
                  Save & Continue
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserInfoPage;
