/**
 * Fraction Utilities
 * Helper functions for fraction calculations and equivalence checking
 */

/**
 * Helper function to calculate GCD (Greatest Common Divisor)
 */
function findGCD(a, b) {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/**
 * Helper function to simplify a fraction
 */
function simplifyFraction(numerator, denominator) {
  const gcd = findGCD(Math.abs(numerator), Math.abs(denominator));
  return {
    numerator: numerator / gcd,
    denominator: denominator / gcd,
  };
}

/**
 * Helper function to check if two fractions are equivalent
 */
function areFractionsEquivalent(frac1, frac2) {
  const simplified1 = simplifyFraction(frac1.numerator, frac1.denominator);
  const simplified2 = simplifyFraction(frac2.numerator, frac2.denominator);

  return (
    simplified1.numerator === simplified2.numerator &&
    simplified1.denominator === simplified2.denominator
  );
}

/**
 * Helper function to parse fraction string (e.g., "3/4" or "6")
 */
function parseFraction(fractionStr) {
  const trimmed = fractionStr.trim();

  if (trimmed.includes("/")) {
    const parts = trimmed.split("/");
    if (parts.length === 2) {
      const numerator = parseInt(parts[0].trim());
      const denominator = parseInt(parts[1].trim());

      if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
        return { numerator, denominator };
      }
    }
  } else {
    // Handle whole numbers as fractions (e.g., "3" becomes "3/1")
    const wholeNumber = parseInt(trimmed);
    if (!isNaN(wholeNumber)) {
      return { numerator: wholeNumber, denominator: 1 };
    }
  }

  return null;
}

/**
 * Calculate score with support for fraction equivalence
 */
function calculateScore(studentAnswer, correctAnswer, subcategory) {
  // Check if this is a fraction problem
  const isFractionProblem = subcategory === "fraction";

  if (isFractionProblem) {
    // Parse both answers as fractions
    const studentFraction = parseFraction(studentAnswer);
    const correctFraction = parseFraction(correctAnswer);

    // If either parsing failed, fall back to exact string match
    if (!studentFraction || !correctFraction) {
      return studentAnswer.toLowerCase() === correctAnswer.toLowerCase()
        ? 10
        : 0;
    }

    // Check if fractions are equivalent
    return areFractionsEquivalent(studentFraction, correctFraction) ? 10 : 0;
  } else {
    // For non-fraction problems, use exact string match
    return studentAnswer.toLowerCase() === correctAnswer.toLowerCase() ? 10 : 0;
  }
}

module.exports = {
  findGCD,
  simplifyFraction,
  areFractionsEquivalent,
  parseFraction,
  calculateScore,
};
