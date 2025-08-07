/**
 * Utility functions for basic arithmetic problem generation
 */

// Utility function to generate random number within range
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Utility function to generate random number with specific digit count
function randomWithDigits(digits) {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return randomInt(min, max);
}

// Helper function to count carrying operations needed
function countCarrying(num1, num2) {
    let carries = 0;
    let carry = 0;
    
    while (num1 > 0 || num2 > 0) {
        const digit1 = num1 % 10;
        const digit2 = num2 % 10;
        const sum = digit1 + digit2 + carry;
        
        if (sum >= 10) {
            carries++;
            carry = 1;
        } else {
            carry = 0;
        }
        
        num1 = Math.floor(num1 / 10);
        num2 = Math.floor(num2 / 10);
    }
    
    return carries;
}

// Helper function to count borrowing operations needed
function countBorrowing(num1, num2) {
    let borrows = 0;
    let borrow = 0;
    
    while (num1 > 0 || num2 > 0) {
        let digit1 = (num1 % 10) - borrow;
        const digit2 = num2 % 10;
        
        if (digit1 < digit2) {
            borrows++;
            borrow = 1;
        } else {
            borrow = 0;
        }
        
        num1 = Math.floor(num1 / 10);
        num2 = Math.floor(num2 / 10);
    }
    
    return borrows;
}

// Helper function to evaluate a mathematical expression
function evaluateExpression(expression) {
    try {
        // Replace × with * and ÷ with / for JavaScript evaluation
        const jsExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');
        return eval(jsExpression);
    } catch (error) {
        return null;
    }
}

// Helper function to remove unnecessary parentheses that don't change calculation logic
function removeUnnecessaryParentheses(question) {
    const originalResult = evaluateExpression(question);
    if (originalResult === null) return question;
    
    // Try removing ALL parentheses and see if result is the same
    const questionWithoutParentheses = question.replace(/[()]/g, '');
    const resultWithoutParentheses = evaluateExpression(questionWithoutParentheses);
    
    // If the result is the same, we can safely remove all parentheses
    if (resultWithoutParentheses !== null && Math.abs(resultWithoutParentheses - originalResult) < 0.0001) {
        return questionWithoutParentheses;
    }
    
    // Otherwise, keep the original question with parentheses
    return question;
}

module.exports = {
    randomInt,
    randomWithDigits,
    countCarrying,
    countBorrowing,
    removeUnnecessaryParentheses
};
