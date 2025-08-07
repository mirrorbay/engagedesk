/**
 * Fraction Addition Problem Generator
 * 
 * Systematic Type Breakdown (8 types total):
 * Type 1 (Difficulty 1): Same small denominator (3-10), result < 1
 *   - Examples: 1/5 + 2/5 = 3/5, 3/8 + 2/8 = 5/8, 1/9 + 2/9 = 3/9 = 1/3
 *   - Simple numerator addition, basic fraction concepts
 * Type 2 (Difficulty 1): Same small denominator (3-10), result = 1
 *   - Examples: 2/5 + 3/5 = 1, 3/8 + 5/8 = 1, 4/9 + 5/9 = 1
 *   - Recognition of whole number results
 * Type 3 (Difficulty 2): Same medium denominator (8-20), result < 1
 *   - Examples: 7/12 + 3/12 = 10/12 = 5/6, 5/15 + 7/15 = 12/15 = 4/5
 *   - Larger denominators, simplification needed
 * Type 4 (Difficulty 2): Same medium denominator (8-20), result ≥ 1
 *   - Examples: 7/12 + 8/12 = 15/12 = 1 1/4, 11/15 + 9/15 = 20/15 = 1 1/3
 *   - Mixed number conversion required
 * Type 5 (Difficulty 3): Different denominators (simple ratios)
 *   - Examples: 1/2 + 1/4 = 3/4, 1/3 + 1/6 = 1/2, 2/5 + 1/10 = 1/2
 *   - Finding common denominators, simple relationships
 * Type 6 (Difficulty 4): Different denominators (moderate ratios)
 *   - Examples: 1/3 + 1/4 = 7/12, 2/5 + 1/6 = 17/30, 3/8 + 1/4 = 5/8
 *   - More complex common denominator finding
 * Type 7 (Difficulty 4): Different denominators (complex, small numbers)
 *   - Examples: 2/3 + 3/4 = 17/12, 3/5 + 2/7 = 31/35, 5/8 + 3/7 = 59/56
 *   - Complex LCM calculations, multiple steps
 * Type 8 (Difficulty 5): Different denominators (larger numbers)
 *   - Examples: 7/12 + 5/18 = 31/36, 11/15 + 7/20 = 65/60, 13/24 + 9/16 = 53/48
 *   - Most complex, large LCM calculations and simplification
 */

const { randomInt } = require('./utils');

// Helper functions for fractions
function findGCD(a, b) {
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function findLCM(a, b) {
    return (a * b) / findGCD(a, b);
}

function simplifyFraction(numerator, denominator) {
    const gcd = findGCD(numerator, denominator);
    const simplifiedNum = numerator / gcd;
    const simplifiedDen = denominator / gcd;
    
    if (simplifiedDen === 1) {
        return simplifiedNum.toString();
    }
    return `${simplifiedNum}/${simplifiedDen}`;
}

function generateFractionAddition(difficulty) {
    let num1, den1, num2, den2, question, answer;
    
    switch(difficulty) {
        case 1:
            // Type 1: Same small denominator, result < 1 OR Type 2: result = 1
            den1 = den2 = randomInt(3, 10);
            if (Math.random() < 0.5) {
                // Type 1: Result < 1
                num1 = randomInt(1, Math.floor(den1/2));
                num2 = randomInt(1, den1 - num1 - 1);
            } else {
                // Type 2: Result = 1
                num1 = randomInt(1, den1 - 1);
                num2 = den1 - num1;
            }
            break;
            
        case 2:
            // Type 3: Same medium denominator, result < 1 OR Type 4: result ≥ 1
            den1 = den2 = randomInt(8, 20);
            if (Math.random() < 0.5) {
                // Type 3: Result < 1
                num1 = randomInt(1, Math.floor(den1/2));
                num2 = randomInt(1, den1 - num1 - 1);
            } else {
                // Type 4: Result ≥ 1
                num1 = randomInt(Math.floor(den1/2), den1 - 1);
                num2 = randomInt(Math.floor(den1/2), den1 - 1);
            }
            break;
            
        case 3:
            // Type 5: Different denominators (simple ratios)
            const pairs = [[2,4], [3,6], [5,10], [4,8], [3,9], [2,6]];
            const pair = pairs[randomInt(0, pairs.length - 1)];
            den1 = pair[0];
            den2 = pair[1];
            num1 = randomInt(1, den1 - 1);
            num2 = randomInt(1, den2 - 1);
            break;
            
        case 4:
            // Type 6: Different denominators (moderate) OR Type 7: (complex, small numbers)
            if (Math.random() < 0.5) {
                // Type 6: Moderate ratios
                den1 = randomInt(3, 8);
                den2 = randomInt(3, 8);
                while (den2 === den1 || den1 % den2 === 0 || den2 % den1 === 0) {
                    den2 = randomInt(3, 8);
                }
                num1 = randomInt(1, den1 - 1);
                num2 = randomInt(1, den2 - 1);
            } else {
                // Type 7: Complex, small numbers
                den1 = randomInt(3, 9);
                den2 = randomInt(3, 9);
                while (den2 === den1 || den1 % den2 === 0 || den2 % den1 === 0) {
                    den2 = randomInt(3, 9);
                }
                num1 = randomInt(1, den1 - 1);
                num2 = randomInt(1, den2 - 1);
            }
            break;
            
        case 5:
            // Type 8: Different denominators (larger numbers)
            den1 = randomInt(8, 24);
            den2 = randomInt(8, 24);
            while (den2 === den1 || den1 % den2 === 0 || den2 % den1 === 0) {
                den2 = randomInt(8, 24);
            }
            num1 = randomInt(1, den1 - 1);
            num2 = randomInt(1, den2 - 1);
            break;
            
        default:
            den1 = den2 = randomInt(3, 10);
            num1 = randomInt(1, den1 - 2);
            num2 = randomInt(1, den1 - num1 - 1);
    }
    
    question = `${num1}/${den1} + ${num2}/${den2}`;
    
    // Calculate answer
    if (den1 === den2) {
        const answerNum = num1 + num2;
        const answerDen = den1;
        answer = simplifyFraction(answerNum, answerDen);
    } else {
        const lcm = findLCM(den1, den2);
        const newNum1 = num1 * (lcm / den1);
        const newNum2 = num2 * (lcm / den2);
        const answerNum = newNum1 + newNum2;
        answer = simplifyFraction(answerNum, lcm);
    }
    
    return { question, answer };
}

module.exports = {
    generateFractionAddition
};
