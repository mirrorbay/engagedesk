/**
 * Division Problem Generator
 * 
 * Systematic Type Breakdown (6 types total):
 * Type 1 (Difficulty 1): 1-digit ÷ 1-digit (exact, basic facts)
 *   - Examples: 8 ÷ 2 = 4, 9 ÷ 3 = 3, 6 ÷ 2 = 3
 *   - Basic division facts, immediate recall
 * Type 2 (Difficulty 2): 2-digit ÷ 1-digit (exact, simple)
 *   - Examples: 24 ÷ 6 = 4, 35 ÷ 7 = 5, 48 ÷ 8 = 6
 *   - Simple division with mental math
 * Type 3 (Difficulty 3): 2-digit ÷ 1-digit (exact, harder)
 *   - Examples: 84 ÷ 4 = 21, 96 ÷ 3 = 32, 72 ÷ 9 = 8
 *   - More complex division requiring steps
 * Type 4 (Difficulty 4): 3-digit ÷ 1-digit (exact)
 *   - Examples: 248 ÷ 4 = 62, 369 ÷ 3 = 123, 456 ÷ 8 = 57
 *   - Long division process with multiple steps
 * Type 5 (Difficulty 4): 2-digit ÷ 2-digit (exact)
 *   - Examples: 84 ÷ 12 = 7, 96 ÷ 16 = 6, 72 ÷ 18 = 4
 *   - Complex division with estimation and checking
 * Type 6 (Difficulty 5): 3-digit ÷ 2-digit (exact)
 *   - Examples: 248 ÷ 31 = 8, 369 ÷ 41 = 9, 456 ÷ 57 = 8
 *   - Most complex, requires multiple estimation steps
 */

const { randomInt } = require('./utils');

function generateDivision(difficulty) {
    let num1, num2, question, answer;
    
    switch(difficulty) {
        case 1:
            // Type 1: 1-digit ÷ 1-digit (basic division facts)
            num2 = randomInt(2, 9);
            const quotient = randomInt(1, 9);
            num1 = num2 * quotient;
            break;
            
        case 2:
            // Type 2: 2-digit ÷ 1-digit (simple exact)
            num2 = randomInt(2, 9);
            const quotient2 = randomInt(2, 12);
            num1 = num2 * quotient2;
            if (num1 > 99) {
                const newQuotient = randomInt(2, Math.floor(99/num2));
                num1 = num2 * newQuotient;
            }
            break;
            
        case 3:
            // Type 3: 2-digit ÷ 1-digit (harder exact)
            num2 = randomInt(2, 9);
            const quotient3 = randomInt(10, Math.floor(99/num2));
            num1 = num2 * quotient3;
            break;
            
        case 4:
            // Type 4: 3-digit ÷ 1-digit (exact) OR Type 5: 2-digit ÷ 2-digit (exact)
            if (Math.random() < 0.5) {
                // Type 4: 3-digit ÷ 1-digit (exact)
                num2 = randomInt(2, 9);
                const quotient4 = randomInt(100, Math.floor(999/num2));
                num1 = num2 * quotient4;
            } else {
                // Type 5: 2-digit ÷ 2-digit (exact)
                num2 = randomInt(10, 30);
                const quotient5 = randomInt(2, Math.floor(99/num2));
                num1 = num2 * quotient5;
            }
            break;
            
        case 5:
            // Type 6: 3-digit ÷ 2-digit (exact)
            num2 = randomInt(10, 50);
            const quotient6 = randomInt(10, Math.floor(999/num2));
            num1 = num2 * quotient6;
            break;
            
        default:
            num2 = randomInt(2, 9);
            const quotientDefault = randomInt(2, 12);
            num1 = num2 * quotientDefault;
    }
    
    answer = num1 / num2;
    question = `${num1} ÷ ${num2}`;
    
    return { question, answer };
}

module.exports = {
    generateDivision
};
