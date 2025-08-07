import React from "react";
import styles from "./FractionInput.module.css";

/**
 * FractionInput Component
 * Provides separate inputs for numerator and denominator with proper visual layout
 */
const FractionInput = ({
  numerator,
  denominator,
  onNumeratorChange,
  onDenominatorChange,
  onKeyDown,
  disabled = false,
  className = "",
  sequenceNumber,
  onNumeratorClick,
  onDenominatorClick,
  onFocus,
  onBlur,
  isFocused = false,
}) => {
  const handleNumeratorChange = (e) => {
    onNumeratorChange(e.target.value);
  };

  const handleDenominatorChange = (e) => {
    onDenominatorChange(e.target.value);
  };

  const handleNumeratorKeyDown = (e) => {
    if (e.key === "Tab" && !e.shiftKey) {
      // Tab from numerator to denominator
      e.preventDefault();
      const denominatorInput = e.target.parentElement.querySelector(
        `.${styles.denominatorInput}`
      );
      if (denominatorInput) {
        denominatorInput.focus();
      }
    } else if (e.key === "Enter") {
      // Enter from numerator to denominator
      e.preventDefault();
      const denominatorInput = e.target.parentElement.querySelector(
        `.${styles.denominatorInput}`
      );
      if (denominatorInput) {
        denominatorInput.focus();
      }
    } else if (onKeyDown) {
      onKeyDown(e, sequenceNumber, "numerator");
    }
  };

  const handleDenominatorKeyDown = (e) => {
    if (e.key === "Tab" && e.shiftKey) {
      // Shift+Tab from denominator to numerator
      e.preventDefault();
      const numeratorInput = e.target.parentElement.querySelector(
        `.${styles.numeratorInput}`
      );
      if (numeratorInput) {
        numeratorInput.focus();
      }
    } else if (onKeyDown) {
      onKeyDown(e, sequenceNumber, "denominator");
    }
  };

  const handleNumeratorClick = (e) => {
    e.stopPropagation();
    console.log("Numerator clicked for sequence:", sequenceNumber);
    if (onNumeratorClick) {
      onNumeratorClick(sequenceNumber, "numerator");
    }
  };

  const handleDenominatorClick = (e) => {
    e.stopPropagation();
    console.log("Denominator clicked for sequence:", sequenceNumber);
    if (onDenominatorClick) {
      onDenominatorClick(sequenceNumber, "denominator");
    }
  };

  const getPlaceholderText = () => {
    if (disabled && !numerator && !denominator) return "Skipped";
    return "";
  };

  const getNumeratorPlaceholder = () => {
    if (disabled && !numerator) return "";
    if (isFocused) return ""; // Hide placeholder when problem is focused
    if (!numerator) return "?";
    return "";
  };

  const getDenominatorPlaceholder = () => {
    if (disabled && !denominator) return "";
    if (isFocused) return ""; // Hide placeholder when problem is focused
    if (!denominator) return "?";
    return "";
  };

  return (
    <div
      className={`${styles.fractionInputContainer} ${className} ${
        disabled ? styles.disabled : ""
      }`}
    >
      <input
        type="text"
        value={numerator || ""}
        onChange={handleNumeratorChange}
        onKeyDown={handleNumeratorKeyDown}
        onClick={handleNumeratorClick}
        onFocus={onFocus}
        onBlur={onBlur}
        className={styles.numeratorInput}
        placeholder={getNumeratorPlaceholder()}
        disabled={disabled}
        data-sequence={sequenceNumber}
        data-part="numerator"
      />
      <div className={styles.divisionLine}></div>
      <input
        type="text"
        value={denominator || ""}
        onChange={handleDenominatorChange}
        onKeyDown={handleDenominatorKeyDown}
        onClick={handleDenominatorClick}
        onFocus={onFocus}
        onBlur={onBlur}
        className={styles.denominatorInput}
        placeholder={getDenominatorPlaceholder()}
        disabled={disabled}
        data-sequence={sequenceNumber}
        data-part="denominator"
      />
      {getPlaceholderText() && (
        <div className={styles.placeholderOverlay}>{getPlaceholderText()}</div>
      )}
    </div>
  );
};

export default FractionInput;
