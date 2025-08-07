import React, { memo, useCallback, useMemo } from "react";
import FractionDisplay from "./FractionDisplay";
import FractionInput from "./FractionInput";
import styles from "./StudyProblems.module.css";

// Configuration constants
const STUDY_CONFIG = {
  DIFFICULTY_THRESHOLD: 3,
};

// Memoized Problem Component
const Problem = memo(
  ({
    problem,
    answer,
    isPageSubmitted,
    showArrow,
    isFocused,
    onAnswerChange,
    onKeyDown,
    onFocus,
    onBlur,
    onClick,
    fractionAnswers,
    onFractionAnswerChange,
  }) => {
    // Check if this is a fraction problem
    const isFractionProblem = problem.subcategory === "fraction";

    // Format question with proper fraction display
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

    const formattedQuestion = isFractionProblem
      ? formatQuestionWithFractions(problem.question)
      : problem.question.replace(/\*/g, "x").replace(/×/g, "x");

    const shouldShowSuggestion =
      isFocused &&
      (problem.difficulty_level >= STUDY_CONFIG.DIFFICULTY_THRESHOLD ||
        problem.subcategory === "mixedArithmetic");

    const getPlaceholderText = () => {
      if (isPageSubmitted && !answer && !isFractionProblem) return "Skipped";
      if (isFocused) return "";
      return "?";
    };

    // Handle fraction answer changes
    const handleFractionNumeratorChange = (value) => {
      const currentFraction = fractionAnswers?.[problem.sequence_number] || {
        numerator: "",
        denominator: "",
      };
      const newFraction = { ...currentFraction, numerator: value };
      onFractionAnswerChange(problem.sequence_number, newFraction);
    };

    const handleFractionDenominatorChange = (value) => {
      const currentFraction = fractionAnswers?.[problem.sequence_number] || {
        numerator: "",
        denominator: "",
      };
      const newFraction = { ...currentFraction, denominator: value };
      onFractionAnswerChange(problem.sequence_number, newFraction);
    };

    const currentFractionAnswer = fractionAnswers?.[
      problem.sequence_number
    ] || { numerator: "", denominator: "" };

    // Create specific click handlers for fraction parts
    const handleNumeratorClick = (sequenceNumber, part) => {
      onClick(sequenceNumber, part);
    };

    const handleDenominatorClick = (sequenceNumber, part) => {
      onClick(sequenceNumber, part);
    };

    return (
      <div
        className={`${styles.problem} ${
          showArrow ? styles.problemWithArrow : ""
        } ${isFocused ? styles.problemFocused : ""}`}
        onClick={() => onClick(problem.sequence_number)}
      >
        {showArrow && (
          <div className={styles.inactivityIndicator}>
            <div className={styles.inactivityArrow}>
              <span className={styles.arrowIcon}>👆</span>
              <span className={styles.arrowText}>Please input here!</span>
            </div>
          </div>
        )}
        <div className={styles.problemExpression}>
          <span className={styles.expression}>{formattedQuestion}</span>
          <span className={styles.equals}>=</span>
          {isFractionProblem ? (
            <FractionInput
              numerator={currentFractionAnswer.numerator}
              denominator={currentFractionAnswer.denominator}
              onNumeratorChange={handleFractionNumeratorChange}
              onDenominatorChange={handleFractionDenominatorChange}
              onKeyDown={onKeyDown}
              disabled={isPageSubmitted}
              sequenceNumber={problem.sequence_number}
              className={isPageSubmitted ? styles.disabled : ""}
              onNumeratorClick={handleNumeratorClick}
              onDenominatorClick={handleDenominatorClick}
              onFocus={onFocus}
              onBlur={onBlur}
              isFocused={isFocused}
            />
          ) : (
            <input
              type="text"
              value={answer}
              onChange={(e) =>
                onAnswerChange(problem.sequence_number, e.target.value)
              }
              onKeyDown={(e) => onKeyDown(e, problem.sequence_number)}
              onFocus={onFocus}
              onBlur={onBlur}
              className={`${styles.problemInput} ${
                isPageSubmitted ? styles.disabled : ""
              }`}
              placeholder={getPlaceholderText()}
              disabled={isPageSubmitted}
              data-sequence={problem.sequence_number}
            />
          )}
        </div>
        {shouldShowSuggestion && (
          <div className={styles.scratchPaperSuggestion}>
            Use scratch paper for step-by-step calculations
          </div>
        )}
      </div>
    );
  }
);

Problem.displayName = "Problem";

const StudyProblems = ({
  currentPageProblems,
  answers,
  fractionAnswers,
  isPageSubmitted,
  focusedProblem,
  showInactivityArrow,
  inactivityTarget,
  onAnswerChange,
  onFractionAnswerChange,
  onKeyDown,
  onProblemFocus,
  onProblemBlur,
  onProblemClick,
}) => {
  // Helper function to check if a problem is answered
  const isProblemAnswered = useCallback(
    (problem) => {
      const isFractionProblem = problem.subcategory === "fraction";

      if (isFractionProblem) {
        const fractionAnswer = fractionAnswers[problem.sequence_number];
        return (
          fractionAnswer &&
          fractionAnswer.numerator &&
          fractionAnswer.numerator.trim() !== "" &&
          fractionAnswer.denominator &&
          fractionAnswer.denominator.trim() !== ""
        );
      } else {
        return (
          answers[problem.sequence_number] &&
          answers[problem.sequence_number].trim() !== ""
        );
      }
    },
    [answers, fractionAnswers]
  );

  // Memoized calculations
  const answeredProblems = useMemo(
    () => currentPageProblems.filter(isProblemAnswered).length,
    [currentPageProblems, isProblemAnswered]
  );

  if (currentPageProblems.length === 0) {
    return null;
  }

  return (
    <div className={styles.problemsSection}>
      <div className={styles.problemsGrid}>
        {currentPageProblems.map((problem) => (
          <Problem
            key={problem.sequence_number}
            problem={problem}
            answer={answers[problem.sequence_number] || ""}
            isPageSubmitted={isPageSubmitted}
            showArrow={
              showInactivityArrow &&
              inactivityTarget === `problem-${problem.sequence_number}`
            }
            isFocused={focusedProblem === problem.sequence_number}
            onAnswerChange={onAnswerChange}
            onKeyDown={onKeyDown}
            onFocus={() => onProblemFocus(problem.sequence_number)}
            onBlur={onProblemBlur}
            onClick={onProblemClick}
            fractionAnswers={fractionAnswers}
            onFractionAnswerChange={onFractionAnswerChange}
          />
        ))}
      </div>

      <div className={styles.progressInfo}>
        {answeredProblems} of {currentPageProblems.length} problems answered on
        this page
        {!isPageSubmitted && (
          <span className={styles.checkBeforeSubmit}>
            {" "}
            • Review answers before submitting - changes not allowed after
            submission
          </span>
        )}
        {isPageSubmitted && <span className="green-badge">Page submitted</span>}
      </div>
    </div>
  );
};

export default StudyProblems;
