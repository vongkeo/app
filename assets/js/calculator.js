let displayValue = "0";
let history = [];

function updateDisplay() {
  const display = document.getElementById("display");
  display.textContent = formatNumber(displayValue);
}

function clearDisplay() {
  displayValue = "0";
  updateDisplay();
}

function addNumber(num) {
  if (displayValue === "0" || displayValue === "Error") {
    displayValue = "" + num;
  } else {
    displayValue += num;
  }
  updateDisplay();
}

function addOperator(operator) {
  if ("+-*/%".includes(displayValue.slice(-1))) return; // Prevent consecutive operators
  displayValue += operator;
  updateDisplay();
}

function toggleSign() {
  if (displayValue.startsWith("-")) {
    displayValue = displayValue.slice(1);
  } else if (displayValue !== "0") {
    displayValue = "-" + displayValue;
  }
  updateDisplay();
}

function calculateResult() {
  try {
    const result = eval(displayValue); // Evaluate the expression
    recordHistory(displayValue, result); // Record history
    displayValue = result.toString();
  } catch {
    displayValue = "Error";
  }
  updateDisplay();
}

function recordHistory(expression, result) {
  const historyList = document.getElementById("historyList");
  const formattedExpression = `${expression} = ${formatNumber(result)}`;
  history.unshift(formattedExpression); // Add to history array

  const historyItem = document.createElement("li");
  historyItem.classList.add(
    "flex",
    "justify-between",
    "items-center",
    "border-b",
    "border-gray-700",
    "pb-1"
  );
  historyItem.innerHTML = `
  <span>${formattedExpression}</span>
  <button onclick="removeHistory(this)" class="text-sm bg-red-600 px-2 py-1 rounded">Remove</button>
`;
  historyList.prepend(historyItem);

  // Limit history to 10 items
  if (history.length > 10) {
    history.pop();
    historyList.removeChild(historyList.lastChild);
  }
}

function removeHistory(button) {
  const historyItem = button.parentElement;
  historyItem.remove(); // Remove the item from the DOM
}

function formatNumber(num) {
  if (isNaN(num) || num === "Error") return num;
  return parseFloat(num).toLocaleString("en");
}

// Keyboard Support
document.addEventListener("keydown", (event) => {
  const key = event.key;
  if (!isNaN(key)) addNumber(key); // Numbers
  else if ("+-*/%".includes(key)) addOperator(key); // Operators
  else if (key === "Enter") calculateResult(); // Enter key for "="
  else if (key === "Backspace") displayValue = displayValue.slice(0, -1) || "0"; // Backspace
  updateDisplay();
});
