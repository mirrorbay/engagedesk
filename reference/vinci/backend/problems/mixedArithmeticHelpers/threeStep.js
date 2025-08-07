/**
 * Three-Step Mixed Arithmetic Problem Generator
 * 
 * Generates 3-step arithmetic problems for difficulty levels 3-5
 * Each problem contains exactly 3 arithmetic operations (+, -, ×, ÷)
 * 
 * Problem Types:
 * - Addition/subtraction chains with 3 operations
 * - Mixed operations with multiplication/division and addition/subtraction
 * - Problems with parentheses for order of operations
 * - Multi-digit numbers with increased complexity
 * 
 * Difficulty 3: Moderate 3-step problems
 * Difficulty 4: Complex 3-step problems
 * Difficulty 5: Advanced 3-step problems
 */

const { randomInt } = require('../basicArithmeticHelpers/utils');

/**
 * Generate addition/subtraction chains with exactly 3 operations
 */
function generateAddSubChain(difficulty) {
    let num1, num2, num3, num4;
    let operation1, operation2, operation3;
    
    if (difficulty === 3) {
        num1 = randomInt(20, 80);
        num2 = randomInt(10, 40);
        num3 = randomInt(10, 40);
        num4 = randomInt(5, 30);
    } else if (difficulty === 4) {
        num1 = randomInt(50, 150);
        num2 = randomInt(20, 80);
        num3 = randomInt(20, 80);
        num4 = randomInt(10, 60);
    } else {
        num1 = randomInt(100, 300);
        num2 = randomInt(50, 150);
        num3 = randomInt(50, 150);
        num4 = randomInt(20, 100);
    }
    
    // Choose operations
    operation1 = Math.random() < 0.6 ? '+' : '-';
    operation2 = Math.random() < 0.6 ? '+' : '-';
    operation3 = Math.random() < 0.6 ? '+' : '-';
    
    // Calculate result left to right
    let result = num1;
    result = operation1 === '+' ? result + num2 : result - num2;
    result = operation2 === '+' ? result + num3 : result - num3;
    result = operation3 === '+' ? result + num4 : result - num4;
    
    // Ensure positive result
    if (result < 0) {
        return generateAddSubChain(difficulty);
    }
    
    const question = `${num1} ${operation1} ${num2} ${operation2} ${num3} ${operation3} ${num4}`;
    
    return { question, answer: result };
}

/**
 * Generate mixed operations with exactly 3 operations
 */
function generateMixedOperations(difficulty) {
    let num1, num2, num3, num4;
    
    if (difficulty === 3) {
        num1 = randomInt(2, 15);
        num2 = randomInt(2, 8);
        num3 = randomInt(2, 12);
        num4 = randomInt(5, 40);
    } else if (difficulty === 4) {
        num1 = randomInt(5, 25);
        num2 = randomInt(2, 12);
        num3 = randomInt(3, 15);
        num4 = randomInt(10, 80);
    } else {
        num1 = randomInt(10, 50);
        num2 = randomInt(3, 15);
        num3 = randomInt(4, 20);
        num4 = randomInt(20, 150);
    }
    
    // Define patterns with exactly 3 operations
    const patterns = [
        // Pattern: a × b + c - d (3 operations: ×, +, -)
        () => {
            const result = num1 * num2 + num3 - num4;
            return {
                question: `${num1} × ${num2} + ${num3} - ${num4}`,
                answer: result
            };
        },
        // Pattern: a × b - c + d (3 operations: ×, -, +)
        () => {
            const result = num1 * num2 - num3 + num4;
            return {
                question: `${num1} × ${num2} - ${num3} + ${num4}`,
                answer: result
            };
        },
        // Pattern: a + b × c - d (3 operations: +, ×, -)
        () => {
            const result = num1 + num2 * num3 - num4;
            return {
                question: `${num1} + ${num2} × ${num3} - ${num4}`,
                answer: result
            };
        },
        // Pattern: a - b × c + d (3 operations: -, ×, +)
        () => {
            const result = num1 - num2 * num3 + num4;
            return {
                question: `${num1} - ${num2} × ${num3} + ${num4}`,
                answer: result
            };
        },
        // Pattern: a ÷ b + c - d (3 operations: ÷, +, -)
        () => {
            const dividend = num1 * num2; // Make it exactly divisible
            const result = dividend / num2 + num3 - num4;
            return {
                question: `${dividend} ÷ ${num2} + ${num3} - ${num4}`,
                answer: result
            };
        },
        // Pattern: a ÷ b - c + d (3 operations: ÷, -, +)
        () => {
            const dividend = num1 * num2; // Make it exactly divisible
            const result = dividend / num2 - num3 + num4;
            return {
                question: `${dividend} ÷ ${num2} - ${num3} + ${num4}`,
                answer: result
            };
        }
    ];
    
    const pattern = patterns[randomInt(0, patterns.length - 1)]();
    
    // Ensure positive result
    if (pattern.answer < 0) {
        return generateMixedOperations(difficulty);
    }
    
    return pattern;
}

/**
 * Generate problems with parentheses and exactly 3 operations
 */
function generateParenthesesOperations(difficulty) {
    let num1, num2, num3, num4;
    
    if (difficulty === 3) {
        num1 = randomInt(3, 12);
        num2 = randomInt(2, 8);
        num3 = randomInt(2, 10);
        num4 = randomInt(5, 25);
    } else if (difficulty === 4) {
        num1 = randomInt(5, 20);
        num2 = randomInt(3, 12);
        num3 = randomInt(3, 15);
        num4 = randomInt(10, 50);
    } else {
        num1 = randomInt(8, 30);
        num2 = randomInt(4, 15);
        num3 = randomInt(4, 20);
        num4 = randomInt(20, 100);
    }
    
    const patterns = [
        // Pattern: (a + b) × c - d (3 operations: +, ×, -)
        () => {
            const result = (num1 + num2) * num3 - num4;
            return {
                question: `(${num1} + ${num2}) × ${num3} - ${num4}`,
                answer: result
            };
        },
        // Pattern: (a - b) × c + d (3 operations: -, ×, +)
        () => {
            // Ensure num1 > num2 for positive result in parentheses
            if (num1 <= num2) {
                [num1, num2] = [num2 + randomInt(1, 10), num1];
            }
            const result = (num1 - num2) * num3 + num4;
            return {
                question: `(${num1} - ${num2}) × ${num3} + ${num4}`,
                answer: result
            };
        },
        // Pattern: a × (b + c) - d (3 operations: ×, +, -)
        () => {
            const result = num1 * (num2 + num3) - num4;
            return {
                question: `${num1} × (${num2} + ${num3}) - ${num4}`,
                answer: result
            };
        },
        // Pattern: a × (b - c) + d (3 operations: ×, -, +)
        () => {
            // Ensure num2 > num3 for positive result in parentheses
            if (num2 <= num3) {
                [num2, num3] = [num3 + randomInt(1, 5), num2];
            }
            const result = num1 * (num2 - num3) + num4;
            return {
                question: `${num1} × (${num2} - ${num3}) + ${num4}`,
                answer: result
            };
        },
        // Pattern: (a + b) ÷ c - d (3 operations: +, ÷, -)
        () => {
            // Make sure sum is divisible by divisor
            const divisor = randomInt(2, 8);
            const quotient = randomInt(5, 20);
            const sum = divisor * quotient; // This ensures exact division
            
            // Generate two numbers that add up to the sum
            const addend1 = randomInt(Math.floor(sum * 0.2), Math.floor(sum * 0.8));
            const addend2 = sum - addend1;
            
            const result = sum / divisor - num4;
            return {
                question: `(${addend1} + ${addend2}) ÷ ${divisor} - ${num4}`,
                answer: result
            };
        },
        // Pattern: a - (b + c) ÷ d (3 operations: -, +, ÷)
        () => {
            // Make sure sum is divisible by divisor
            const divisor = randomInt(2, 6);
            const quotient = randomInt(2, 8);
            const sum = divisor * quotient; // This ensures exact division
            
            // Generate two numbers that add up to the sum
            const addend1 = randomInt(Math.floor(sum * 0.2), Math.floor(sum * 0.8));
            const addend2 = sum - addend1;
            
            const result = num1 - sum / divisor;
            return {
                question: `${num1} - (${addend1} + ${addend2}) ÷ ${divisor}`,
                answer: result
            };
        }
    ];
    
    const pattern = patterns[randomInt(0, patterns.length - 1)]();
    
    // Ensure positive result
    if (pattern.answer < 0) {
        return generateParenthesesOperations(difficulty);
    }
    
    return pattern;
}

/**
 * Generate three-step arithmetic problems with exactly 3 operations
 */
function generateThreeStep(difficulty) {
    const problemTypes = [
        generateAddSubChain,
        generateMixedOperations,
        generateParenthesesOperations
    ];
    
    const generator = problemTypes[randomInt(0, problemTypes.length - 1)];
    const result = generator(difficulty);
    
    return {
        question: result.question,
        answer: result.answer
    };
}

module.exports = {
    generateThreeStep,
    generateAddSubChain,
    generateMixedOperations,
    generateParenthesesOperations
};
