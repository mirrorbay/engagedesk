/**
 * Subtraction Problem Generator
 * 
 * Systematic Type Breakdown (8 types total):
 * Type 1 (Difficulty 1): 1-digit - 1-digit, no borrowing
 *   - Examples: 8 - 3 = 5, 9 - 4 = 5, 7 - 2 = 5
 *   - Basic mental math, immediate recall
 * Type 2 (Difficulty 1): 1-digit - 1-digit, simple subtraction
 *   - Examples: 9 - 7 = 2, 8 - 6 = 2, 7 - 5 = 2
 *   - Simple subtraction facts
 * Type 3 (Difficulty 2): 2-digit - 1-digit, no borrowing
 *   - Examples: 47 - 3 = 44, 68 - 5 = 63, 59 - 4 = 55
 *   - Place value understanding, no regrouping
 * Type 4 (Difficulty 2): 2-digit - 1-digit, with borrowing
 *   - Examples: 42 - 7 = 35, 51 - 6 = 45, 63 - 8 = 55
 *   - Requires borrowing from tens place
 * Type 5 (Difficulty 2): 2-digit - 2-digit, no borrowing
 *   - Examples: 68 - 23 = 45, 79 - 45 = 34, 87 - 32 = 55
 *   - Two-step subtraction without regrouping
 * Type 6 (Difficulty 3): 2-digit - 2-digit, with borrowing
 *   - Examples: 72 - 48 = 24, 81 - 57 = 24, 93 - 68 = 25
 *   - Complex borrowing, multiple steps
 * Type 7 (Difficulty 4): 3-digit - 2-digit, any borrowing
 *   - Examples: 234 - 67 = 167, 567 - 89 = 478, 891 - 23 = 868
 *   - Multi-digit with potential multiple borrows
 * Type 8 (Difficulty 5): 3-digit - 3-digit, any borrowing
 *   - Examples: 534 - 278 = 256, 721 - 456 = 265, 863 - 597 = 266
 *   - Most complex, multiple borrows across all places
 */

const { randomInt, randomWithDigits, countBorrowing } = require('./utils');

function generateSubtraction(difficulty) {
    let num1, num2, question, answer;
    let attempts = 0;
    const maxAttempts = 100;
    
    switch(difficulty) {
        case 1:
            // Type 1: 1-digit - 1-digit, simple subtraction
            num2 = randomInt(1, 8);
            num1 = randomInt(num2 + 1, 9);
            break;
            
        case 2:
            // Type 3: 2-digit - 1-digit, no borrowing OR Type 4: with borrowing OR Type 5: 2-digit - 2-digit, no borrowing
            const type2Choice = Math.random();
            if (type2Choice < 0.33) {
                // Type 3: 2-digit - 1-digit, no borrowing
                do {
                    num1 = randomWithDigits(2);
                    num2 = randomInt(1, Math.min(9, num1 % 10));
                    attempts++;
                } while (countBorrowing(num1, num2) > 0 && attempts < maxAttempts);
            } else if (type2Choice < 0.66) {
                // Type 4: 2-digit - 1-digit, with borrowing
                do {
                    num1 = randomWithDigits(2);
                    num2 = randomInt(Math.max(1, (num1 % 10) + 1), 9);
                    attempts++;
                } while (countBorrowing(num1, num2) === 0 && attempts < maxAttempts);
            } else {
                // Type 5: 2-digit - 2-digit, no borrowing
                do {
                    num1 = randomWithDigits(2);
                    num2 = randomInt(10, num1 - 1);
                    attempts++;
                } while (countBorrowing(num1, num2) > 0 && attempts < maxAttempts);
            }
            break;
            
        case 3:
            // Type 6: 2-digit - 2-digit, with borrowing
            do {
                num1 = randomWithDigits(2);
                num2 = randomInt(10, num1 - 1);
                attempts++;
            } while (countBorrowing(num1, num2) === 0 && attempts < maxAttempts);
            break;
            
        case 4:
            // Type 7: 3-digit - 2-digit
            num1 = randomWithDigits(3);
            num2 = randomInt(10, 99);
            break;
            
        case 5:
            // Type 8: 3-digit - 3-digit
            num1 = randomWithDigits(3);
            num2 = randomInt(100, num1 - 1);
            break;
            
        default:
            num2 = randomInt(1, 8);
            num1 = randomInt(num2 + 1, 9);
    }
    
    answer = num1 - num2;
    question = `${num1} - ${num2}`;
    
    return { question, answer };
}

module.exports = {
    generateSubtraction
};
