/**
 * Two-Step Mixed Arithmetic Problem Generator
 * 
 * Generates 2-step arithmetic problems for difficulty levels 1-2
 * 
 * Problem Types:
 * - Addition/Subtraction combinations
 * - Multiplication/Division with Addition/Subtraction
 * - Problems with and without parentheses for order of operations
 * 
 * Difficulty 1: Simple 2-step problems
 * Difficulty 2: More complex 2-step problems with carrying/borrowing
 */

const { randomInt } = require('../basicArithmeticHelpers/utils');

/**
 * Generate addition/subtraction combination problems
 */
function generateAddSubCombination(difficulty) {
    let num1, num2, num3, operation1, operation2;
    let useParentheses = Math.random() < 0.3; // 30% chance of parentheses
    
    if (difficulty === 1) {
        // Simple numbers, minimal carrying/borrowing
        num1 = randomInt(10, 50);
        num2 = randomInt(5, 20);
        num3 = randomInt(5, 20);
    } else {
        // More complex numbers
        num1 = randomInt(20, 99);
        num2 = randomInt(10, 50);
        num3 = randomInt(10, 50);
    }
    
    // Choose operations
    operation1 = Math.random() < 0.5 ? '+' : '-';
    operation2 = Math.random() < 0.5 ? '+' : '-';
    
    // Ensure result is positive
    if (operation1 === '-' && operation2 === '-') {
        if (num2 + num3 >= num1) {
            operation1 = '+';
        }
    }
    
    let question, answer;
    
    if (useParentheses) {
        // Format: num1 + (num2 - num3) or num1 - (num2 + num3)
        if (operation2 === '-' && num2 < num3) {
            // Swap to avoid negative in parentheses
            [num2, num3] = [num3, num2];
        }
        
        const parenthesesResult = operation2 === '+' ? num2 + num3 : num2 - num3;
        answer = operation1 === '+' ? num1 + parenthesesResult : num1 - parenthesesResult;
        question = `${num1} ${operation1} (${num2} ${operation2} ${num3})`;
    } else {
        // Format: num1 + num2 - num3 (left to right evaluation)
        const firstResult = operation1 === '+' ? num1 + num2 : num1 - num2;
        answer = operation2 === '+' ? firstResult + num3 : firstResult - num3;
        question = `${num1} ${operation1} ${num2} ${operation2} ${num3}`;
    }
    
    // Ensure positive result
    if (answer < 0) {
        return generateAddSubCombination(difficulty);
    }
    
    return { question, answer };
}

/**
 * Generate multiplication/division with addition/subtraction
 */
function generateMulDivWithAddSub(difficulty) {
    let num1, num2, num3;
    let useParentheses = Math.random() < 0.4; // 40% chance of parentheses
    
    if (difficulty === 1) {
        num1 = randomInt(2, 20);
        num2 = randomInt(2, 10);
        num3 = randomInt(5, 30);
    } else {
        num1 = randomInt(5, 50);
        num2 = randomInt(2, 12);
        num3 = randomInt(10, 80);
    }
    
    const operations = [
        { mul: '*', add: '+' },
        { mul: '*', add: '-' },
        { mul: '÷', add: '+' },
        { mul: '÷', add: '-' }
    ];
    
    const chosen = operations[randomInt(0, operations.length - 1)];
    
    // For division, ensure exact division
    if (chosen.mul === '÷') {
        const quotient = num2;
        num1 = num1 * quotient; // Make num1 divisible by original num1
        num2 = num1 / quotient; // This becomes the divisor
        [num1, num2] = [num2, num1]; // Swap back
    }
    
    let question, answer;
    
    if (useParentheses) {
        // Format: (num1 * num2) + num3 or num3 + (num1 * num2)
        const mulResult = chosen.mul === '*' ? num1 * num2 : num1 / num2;
        
        if (Math.random() < 0.5) {
            answer = chosen.add === '+' ? mulResult + num3 : mulResult - num3;
            question = `(${num1} ${chosen.mul} ${num2}) ${chosen.add} ${num3}`;
        } else {
            answer = chosen.add === '+' ? num3 + mulResult : num3 - mulResult;
            question = `${num3} ${chosen.add} (${num1} ${chosen.mul} ${num2})`;
        }
    } else {
        // Format: num1 * num2 + num3 (order of operations applies)
        const mulResult = chosen.mul === '*' ? num1 * num2 : num1 / num2;
        answer = chosen.add === '+' ? mulResult + num3 : mulResult - num3;
        question = `${num1} ${chosen.mul} ${num2} ${chosen.add} ${num3}`;
    }
    
    // Ensure positive result and integer answer
    if (answer < 0 || !Number.isInteger(answer)) {
        return generateMulDivWithAddSub(difficulty);
    }
    
    return { question, answer };
}

/**
 * Generate two-step arithmetic problems
 */
function generateTwoStep(difficulty) {
    const problemTypes = [
        generateAddSubCombination,
        generateMulDivWithAddSub
    ];
    
    const generator = problemTypes[randomInt(0, problemTypes.length - 1)];
    const result = generator(difficulty);
    
    return {
        question: result.question,
        answer: result.answer
    };
}

module.exports = {
    generateTwoStep,
    generateAddSubCombination,
    generateMulDivWithAddSub
};
