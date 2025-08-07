/**
 * Multiplication Problem Generator
 * 
 * Systematic Type Breakdown (8 types total):
 * Type 1 (Difficulty 1): 1-digit × 1-digit (basic facts 1-5)
 *   - Examples: 3 × 4 = 12, 2 × 5 = 10, 4 × 3 = 12
 *   - Basic multiplication facts, immediate recall
 * Type 2 (Difficulty 1): 1-digit × 1-digit (basic facts 6-9)
 *   - Examples: 6 × 7 = 42, 8 × 5 = 40, 9 × 4 = 36
 *   - More complex multiplication facts
 * Type 3 (Difficulty 1): 1-digit × multiples of 10/100
 *   - Examples: 7 × 30 = 210, 4 × 200 = 800, 6 × 500 = 3000
 *   - Pattern recognition with zeros
 * Type 4 (Difficulty 2): 2-digit × 1-digit (no regrouping)
 *   - Examples: 23 × 3 = 69, 41 × 2 = 82, 32 × 3 = 96
 *   - Simple multi-digit multiplication
 * Type 5 (Difficulty 3): 2-digit × 1-digit (with regrouping)
 *   - Examples: 27 × 4 = 108, 38 × 6 = 228, 49 × 7 = 343
 *   - Requires carrying, more complex
 * Type 6 (Difficulty 4): 2-digit × 2-digit (simpler)
 *   - Examples: 23 × 12 = 276, 34 × 21 = 714, 45 × 13 = 585
 *   - Multi-step multiplication process
 * Type 7 (Difficulty 4): 3-digit × 1-digit
 *   - Examples: 234 × 7 = 1638, 456 × 8 = 3648, 678 × 9 = 6102
 *   - Extended multiplication with carrying
 * Type 8 (Difficulty 5): 2-digit × 2-digit (complex)
 *   - Examples: 47 × 38 = 1786, 56 × 29 = 1624, 73 × 45 = 3285
 *   - Most complex, multiple steps and carries
 */

const { randomInt, randomWithDigits } = require('./utils');

/**
 * Check if a 2-digit × 1-digit multiplication requires regrouping
 */
function requiresRegrouping(num1, num2) {
    let regrouping = false;
    let carry = 0;
    
    while (num1 > 0) {
        const digit = num1 % 10;
        const product = digit * num2 + carry;
        if (product >= 10) {
            regrouping = true;
            carry = Math.floor(product / 10);
        } else {
            carry = 0;
        }
        num1 = Math.floor(num1 / 10);
    }
    
    return regrouping;
}

/**
 * Generate a 2-digit × 1-digit multiplication without regrouping
 */
function generateNoRegrouping() {
    let num1, num2;
    let attempts = 0;
    
    do {
        num1 = randomInt(10, 99);
        num2 = randomInt(2, 4); // Keep multiplier small to avoid regrouping
        attempts++;
    } while (requiresRegrouping(num1, num2) && attempts < 50);
    
    // If we can't find a non-regrouping example, use a safe one
    if (attempts >= 50) {
        const safeExamples = [
            [11, 2], [12, 2], [13, 2], [14, 2], [21, 2], [22, 2], [23, 2], [24, 2],
            [11, 3], [12, 3], [13, 3], [21, 3], [22, 3], [31, 3], [32, 3], [41, 2]
        ];
        const example = safeExamples[randomInt(0, safeExamples.length - 1)];
        num1 = example[0];
        num2 = example[1];
    }
    
    return [num1, num2];
}

/**
 * Generate a 2-digit × 1-digit multiplication with regrouping
 */
function generateWithRegrouping() {
    let num1, num2;
    let attempts = 0;
    
    do {
        num1 = randomInt(10, 99);
        num2 = randomInt(5, 9); // Larger multiplier more likely to cause regrouping
        attempts++;
    } while (!requiresRegrouping(num1, num2) && attempts < 50);
    
    // If we can't find a regrouping example, use a guaranteed one
    if (attempts >= 50) {
        const regroupingExamples = [
            [27, 4], [38, 6], [49, 7], [89, 2], [67, 5], [58, 7], [79, 3], [46, 8]
        ];
        const example = regroupingExamples[randomInt(0, regroupingExamples.length - 1)];
        num1 = example[0];
        num2 = example[1];
    }
    
    return [num1, num2];
}

function generateMultiplication(difficulty) {
    let num1, num2, question, answer;
    
    switch(difficulty) {
        case 1:
            // Type 1, 2, 3: Basic facts and multiples of 10/100
            const type1Options = Math.random();
            if (type1Options < 0.33) {
                // Type 1: Basic facts 1-5
                num1 = randomInt(1, 5);
                num2 = randomInt(1, 5);
            } else if (type1Options < 0.66) {
                // Type 2: Basic facts including 6-9
                num1 = randomInt(1, 9);
                num2 = randomInt(1, 9);
            } else {
                // Type 3: Single digit × multiples of 10/100
                num1 = randomInt(2, 9);
                const multipliers = [10, 20, 30, 40, 50, 100, 200, 300, 400, 500];
                num2 = multipliers[randomInt(0, multipliers.length - 1)];
            }
            break;
            
        case 2:
            // Type 4: 2-digit × 1-digit (no regrouping)
            [num1, num2] = generateNoRegrouping();
            break;
            
        case 3:
            // Type 5: 2-digit × 1-digit (with regrouping)
            [num1, num2] = generateWithRegrouping();
            break;
            
        case 4:
            // Type 6: 2-digit × 2-digit (simpler) OR Type 7: 3-digit × 1-digit
            if (Math.random() < 0.5) {
                // Type 6: 2-digit × 2-digit (simpler)
                num1 = randomInt(10, 30);
                num2 = randomInt(10, 30);
            } else {
                // Type 7: 3-digit × 1-digit
                num1 = randomWithDigits(3);
                num2 = randomInt(2, 9);
            }
            break;
            
        case 5:
            // Type 8: 2-digit × 2-digit (complex)
            num1 = randomInt(30, 99);
            num2 = randomInt(30, 99);
            break;
            
        default:
            num1 = randomInt(1, 9);
            num2 = randomInt(1, 9);
    }
    
    answer = num1 * num2;
    question = `${num1} × ${num2}`;
    
    return { question, answer };
}

module.exports = {
    generateMultiplication,
    requiresRegrouping
};
