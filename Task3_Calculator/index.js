const display = document.getElementById("display");
const keys = document.querySelector(".keys");

let currentInput = "";
let hasError = false;

// Function to safely evaluate the expression
const calculateResult = () => {
    try {
        // Evaluate the expression using a safer alternative to eval()
        // The regex replaces the 'x' for multiplication with '*'
        const cleanInput = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
        
        // Use Function constructor for safe expression evaluation
        let result = Function(`"use strict"; return (${cleanInput})`)();
        
        // Round to 8 decimal places to prevent floating point issues
        if (typeof result === 'number' && !Number.isInteger(result)) {
            result = parseFloat(result.toFixed(8));
        }

        currentInput = String(result);
        display.value = currentInput;
        hasError = false;

    } catch (e) {
        display.value = "Error";
        currentInput = "";
        hasError = true;
    }
};

keys.addEventListener("click", (e) => {
    if (!e.target.matches("button")) return;

    const button = e.target;
    const value = button.dataset.value;
    const action = button.dataset.action;

    // Clear previous error message before processing new input
    if (hasError) {
        currentInput = "";
        hasError = false;
        display.value = "";
    }

    if (value) {
        // Prevent multiple leading zeros or multiple decimal points
        if (value === '0' && currentInput === '0') return;
        if (value === '.' && currentInput.includes('.')) return; 
        
        currentInput += value;
        display.value = currentInput;
    }

    if (action === "clear") {
        currentInput = "";
        display.value = "";
    }

    if (action === "equals") {
        calculateResult();
    }
});


// Robust keyboard support
document.addEventListener("keydown", (e) => {
    const key = e.key;

    // Numbers, operators, and decimal point
    if ((key >= "0" && key <= "9") || "+-*/.".includes(key)) {
        // Map keyboard operators to display symbols
        let displayKey = key;
        if (key === '*') displayKey = '×';
        if (key === '/') displayKey = '÷';
        
        if (hasError) {
            currentInput = "";
            hasError = false;
            display.value = "";
        }
        
        currentInput += displayKey;
        display.value = currentInput;
    } 
    // Enter key for equals
    else if (key === "Enter" || key === "=") {
        e.preventDefault(); // Prevents default form submission behavior
        calculateResult();
    } 
    // Backspace key for deletion
    else if (key === "Backspace") {
        currentInput = currentInput.slice(0, -1);
        display.value = currentInput;
    } 
    // 'c' or 'C' for clear
    else if (key.toLowerCase() === "c") {
        currentInput = "";
        display.value = "";
    }
});