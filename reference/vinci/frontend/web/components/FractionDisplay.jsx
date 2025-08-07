import React from "react";
import styles from "./FractionDisplay.module.css";

/**
 * FractionDisplay Component
 * Renders fractions in a proper mathematical format with numerator on top,
 * division line, and denominator on bottom
 */
const FractionDisplay = ({ fraction }) => {
  // Parse fraction string (e.g., "3/4" or "1/2")
  const parts = fraction.split("/");

  if (parts.length !== 2) {
    // If not a fraction, return as-is
    return <span className={styles.nonFraction}>{fraction}</span>;
  }

  const numerator = parts[0].trim();
  const denominator = parts[1].trim();

  return (
    <div className={styles.fractionContainer}>
      <div className={styles.numerator}>{numerator}</div>
      <div className={styles.divisionLine}></div>
      <div className={styles.denominator}>{denominator}</div>
    </div>
  );
};

export default FractionDisplay;
