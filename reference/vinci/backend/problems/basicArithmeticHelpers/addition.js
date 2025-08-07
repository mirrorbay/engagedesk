/**
 * Addition Problem Generator
 * 
 * Systematic Type Breakdown (8 types total):
 * Type 1 (Difficulty 1): 1-digit + 1-digit, no carrying
 *   - Examples: 3 + 4 = 7, 2 + 5 = 7, 1 + 6 = 7
 *   - Basic mental math, immediate recall
 * Type 2 (Difficulty 1): 1-digit + 1-digit, with carrying
 *   - Examples: 7 + 8 = 15, 9 + 6 = 15, 5 + 9 = 14
 *   - Requires carrying concept, slightly more complex
 * Type 3 (Difficulty 2): 2-digit + 1-digit, no carrying
 *   - Examples: 23 + 4 = 27, 51 + 7 = 58, 42 + 3 = 45
 *   - Place value understanding, no regrouping
 * Type 4 (Difficulty 2): 2-digit + 1-digit, with carrying
 *   - Examples: 27 + 6 = 33, 38 + 5 = 43, 49 + 7 = 56
 *   - Requires carrying from ones to tens place
 * Type 5 (Difficulty 2): 2-digit + 2-digit, no carrying
 *   - Examples: 23 + 45 = 68, 31 + 27 = 58, 42 + 36 = 78
 *   - Two-step addition without regrouping
 * Type 6 (Difficulty 3): 2-digit + 2-digit, with carrying
 *   - Examples: 27 + 46 = 73, 38 + 25 = 63, 49 + 37 = 86
 *   - Complex carrying, multiple steps
 * Type 7 (Difficulty 4): 3-digit + 2-digit, any carrying
 *   - Examples: 234 + 67 = 301, 567 + 89 = 656, 891 + 23 = 914
 *   - Multi-digit with potential multiple carries
 * Type 8 (Difficulty 5): 3-digit + 3-digit, any carrying
 *   - Examples: 234 + 567 = 801, 891 + 234 = 1125, 456 + 789 = 1245
 *   - Most complex, multiple carries across all places
 */

const { randomInt, randomWithDigits, countCarrying } = require('./utils');

function generateAddition(difficulty) {
    let num1, num2, question, answer;
    let attempts = 0;
    const maxAttempts = 100;
    
    switch(difficulty) {
        case 1:
            // Type 1: 1-digit + 1-digit, no carrying OR Type 2: with carrying
            if (Math.random() < 0.5) {
                // Type 1: No carrying
                do {
                    num1 = randomInt(1, 9);
                    num2 = randomInt(1, 9);
                    attempts++;
                } while (countCarrying(num1, num2) > 0 && attempts < maxAttempts);
            } else {
                // Type 2: With carrying
                do {
                    num1 = randomInt(1, 9);
                    num2 = randomInt(1, 9);
                    attempts++;
                } while (countCarrying(num1, num2) === 0 && attempts < maxAttempts);
            }
            break;
            
        case 2:
            // Type 3: 2-digit + 1-digit, no carrying OR Type 4: with carrying OR Type 5: 2-digit + 2-digit, no carrying
            const type2Choice = Math.random();
            if (type2Choice < 0.33) {
                // Type 3: 2-digit + 1-digit, no carrying
                do {
                    num1 = randomWithDigits(2);
                    num2 = randomInt(1, 9);
                    attempts++;
                } while (countCarrying(num1, num2) > 0 && attempts < maxAttempts);
            } else if (type2Choice < 0.66) {
                // Type 4: 2-digit + 1-digit, with carrying
                do {
                    num1 = randomWithDigits(2);
                    num2 = randomInt(1, 9);
                    attempts++;
                } while (countCarrying(num1, num2) === 0 && attempts < maxAttempts);
            } else {
                // Type 5: 2-digit + 2-digit, no carrying
                do {
                    num1 = randomWithDigits(2);
                    num2 = randomWithDigits(2);
                    attempts++;
                } while (countCarrying(num1, num2) > 0 && attempts < maxAttempts);
            }
            break;
            
        case 3:
            // Type 6: 2-digit + 2-digit, with carrying
            do {
                num1 = randomWithDigits(2);
                num2 = randomWithDigits(2);
                attempts++;
            } while (countCarrying(num1, num2) === 0 && attempts < maxAttempts);
            break;
            
        case 4:
            // Type 7: 3-digit + 2-digit
            num1 = randomWithDigits(3);
            num2 = randomWithDigits(2);
            break;
            
        case 5:
            // Type 8: 3-digit + 3-digit
            num1 = randomWithDigits(3);
            num2 = randomWithDigits(3);
            break;
            
        default:
            num1 = randomInt(1, 9);
            num2 = randomInt(1, 9);
    }
    
    answer = num1 + num2;
    question = `${num1} + ${num2}`;
    
    return { question, answer };
}

module.exports = {
    generateAddition
};
