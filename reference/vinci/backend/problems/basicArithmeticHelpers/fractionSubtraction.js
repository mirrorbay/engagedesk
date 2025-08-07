/**
 * Fraction Subtraction Problem Generator
 * 
 * Systematic Type Breakdown (6 types total):
 * Type 1 (Difficulty 1): Same small denominator (3-10), simple subtraction
 *   - Examples: 4/5 - 2/5 = 2/5, 7/8 - 3/8 = 4/8 = 1/2, 5/6 - 1/6 = 4/6 = 2/3
 *   - Basic numerator subtraction, fraction concepts
 * Type 2 (Difficulty 1): Same small denominator (3-10), result close to 0
 *   - Examples: 3/5 - 2/5 = 1/5, 5/8 - 4/8 = 1/8, 4/6 - 3/6 = 1/6
 *   - Simple subtraction with small results
 * Type 3 (Difficulty 2): Same medium denominator (8-20), larger difference
 *   - Examples: 11/12 - 3/12 = 8/12 = 2/3, 13/15 - 5/15 = 8/15, 17/20 - 7/20 = 10/20 = 1/2
 *   - Larger denominators, simplification needed
 * Type 4 (Difficulty 3): Same medium denominator (8-20), closer values
 *   - Examples: 9/16 - 7/16 = 2/16 = 1/8, 11/20 - 9/20 = 2/20 = 1/10, 13/25 - 11/25 = 2/25
 *   - Close values requiring careful calculation
 * Type 5 (Difficulty 4): Different denominators (simple ratios)
 *   - Examples: 3/4 - 1/2 = 1/4, 5/6 - 1/3 = 1/2, 7/8 - 1/4 = 5/8
 *   - Finding common denominators, simple relationships
 * Type 6 (Difficulty 5): Different denominators (moderate ratios)
 *   - Examples: 5/6 - 1/4 = 7/12, 7/8 - 1/3 = 13/24, 4/5 - 1/6 = 19/30
 *   - Complex common denominator calculations
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

function generateFractionSubtraction(difficulty) {
    let num1, den1, num2, den2, question, answer;
    
    switch(difficulty) {
        case 1:
            // Type 1: Same small denominator, simple OR Type 2: result close to 0
            den1 = den2 = randomInt(3, 10);
            if (Math.random() < 0.5) {
                // Type 1: Simple subtraction
                num2 = randomInt(1, Math.floor(den1/2));
                num1 = randomInt(num2 + 1, den1 - 1);
            } else {
                // Type 2: Result close to 0
                num2 = randomInt(1, den1 - 2);
                num1 = num2 + 1;
            }
            break;
            
        case 2:
            // Type 3: Same medium denominator, larger difference
            den1 = den2 = randomInt(8, 20);
            num2 = randomInt(1, Math.floor(den1/3));
            num1 = randomInt(num2 + 3, den1 - 1);
            break;
            
        case 3:
            // Type 4: Same medium denominator, closer values
            den1 = den2 = randomInt(8, 20);
            num2 = randomInt(Math.floor(den1/2), den1 - 2);
            num1 = randomInt(num2 + 1, den1 - 1);
            break;
            
        case 4:
            // Type 5: Different denominators (simple ratios)
            const pairs = [[4,2], [6,3], [8,4], [9,3], [10,5], [12,6]];
            const pair = pairs[randomInt(0, pairs.length - 1)];
            den1 = pair[0];
            den2 = pair[1];
            num1 = randomInt(2, den1 - 1);
            num2 = randomInt(1, den2 - 1);
            break;
            
        case 5:
            // Type 6: Different denominators (moderate ratios)
            den1 = randomInt(4, 9);
            den2 = randomInt(3, 8);
            while (den2 === den1 || den1 % den2 === 0 || den2 % den1 === 0) {
                den2 = randomInt(3, 8);
            }
            num1 = randomInt(2, den1 - 1);
            num2 = randomInt(1, den2 - 1);
            break;
            
        default:
            den1 = den2 = randomInt(3, 10);
            num2 = randomInt(1, den1 - 2);
            num1 = randomInt(num2 + 1, den1 - 1);
    }
    
    question = `${num1}/${den1} - ${num2}/${den2}`;
    
    // Calculate answer
    if (den1 === den2) {
        const answerNum = num1 - num2;
        const answerDen = den1;
        answer = simplifyFraction(answerNum, answerDen);
    } else {
        const lcm = findLCM(den1, den2);
        const newNum1 = num1 * (lcm / den1);
        const newNum2 = num2 * (lcm / den2);
        const answerNum = newNum1 - newNum2;
        if (answerNum <= 0) {
            // Swap to ensure positive result
            answer = simplifyFraction(newNum2 - newNum1, lcm);
            question = `${num2}/${den2} - ${num1}/${den1}`;
        } else {
            answer = simplifyFraction(answerNum, lcm);
        }
    }
    
    return { question, answer };
}

module.exports = {
    generateFractionSubtraction
};
